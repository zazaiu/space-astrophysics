// src/pages/PlanetDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPlanetToDraft } from '../store/worldsSlice';
import type { Planet } from '../types/planets';
import './PlanetDetail.css';

export const PlanetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const [planet, setPlanet] = useState<Planet | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPlanet = async () => {
      try {
        const response = await fetch(`/api/planets/${id}`);
        const data = await response.json();

        const a = Number(data.A);
        const e = Number(data.E);

        setPlanet({
          id: data.ID,
          name: data.Name,
          description: data.Description,
          imageURL: data.ImageURL,

          a,
          e,
          period: data.Period,
          t0: data.T0,
          status: data.Status,

          perihelion: isFinite(a) && isFinite(e) ? a * (1 - e) : undefined,
          aphelion: isFinite(a) && isFinite(e) ? a * (1 + e) : undefined,
        });
      } catch {
        setPlanet(null);
      }
    };

    fetchPlanet();
  }, [id]);

  if (!planet) {
    return <div style={{ color: '#fff', padding: '20px' }}>Нет данных о планете</div>;
  }

  return (
    <div style={{ color: '#fff', padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{planet.name}</h1>

      {planet.imageURL && (
        <img
          src={planet.imageURL}
          alt={planet.name}
          style={{ maxWidth: '100%', borderRadius: '10px', marginBottom: '20px' }}
        />
      )}

      <p>{planet.description}</p>

      {planet.perihelion !== undefined && (
        <p>Перигелий: {planet.perihelion.toFixed(3)}</p>
      )}

      {planet.aphelion !== undefined && (
        <p>Афелий: {planet.aphelion.toFixed(3)}</p>
      )}

      <button
        onClick={() => dispatch(addPlanetToDraft(planet))}
        style={{ marginTop: '20px', color: '#4CAF50' }}
      >
        Добавить в мир
      </button>

      <div style={{ marginTop: '20px' }}>
        <Link to="/planets" style={{ color: '#fff', textDecoration: 'underline' }}>
          Назад
        </Link>
      </div>
    </div>
  );
};
