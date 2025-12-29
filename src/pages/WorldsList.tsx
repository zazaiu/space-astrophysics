import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface World {
  id: number;
  world_status: string;
  created_at?: string;
}

export const WorldsList: React.FC = () => {
  const { planetId } = useParams();
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/worlds?planetId=${planetId}`);
        if (!res.ok) throw new Error('Ошибка загрузки миров');

        const data = await res.json();
        setWorlds(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [planetId]);

  if (loading) return <div>Загрузка миров...</div>;

  return (
    <div style={{ padding: 30 }}>
      <h2 style={{ color: '#fff' }}>Миры планеты {planetId}</h2>

      {worlds.length === 0 && (
        <p style={{ color: '#bbb' }}>Нет миров</p>
      )}

      {worlds.map(world => (
        <div
          key={world.id}
          style={{
            background: '#ffffff0a',
            padding: 15,
            borderRadius: 12,
            marginBottom: 12,
            border: '1px solid #311b77',
            color: '#fff'
          }}
        >
          <strong>ID мира:</strong> {world.id}<br />
          <strong>Статус:</strong> {world.world_status}
        </div>
      ))}
    </div>
  );
};

export default WorldsList;
