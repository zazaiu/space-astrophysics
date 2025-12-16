import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Planet, CartState, FilterParams } from '../types/planets';

export const PlanetList: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [cart, setCart] = useState<CartState>({ 
    count: 0, 
    user_id: -1 
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterParams>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Mock данные для fallback
  const mockPlanets: Planet[] = [
    {
      id: 1, 
      name: "Меркурий", 
      description: "Ближайшая к Солнцу планета",
      imageURL: "http://localhost:9000/planets/mercury.png",
      perihelion: 0.307, 
      aphelion: 0.467
    },
    {
      id: 2, 
      name: "Венера", 
      description: "Вторая планета от Солнца", 
      imageURL: "http://localhost:9000/planets/venus.png",
      perihelion: 0.718, 
      aphelion: 0.728
    },
    {
      id: 3, 
      name: "Земля", 
      description: "Наш дом",
      imageURL: "http://localhost:9000/planets/earth.png",
      perihelion: 0.983, 
      aphelion: 1.017
    },
    {
      id: 4, 
      name: "Марс", 
      description: "Красная планета",
      imageURL: "http://localhost:9000/planets/mars.png",
      perihelion: 1.381, 
      aphelion: 1.666
    }
  ];

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        
        // Добавляем фильтр по имени (параметр 'q' как в бэкенде)
        if (filters.name && filters.name.trim() !== '') {
          queryParams.append('q', filters.name.trim());
        }

        const [planetsResponse, cartResponse] = await Promise.all([
          fetch(`/api/planets?${queryParams}`),
          fetch('/api/cart') // Теперь всегда должен возвращать 200
        ]);

        if (cancelled) return;

        // Обработка планет
        if (planetsResponse.ok) {
          const planetsData = await planetsResponse.json();
          const formattedPlanets = planetsData.map((planet: any) => ({
            id: planet.ID || planet.id,
            name: planet.Name || planet.name,
            description: planet.Description || planet.description,
            imageURL: planet.ImageURL || planet.imageURL,
            perihelion: planet.A ? planet.A * (1 - (planet.E || 0)) : 0,
            aphelion: planet.A ? planet.A * (1 + (planet.E || 0)) : 0
          }));
          setPlanets(formattedPlanets);
        } else {
          throw new Error(`HTTP error! status: ${planetsResponse.status}`);
        }

        // Обработка корзины - теперь всегда ожидаем 200
        if (cartResponse.ok) {
          try {
            const cartData = await cartResponse.json();
            if (!cancelled) {
              setCart(cartData);
            }
          } catch (error) {
            console.log('Ошибка парсинга корзины, используем данные по умолчанию');
            if (!cancelled) {
              setCart({ 
                count: 0, 
                user_id: -1 
              });
            }
          }
        } else {
          console.log('Неожиданная ошибка корзины, используем данные по умолчанию');
          if (!cancelled) {
            setCart({ 
              count: 0, 
              user_id: -1 
            });
          }
        }

      } catch (error) {
        if (cancelled) return;
        
        console.log('Используем mock данные для планет:', error);
        // Фильтруем mock данные по имени
        let filteredPlanets = mockPlanets;
        if (filters.name && filters.name.trim() !== '') {
          filteredPlanets = mockPlanets.filter(planet =>
            planet.name.toLowerCase().includes(filters.name!.toLowerCase())
          );
        }
        setPlanets(filteredPlanets);
        // Для корзины используем данные по умолчанию
        setCart({ 
          count: 0, 
          user_id: -1 
        });
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  // Остальные функции без изменений
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleResetFilters = () => {
    setFilters({});
    setShowAdvanced(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/images/default-planet.jpg';
  };

  if (loading) {
    return (
      <div className="frame">
        <div className="header"></div>
        <div className="loading">Загрузка планет...</div>
      </div>
    );
  }

  return (
    <div className="frame">
      <div className="header"></div>

      <div className="header-cart-wrapper">
        <div className="cart-wrapper">
          {/* Показываем активную корзину только если count > 0 */}
          {cart.count > 0 ? (
            <Link 
              to={`/world/${cart.worldId}`} 
              className="cart-container cart-active" 
              title="Открыть заявку"
            >
              <span className="cart-emoji">🛒</span>
              <span className="cart-count">{cart.count}</span>
            </Link>
          ) : (
            <div className="cart-container cart-inactive" title="Заявок нет">
              <span className="cart-emoji">🛒</span>
              <span className="cart-count">{cart.count}</span>
            </div>
          )}
        </div>
      </div>

      {/* Остальной JSX без изменений */}
      <div style={{ padding: '20px 34px' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input 
              type="text" 
              className="search-input"
              placeholder="Введите название планеты для поиска"
              value={filters.name || ''}
              onChange={(e) => setFilters({...filters, name: e.target.value})}
            />
          </div>

          {showAdvanced && (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '15px',
              marginBottom: '20px',
              padding: '20px',
              backgroundColor: '#ffffff0a',
              borderRadius: '12px',
              border: '2px solid #311b77'
            }}>
              <div>
                <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px' }}>
                  Дата от
                </label>
                <input 
                  type="date"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #311b77',
                    backgroundColor: 'transparent',
                    color: '#fff'
                  }}
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px' }}>
                  Дата до
                </label>
                <input 
                  type="date"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #311b77',
                    backgroundColor: 'transparent',
                    color: '#fff'
                  }}
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                />
              </div>
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              type="submit" 
              className="select-button"
              style={{ width: 'auto', padding: '0 30px' }}
            >
              Применить фильтры
            </button>
            
            <button 
              type="button"
              onClick={handleResetFilters}
              style={{
                padding: '15px 30px',
                borderRadius: '12px',
                border: '2px solid #311b77',
                backgroundColor: 'transparent',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Сбросить
            </button>
            
            <button 
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                padding: '15px 30px',
                borderRadius: '12px',
                border: '2px solid #8a2be2',
                backgroundColor: 'transparent',
                color: '#8a2be2',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {showAdvanced ? 'Скрыть фильтры' : 'Расширенные фильтры'}
            </button>
          </div>
        </form>
      </div>

      <div className="planets-grid">
        {planets.map(planet => (
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
            <p className="perihelion">Перигелий: {planet.perihelion.toFixed(3)} a.e.</p>
            <p className="aphelion">Афелий: {planet.aphelion.toFixed(3)} a.e.</p>
            <Link to={`/planets/${planet.id}`} className="select-button">
              Выбор
            </Link>
          </div>
        ))}
        {planets.length === 0 && (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '40px',
            backgroundColor: '#ffffff1c',
            borderRadius: '18px'
          }}>
            <p style={{ fontSize: '24px', color: '#fff', marginBottom: '20px' }}>
              Планеты не найдены
            </p>
            <p style={{ color: '#ffffffcc', fontSize: '18px' }}>
              Попробуйте изменить параметры поиска
            </p>
          </div>
        )}
      </div>
    </div>
  );
};