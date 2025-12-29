import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Planet } from '../types/planets';
import type { World } from '../services/api/generated/models/World';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchWorlds, completeWorld } from '../store/worldsSlice';

export const WorldDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { worlds, isLoading } = useAppSelector(state => state.worlds);
  const { user } = useAppSelector(state => state.auth);
  const [world, setWorld] = useState<World | null>(null);

  useEffect(() => {
    if (worlds.length === 0) dispatch(fetchWorlds());
  }, [dispatch, worlds.length]);

  useEffect(() => {
    if (id && worlds.length > 0) {
      const found = worlds.find(w => w.id === Number(id));
      setWorld(found ?? null);
    }
  }, [id, worlds]);

  if (isLoading) return <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>Загрузка...</div>;
  if (!world) return <div style={{ color: '#fff', padding: '20px' }}>Заявка не найдена</div>;

  const planets = world.planets ?? [];
  const worldId = world.id; // гарантия типа number

  const canEdit = user?.role === 'astronaut' && world.creator_id === user.id && world.world_status === 'draft';
  const canComplete = user?.role === 'mission_control' && world.world_status === 'pending';

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '30px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }}>
      <h2>Заявка #{worldId}</h2>
      <p>Статус: {world.world_status}</p>
      <p>Создатель ID: {world.creator_id}</p>
      <p>Планет: {planets.length}</p>

      <h3>Планеты</h3>
      <ul>
        {planets.map(planet => (
          <li key={planet.id}>
            {planet.name}
            {'status' in planet && planet.status ? ` — ${planet.status}` : ''}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <Link to="/worlds" style={{ color: '#fff', textDecoration: 'underline' }}>Назад</Link>
        {canEdit && <Link to={`/worlds/${worldId}/edit`} style={{ color: '#4CAF50', textDecoration: 'underline' }}>Редактировать</Link>}
        {canComplete && worldId !== undefined && (
          <button
            onClick={() => dispatch(completeWorld({ id: worldId }))}
            style={{ color: '#4CAF50' }}
          >
            Завершить заявку
          </button>
        )}
      </div>
    </div>
  );
};
