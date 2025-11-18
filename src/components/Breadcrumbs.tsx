import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.pathname.split('/').filter(path => path);
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Главная', path: '/' },
      { label: 'Планеты', path: '/planets' }
    ];

    if (paths[0] === 'planets' && paths[1]) {
      breadcrumbs.push({ label: 'Детали планеты' });
    } else if (paths[0] === 'world' && paths[1]) {
      breadcrumbs.push({ label: `Заявка #${paths[1]}` });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div style={{
      padding: '15px 59px',
      backgroundColor: '#000',
      borderBottom: '1px solid #333',
      display: 'flex',
      alignItems: 'center',
      gap: '30px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {breadcrumb.path ? (
              <Link 
                to={breadcrumb.path}
                style={{
                  color: location.pathname === breadcrumb.path ? '#8a2be2' : '#fff',
                  textDecoration: 'none',
                  fontWeight: location.pathname === breadcrumb.path ? '700' : '500',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: location.pathname === breadcrumb.path ? '#311b77' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                {breadcrumb.label}
              </Link>
            ) : (
              <span style={{ color: '#fff', fontWeight: '500' }}>
                {breadcrumb.label}
              </span>
            )}
            
            {index < breadcrumbs.length - 1 && (
              <span style={{ color: '#666', margin: '0 5px' }}>/</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};