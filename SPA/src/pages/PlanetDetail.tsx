import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Planet, CartState } from '../types/planets';
import './PlanetDetail.css';

export const PlanetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [planet, setPlanet] = useState<Planet | null>(null);
  const [cart, setCart] = useState<CartState>({ count: 0 });
  const [loading, setLoading] = useState(true);
  const [date] = useState(new Date().toISOString().split('T')[0]);

  // Mock данные для fallback с MinIO путями
  const mockPlanets: { [key: number]: Planet } = {
    1: {
      id: 1,
      name: "Меркурий",
      description: "Ближайшая к Солнцу планета с экстремальными температурными перепадами",
      imageURL: "http://localhost:9000/planets/mercury.png",
      perihelion: 0.307,
      aphelion: 0.467
    },
    2: {
      id: 2,
      name: "Венера", 
      description: "Вторая планета от Солнца с плотной атмосферой из углекислого газа",
      imageURL: "http://localhost:9000/planets/venus.png",
      perihelion: 0.718,
      aphelion: 0.728
    },
    3: {
      id: 3,
      name: "Земля",
      description: "Третья планета от Солнца. Единственная известная планета с жизнью",
      imageURL: "http://localhost:9000/planets/earth.png",
      perihelion: 0.983,
      aphelion: 1.017
    },
    4: {
      id: 4,
      name: "Марс",
      description: "Четвертая планета от Солнца. Известен как 'Красная планета'",
      imageURL: "http://localhost:9000/planets/mars.png",
      perihelion: 1.381,
      aphelion: 1.666
    }
  };

   useEffect(() => {
    const fetchData = async () => {
      try {
        const [planetResponse, cartResponse] = await Promise.all([
          fetch(`/api/planets/${id}`),
          fetch('/api/cart')
        ]);

        if (planetResponse.ok) {
          const planetData = await planetResponse.json();
          const transformedPlanet: Planet = {
            id: planetData.ID,
            name: planetData.Name,
            description: planetData.Description,
            imageURL: planetData.ImageURL,
            perihelion: planetData.A * (1 - planetData.E),
            aphelion: planetData.A * (1 + planetData.E)
          };
          setPlanet(transformedPlanet);
        } else {
          throw new Error('API not available');
        }

        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          setCart(cartData);
        }
      } catch (error) {
        console.log('Используем mock данные:', error);
        const planetId = parseInt(id || '1');
        setPlanet(mockPlanets[planetId] || mockPlanets[1]);
        setCart({ count: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

//   const addToCart = async () => {
//     try {
//       const response = await fetch('/api/world/add-planet', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({
//           world_id: cart.worldId,
//           planet_id: planet?.id,
//           angle: 45.5,
//           distance: planet?.perihelion,
//           comment: "Добавлено через React"
//         })
//       });

//       if (response.ok) {
//         alert('Планета добавлена в заявку!');
//         const cartResponse = await fetch('/api/cart');
//         if (cartResponse.ok) {
//           const cartData = await cartResponse.json();
//           setCart(cartData);
//         }
//       } else {
//         alert('Ошибка при добавлении в заявку');
//       }
//     } catch (error) {
//       console.log('Mock: Планета добавлена в заявку (бэкенд недоступен)');
//       setCart(prev => ({ ...prev, count: prev.count + 1 }));
//     }
//   };

  if (loading) {
    return <div className="loading">Загрузка планеты...</div>;
  }

  if (!planet) {
    return <div className="loading">Планета не найдена</div>;
  }

  return (
    <div className="planet-detail-container">
      <div className="planet-detail-card">
        <img 
          src={planet.imageURL || '/images/default-planet.jpg'} 
          alt={planet.name}
          className="planet-detail-image"
          onError={(e) => {
            e.currentTarget.src = '/images/default-planet.jpg';
          }}
        />
        
        <h1 className="planet-detail-title">{planet.name}</h1>
        
        <p className="planet-detail-description">
          {planet.description}
        </p>
        
        <div className="planet-detail-info">
          <div className="info-item">
            <span className="info-label">Дата расчета:</span>
            <span className="info-value">{date}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Перигелий:</span>
            <span className="info-value">{planet.perihelion.toFixed(3)} а.е.</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Афелий:</span>
            <span className="info-value">{planet.aphelion.toFixed(3)} а.е.</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Среднее расстояние:</span>
            <span className="info-value">
              {((planet.perihelion + planet.aphelion) / 2).toFixed(3)} а.е.
            </span>
          </div>
        </div>

        <div className="planet-detail-actions">
          <button 
            //onClick={addToCart}
            className="add-to-cart-btn"
          >
            Добавить в заявку
          </button>
          
          <Link 
            to="/"
            className="back-btn"
          >
            Назад к планетам
          </Link>
        </div>
      </div>
    </div>
  );
};