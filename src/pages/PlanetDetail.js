import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/PlanetDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPlanetToDraft } from '../store/worldsSlice';
import './PlanetDetail.css';
export const PlanetDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [planet, setPlanet] = useState(null);
    useEffect(() => {
        if (!id)
            return;
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
            }
            catch {
                setPlanet(null);
            }
        };
        fetchPlanet();
    }, [id]);
    if (!planet) {
        return _jsx("div", { style: { color: '#fff', padding: '20px' }, children: "\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u043E \u043F\u043B\u0430\u043D\u0435\u0442\u0435" });
    }
    return (_jsxs("div", { style: { color: '#fff', padding: '30px', maxWidth: '800px', margin: '0 auto' }, children: [_jsx("h1", { children: planet.name }), planet.imageURL && (_jsx("img", { src: planet.imageURL, alt: planet.name, style: { maxWidth: '100%', borderRadius: '10px', marginBottom: '20px' } })), _jsx("p", { children: planet.description }), planet.perihelion !== undefined && (_jsxs("p", { children: ["\u041F\u0435\u0440\u0438\u0433\u0435\u043B\u0438\u0439: ", planet.perihelion.toFixed(3)] })), planet.aphelion !== undefined && (_jsxs("p", { children: ["\u0410\u0444\u0435\u043B\u0438\u0439: ", planet.aphelion.toFixed(3)] })), _jsx("button", { onClick: () => dispatch(addPlanetToDraft(planet)), style: { marginTop: '20px', color: '#4CAF50' }, children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u043C\u0438\u0440" }), _jsx("div", { style: { marginTop: '20px' }, children: _jsx(Link, { to: "/planets", style: { color: '#fff', textDecoration: 'underline' }, children: "\u041D\u0430\u0437\u0430\u0434" }) })] }));
};
