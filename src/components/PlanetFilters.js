import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const PlanetFilters = ({ onFilter }) => {
    const [filters, setFilters] = useState({});
    // const [showAdvanced, setShowAdvanced] = useState(false); // ЗАКОММЕНТИРОВАНО
    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };
    const handleReset = () => {
        const emptyFilters = {};
        setFilters(emptyFilters);
        onFilter(emptyFilters);
    };
    return (_jsx("div", { style: { padding: '20px 34px' }, children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { style: { marginBottom: '20px', display: 'flex', gap: '10px' }, children: [_jsx("input", { type: "text", className: "search-input", placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u043B\u0430\u043D\u0435\u0442\u0443 \u0434\u043B\u044F \u043F\u043E\u0438\u0441\u043A\u0430", value: filters.name || '', onChange: (e) => setFilters({ ...filters, name: e.target.value }), style: { flex: 1 } }), _jsx("button", { type: "submit", className: "select-button", style: { width: 'auto', padding: '0 30px' }, children: "\u041D\u0430\u0439\u0442\u0438" })] }), _jsx("button", { type: "button", onClick: handleReset, style: {
                        padding: '15px 30px',
                        borderRadius: '12px',
                        border: '2px solid #311b77',
                        backgroundColor: 'transparent',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }, children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C" })] }) }));
};
