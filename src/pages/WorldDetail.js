import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchWorlds, completeWorld } from '../store/worldsSlice';
export const WorldDetail = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { worlds, isLoading } = useAppSelector(state => state.worlds);
    const { user } = useAppSelector(state => state.auth);
    const [world, setWorld] = useState(null);
    useEffect(() => {
        if (worlds.length === 0)
            dispatch(fetchWorlds());
    }, [dispatch, worlds.length]);
    useEffect(() => {
        if (id && worlds.length > 0) {
            const found = worlds.find(w => w.id === Number(id));
            setWorld(found ?? null);
        }
    }, [id, worlds]);
    if (isLoading)
        return _jsx("div", { style: { color: '#fff', padding: '40px', textAlign: 'center' }, children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    if (!world)
        return _jsx("div", { style: { color: '#fff', padding: '20px' }, children: "\u0417\u0430\u044F\u0432\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" });
    const planets = world.planets ?? [];
    const worldId = world.id; // гарантия типа number
    const canEdit = user?.role === 'astronaut' && world.creator_id === user.id && world.world_status === 'draft';
    const canComplete = user?.role === 'mission_control' && world.world_status === 'pending';
    return (_jsxs("div", { style: { maxWidth: '800px', margin: '50px auto', padding: '30px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }, children: [_jsxs("h2", { children: ["\u0417\u0430\u044F\u0432\u043A\u0430 #", worldId] }), _jsxs("p", { children: ["\u0421\u0442\u0430\u0442\u0443\u0441: ", world.world_status] }), _jsxs("p", { children: ["\u0421\u043E\u0437\u0434\u0430\u0442\u0435\u043B\u044C ID: ", world.creator_id] }), _jsxs("p", { children: ["\u041F\u043B\u0430\u043D\u0435\u0442: ", planets.length] }), _jsx("h3", { children: "\u041F\u043B\u0430\u043D\u0435\u0442\u044B" }), _jsx("ul", { children: planets.map(planet => (_jsxs("li", { children: [planet.name, 'status' in planet && planet.status ? ` — ${planet.status}` : ''] }, planet.id))) }), _jsxs("div", { style: { marginTop: '20px', display: 'flex', gap: '10px' }, children: [_jsx(Link, { to: "/worlds", style: { color: '#fff', textDecoration: 'underline' }, children: "\u041D\u0430\u0437\u0430\u0434" }), canEdit && _jsx(Link, { to: `/worlds/${worldId}/edit`, style: { color: '#4CAF50', textDecoration: 'underline' }, children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C" }), canComplete && worldId !== undefined && (_jsx("button", { onClick: () => dispatch(completeWorld({ id: worldId })), style: { color: '#4CAF50' }, children: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443" }))] })] }));
};
