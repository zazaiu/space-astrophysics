import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setPlanetName, resetFilters } from '../store/filtersSlice';
import type { Planet } from '../types/planets';
import './PlanetList.css';
import { API_BASE } from '../target_config'; // Добавляем импорт

export const PlanetList: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState(true);
  
  const filters = useAppSelector((state) => state.filters);
  const dispatch = useAppDispatch();

  const mockPlanets: Planet[] = [
    {
      id: 1, 
      name: "Меркурий", 
      description: "Ближайшая к Солнцу планета",
      imageURL: "http://localhost:9000/planets/mercury.png", // Используем локальный для fallback
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
        
        if (filters.planetName && filters.planetName.trim() !== '') {
          queryParams.append('q', filters.planetName.trim());
        }

        // Используем API_BASE из конфига
        const planetsResponse = await fetch(`${API_BASE}/api/planets?${queryParams}`);

        if (cancelled) return;

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

      } catch (error) {
        if (cancelled) return;
        
        console.log('Используем mock данные для планет:', error);
        let filteredPlanets = mockPlanets;
        if (filters.planetName && filters.planetName.trim() !== '') {
          filteredPlanets = mockPlanets.filter(planet =>
            planet.name.toLowerCase().includes(filters.planetName.toLowerCase())
          );
        }
        setPlanets(filteredPlanets);
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
  }, [filters.planetName]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handlePlanetNameChange = (name: string) => {
    dispatch(setPlanetName(name));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/images/default-planet.jpg';
  };

  if (loading) {
    return (
      <div className="frame">
        <div className="loading">Загрузка планет...</div>
      </div>
    );
  }

  return (
    <div className="frame">
      
      {/* Упрощенный поиск */}
      <div style={{ padding: '20px 34px' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              className="search-input"
              placeholder="Введите название планеты для поиска"
              value={filters.planetName}
              onChange={(e) => handlePlanetNameChange(e.target.value)}
              style={{ flex: 1 }}
            />
            <button 
              type="submit" 
              className="select-button"
              style={{ width: 'auto', padding: '0 30px' }}
            >
              Найти
            </button>
          </div>

          {/* Кнопки управления - оставляем только Сбросить */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
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
          </div>
        </form>
      </div>

      {/* Адаптивная сетка планет */}
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