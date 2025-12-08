// src/pages/WorldDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { World, PlanetPosition } from '../types/planets';

export const WorldDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [world, setWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchWorld = async () => {
      try {
        const response = await fetch(`/api/worlds/${id}`);
        if (response.ok) {
          const worldData = await response.json();
          setWorld(worldData);
        } else {
          throw new Error('World not found');
        }
      } catch (error) {
        // Mock данные для демонстрации
        const mockWorld: World = {
          id: parseInt(id || '1'),
          date: new Date().toISOString().split('T')[0],
          results: [
            {
              planet: {
                id: 1,
                name: "Меркурий",
                description: "Ближайшая к Солнцу планета",
                imageURL: "/images/mercury.jpg",
                perihelion: 0.307,
                aphelion: 0.467
              },
              r_au: 0.387,
              nu_deg: 45.5
            },
            {
              planet: {
                id: 2,
                name: "Венера", 
                description: "Вторая планета от Солнца",
                imageURL: "/images/venus.jpg",
                perihelion: 0.718,
                aphelion: 0.728
              },
              r_au: 0.723,
              nu_deg: 120.3
            }
          ]
        };
        setWorld(mockWorld);
      } finally {
        setLoading(false);
      }
    };

    fetchWorld();
  }, [id]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    // Здесь можно добавить запрос к API для пересчета позиций на новую дату
  };

  const handleDeleteWorld = async () => {
    if (window.confirm('Вы уверены, что хотите удалить заявку?')) {
      try {
        const response = await fetch(`/api/worlds/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          alert('Заявка удалена');
          window.location.href = '/planets';
        }
      } catch (error) {
        console.log('Mock: Заявка удалена (бэкенд недоступен)');
        window.location.href = '/planets';
      }
    }
  };

  if (loading) {
    return <div className="loading">Загрузка заявки...</div>;
  }

  if (!world) {
    return <div className="loading">Заявка не найдена</div>;
  }

  return (
    <div style={{ 
      margin: 0, 
      padding: 0, 
      backgroundColor: '#000', 
      color: '#fff', 
      fontFamily: "'Space Grotesk', sans-serif",
      minHeight: '100vh'
    }}>
      <div style={{ 
        width: '1200px', 
        margin: '40px auto',
        padding: '20px'
      }}>
        <div style={{ 
          textAlign: 'center', 
          fontSize: '32px', 
          marginBottom: '20px' 
        }}>
          space&astrophysics. Расчет положения планет
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          fontSize: '40px', 
          marginBottom: '30px' 
        }}>
          Заявка №{world.id} — 
          <form style={{ display: 'inline' }}>
            <input 
              type="date" 
              name="date" 
              value={date}
              onChange={handleDateChange}
              style={{
                marginLeft: '10px',
                padding: '5px',
                borderRadius: '4px',
                border: '1px solid #311b77',
                backgroundColor: 'transparent',
                color: '#fff',
                fontSize: '20px'
              }}
            />
          </form>
        </div>

        {world.results.map((result: PlanetPosition, index: number) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <img 
              src={result.planet.imageURL || '/images/default-planet.jpg'} 
              alt={result.planet.name}
              style={{ 
                width: '80px', 
                height: '80px', 
                marginRight: '20px', 
                borderRadius: '50%' 
              }}
              onError={(e) => {
                e.currentTarget.src = '/images/default-planet.jpg';
              }}
            />
            
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div style={{ margin: '0 10px' }}>
                <strong>{result.planet.name}</strong><br />
                <small style={{ color: '#aaa' }}>{result.planet.description}</small>
              </div>
              
              <div style={{ margin: '0 10px' }}>
                Расстояние: {result.r_au.toFixed(3)} a.e.
              </div>
              
              <div style={{ margin: '0 10px' }}>
                Угол: {result.nu_deg.toFixed(2)}°
              </div>
              
              <div style={{ margin: '0 10px' }}>
                <input 
                  type="text" 
                  name={`comment_${result.planet.id}`}
                  placeholder="Комментарий"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    width: '200px',
                    backgroundColor: 'transparent',
                    color: '#fff'
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          display: 'flex',
          justifyContent: 'center',
          gap: '30px'
        }}>
          <button 
            onClick={handleDeleteWorld}
            style={{
              padding: '12px 24px',
              fontSize: '20px',
              borderRadius: '8px',
              border: '2px solid #FF4C4C',
              color: '#fff',
              cursor: 'pointer',
              backgroundColor: '#A21919'
            }}
          >
            Удалить заявку
          </button>
          
          <Link 
            to="/planets"
            style={{
              padding: '12px 24px',
              fontSize: '20px',
              borderRadius: '8px',
              border: '2px solid #A2A2A2',
              color: '#fff',
              textDecoration: 'none',
              cursor: 'pointer',
              backgroundColor: '#2B2B2B',
              display: 'inline-block'
            }}
          >
             К списку планет
          </Link>
        </div>
      </div>
    </div>
  );
};