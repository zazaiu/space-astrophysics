import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import "./PlanetList.css";
// === ДЕБАУНС БЕЗ LODASH ===
const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};
export const PlanetList = () => {
    const [planets, setPlanets] = useState([]);
    const [cart, setCart] = useState({ count: 0, user_id: -1 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(""); // ← только поиск
    // -----------------------------
    // ДЕБАУНС ПОИСКА
    // -----------------------------
    const debouncedSearch = useCallback(debounce((value) => {
        fetchPlanets(value);
    }, 400), []);
    useEffect(() => {
        fetchCart();
        fetchPlanets("");
    }, []);
    // -----------------------------
    // API — ЗАГРУЗКА ПЛАНЕТ
    // -----------------------------
    const fetchPlanets = async (query) => {
        try {
            setLoading(true);
            const url = query.trim()
                ? `/api/planets?q=${encodeURIComponent(query.trim())}`
                : `/api/planets`;
            const response = await fetch(url);
            if (!response.ok)
                throw new Error("Ошибка загрузки планет");
            const data = await response.json();
            const formatted = data.map((p) => ({
                id: p.id ?? p.ID,
                name: p.name ?? p.Name,
                description: p.description ?? p.Description,
                imageURL: p.imageURL ?? p.ImageURL,
            }));
            setPlanets(formatted);
        }
        catch (e) {
            console.error("Ошибка загрузки планет:", e);
        }
        finally {
            setLoading(false);
        }
    };
    // -----------------------------
    // API — ЗАГРУЗКА КОРЗИНЫ
    // -----------------------------
    const fetchCart = async () => {
        try {
            const res = await fetch("/api/cart", { credentials: "include" });
            if (!res.ok)
                return;
            const data = await res.json();
            setCart(data);
        }
        catch {
            setCart({ count: 0, user_id: -1 });
        }
    };
    // -----------------------------
    // ON INPUT (поиск)
    // -----------------------------
    const handleSearch = (value) => {
        setSearch(value);
        debouncedSearch(value);
    };
    const handleImageError = (e) => {
        e.target.src = "/images/default-planet.jpg";
    };
    // -------------------------------------------------------
    if (loading) {
        return _jsx("div", { className: "loading", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043F\u043B\u0430\u043D\u0435\u0442..." });
    }
    return (_jsxs("div", { className: "frame", children: [_jsx("div", { className: "header" }), _jsx("div", { className: "header-cart-wrapper", children: _jsx("div", { className: "cart-wrapper", children: cart.count > 0 ? (_jsxs(Link, { to: `/world/${cart.worldId}`, className: "cart-container cart-active", children: [_jsx("span", { className: "cart-emoji", children: "\uD83D\uDED2" }), _jsx("span", { className: "cart-count", children: cart.count })] })) : (_jsxs("div", { className: "cart-container cart-inactive", children: [_jsx("span", { className: "cart-emoji", children: "\uD83D\uDED2" }), _jsx("span", { className: "cart-count", children: cart.count })] })) }) }), _jsx("div", { className: "search-wrapper", children: _jsx("input", { type: "text", className: "search-input", placeholder: "\u041F\u043E\u0438\u0441\u043A \u043F\u043B\u0430\u043D\u0435\u0442\u044B...", value: search, onChange: (e) => handleSearch(e.target.value) }) }), _jsxs("div", { className: "planets-grid", children: [planets.map((planet) => (_jsxs("div", { className: "planet-card", children: [_jsx("img", { className: "planet-image", src: planet.imageURL, alt: planet.name, onError: handleImageError, loading: "lazy" }), _jsx("h3", { className: "planet-name", children: planet.name }), _jsx("p", { className: "planet-description", children: planet.description }), _jsx(Link, { to: `/planets/${planet.id}`, className: "select-button", children: "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435" })] }, planet.id))), planets.length === 0 && (_jsx("div", { className: "no-results", children: "\u041F\u043B\u0430\u043D\u0435\u0442\u044B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B" }))] })] }));
};
export default PlanetList;
