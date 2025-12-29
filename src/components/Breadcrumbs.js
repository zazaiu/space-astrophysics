import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Breadcrumbs.tsx
import { Link, useLocation } from 'react-router-dom';
export const Breadcrumbs = () => {
    const location = useLocation();
    // Получаем путь после # для HashRouter
    const path = location.hash.replace('#', '');
    if (!path || path === '/')
        return null; // не показываем на главной
    const paths = path.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Главная', path: '/' }];
    if (paths[0] === 'planets') {
        breadcrumbs.push({ label: 'Планеты', path: '/planets' });
        if (paths[1]) {
            breadcrumbs.push({ label: 'Детали планеты' });
        }
    }
    if (paths[0] === 'world' && paths[1]) {
        breadcrumbs.push({ label: `Заявка #${paths[1]}` });
    }
    return (_jsx("div", { style: { padding: '15px 59px', backgroundColor: '#000', borderBottom: '1px solid #333', display: 'flex', gap: '30px' }, children: _jsx("div", { style: { display: 'flex', gap: '8px', fontSize: '16px' }, children: breadcrumbs.map((breadcrumb, index) => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [breadcrumb.path ? (_jsx(Link, { to: breadcrumb.path, style: {
                            color: path.endsWith(breadcrumb.path) ? '#8a2be2' : '#fff',
                            textDecoration: 'none',
                            fontWeight: path.endsWith(breadcrumb.path) ? '700' : '500',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            backgroundColor: path.endsWith(breadcrumb.path) ? '#311b77' : 'transparent',
                            transition: 'all 0.3s ease'
                        }, children: breadcrumb.label })) : (_jsx("span", { style: { color: '#fff', fontWeight: '500' }, children: breadcrumb.label })), index < breadcrumbs.length - 1 && _jsx("span", { style: { color: '#666', margin: '0 5px' }, children: "/" })] }, index))) }) }));
};
