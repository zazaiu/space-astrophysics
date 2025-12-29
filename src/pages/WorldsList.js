import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
export const WorldsList = () => {
    const { planetId } = useParams();
    const [worlds, setWorlds] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`/api/worlds?planetId=${planetId}`);
                if (!res.ok)
                    throw new Error('Ошибка загрузки миров');
                const data = await res.json();
                setWorlds(data);
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        load();
    }, [planetId]);
    if (loading)
        return _jsx("div", { children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043C\u0438\u0440\u043E\u0432..." });
    return (_jsxs("div", { style: { padding: 30 }, children: [_jsxs("h2", { style: { color: '#fff' }, children: ["\u041C\u0438\u0440\u044B \u043F\u043B\u0430\u043D\u0435\u0442\u044B ", planetId] }), worlds.length === 0 && (_jsx("p", { style: { color: '#bbb' }, children: "\u041D\u0435\u0442 \u043C\u0438\u0440\u043E\u0432" })), worlds.map(world => (_jsxs("div", { style: {
                    background: '#ffffff0a',
                    padding: 15,
                    borderRadius: 12,
                    marginBottom: 12,
                    border: '1px solid #311b77',
                    color: '#fff'
                }, children: [_jsx("strong", { children: "ID \u043C\u0438\u0440\u0430:" }), " ", world.id, _jsx("br", {}), _jsx("strong", { children: "\u0421\u0442\u0430\u0442\u0443\u0441:" }), " ", world.world_status] }, world.id)))] }));
};
export default WorldsList;
