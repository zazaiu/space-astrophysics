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
      { label: 'Главная', path: '/' }
    ];

    if (paths[0] === 'planets') {
      breadcrumbs.push({ label: 'Планеты', path: '/planets' });
      
      if (paths[1]) {
        breadcrumbs.push({ label: 'Детали планеты' });
      }
    } else if (paths[0] === 'world' && paths[1]) {
      breadcrumbs.push(
        { label: 'Планеты', path: '/planets' },
        { label: `Заявка #${paths[1]}` }
      );
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div style={{
      padding: '15px 59px',
      backgroundColor: '#000',
      borderBottom: '1px solid #333'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {breadcrumb.path ? (
              <Link 
                to={breadcrumb.path}
                style={{
                  color: '#8a2be2',
                  textDecoration: 'none',
                  fontWeight: '500'
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