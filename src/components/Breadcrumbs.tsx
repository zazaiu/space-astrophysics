// src/components/Breadcrumbs.tsx
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();

  // Получаем путь после # для HashRouter
  const path = location.hash.replace('#', '');
  if (!path || path === '/') return null; // не показываем на главной

  const paths = path.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Главная', path: '/' }];

  if (paths[0] === 'planets') {
    breadcrumbs.push({ label: 'Планеты', path: '/planets' });
    if (paths[1]) {
      breadcrumbs.push({ label: 'Детали планеты' });
    }
  }

  if (paths[0] === 'world' && paths[1]) {
    breadcrumbs.push({ label: `Заявка #${paths[1]}` });
  }

  return (
    <div style={{ padding: '15px 59px', backgroundColor: '#000', borderBottom: '1px solid #333', display: 'flex', gap: '30px' }}>
      <div style={{ display: 'flex', gap: '8px', fontSize: '16px' }}>
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {breadcrumb.path ? (
              <Link
                to={breadcrumb.path}
                style={{
                  color: path.endsWith(breadcrumb.path) ? '#8a2be2' : '#fff',
                  textDecoration: 'none',
                  fontWeight: path.endsWith(breadcrumb.path) ? '700' : '500',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: path.endsWith(breadcrumb.path) ? '#311b77' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                {breadcrumb.label}
              </Link>
            ) : (
              <span style={{ color: '#fff', fontWeight: '500' }}>{breadcrumb.label}</span>
            )}
            {index < breadcrumbs.length - 1 && <span style={{ color: '#666', margin: '0 5px' }}>/</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
