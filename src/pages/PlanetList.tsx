import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import type { Planet, CartState } from '../types/planets'
import "./PlanetList.css"

// === ДЕБАУНС БЕЗ LODASH ===
const debounce = (func: Function, delay: number) => {
  let timer: any
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => func(...args), delay)
  }
}

export const PlanetList: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([])
  const [cart, setCart] = useState<CartState>({ count: 0, user_id: -1 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")   // ← только поиск

  // -----------------------------
  // ДЕБАУНС ПОИСКА
  // -----------------------------
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      fetchPlanets(value)
    }, 400),
    []
  )

  useEffect(() => {
    fetchCart()
    fetchPlanets("")
  }, [])

  // -----------------------------
  // API — ЗАГРУЗКА ПЛАНЕТ
  // -----------------------------
  const fetchPlanets = async (query: string) => {
    try {
      setLoading(true)

      const url = query.trim()
        ? `/api/planets?q=${encodeURIComponent(query.trim())}`
        : `/api/planets`

      const response = await fetch(url)

      if (!response.ok) throw new Error("Ошибка загрузки планет")

      const data = await response.json()

      const formatted = data.map((p: any) => ({
        id: p.id ?? p.ID,
        name: p.name ?? p.Name,
        description: p.description ?? p.Description,
        imageURL: p.imageURL ?? p.ImageURL,
      }))

      setPlanets(formatted)
    } catch (e) {
      console.error("Ошибка загрузки планет:", e)
    } finally {
      setLoading(false)
    }
  }

  // -----------------------------
  // API — ЗАГРУЗКА КОРЗИНЫ
  // -----------------------------
  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart", { credentials: "include" })

      if (!res.ok) return

      const data = await res.json()
      setCart(data)
    } catch {
      setCart({ count: 0, user_id: -1 })
    }
  }

  // -----------------------------
  // ON INPUT (поиск)
  // -----------------------------
  const handleSearch = (value: string) => {
    setSearch(value)
    debouncedSearch(value)
  }

  const handleImageError = (e: any) => {
    e.target.src = "/images/default-planet.jpg"
  }

  // -------------------------------------------------------

  if (loading) {
    return <div className="loading">Загрузка планет...</div>
  }

  return (
    <div className="frame">
      <div className="header"></div>

      {/* === КОРЗИНА === */}
      <div className="header-cart-wrapper">
        <div className="cart-wrapper">
          {cart.count > 0 ? (
            <Link
              to={`/world/${cart.worldId}`}
              className="cart-container cart-active"
            >
              <span className="cart-emoji">🛒</span>
              <span className="cart-count">{cart.count}</span>
            </Link>
          ) : (
            <div className="cart-container cart-inactive">
              <span className="cart-emoji">🛒</span>
              <span className="cart-count">{cart.count}</span>
            </div>
          )}
        </div>
      </div>

      {/* === ПОИСК === */}
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Поиск планеты..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* === СПИСОК ПЛАНЕТ === */}
      <div className="planets-grid">
        {planets.map((planet) => (
          <div key={planet.id} className="planet-card">
            <img
              className="planet-image"
              src={planet.imageURL}
              alt={planet.name}
              onError={handleImageError}
              loading="lazy"
            />

            <h3 className="planet-name">{planet.name}</h3>
            <p className="planet-description">{planet.description}</p>

            <Link to={`/planets/${planet.id}`} className="select-button">
              Подробнее
            </Link>
          </div>
        ))}

        {planets.length === 0 && (
          <div className="no-results">
            Планеты не найдены
          </div>
        )}
      </div>
    </div>
  )
}

export default PlanetList
