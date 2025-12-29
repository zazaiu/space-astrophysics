import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppSelector } from '../store/hooks';
export const Profile = () => {
    const { user } = useAppSelector((state) => state.auth);
    if (!user) {
        return _jsx("div", { style: { color: '#fff', padding: '20px' }, children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D" });
    }
    return (_jsxs("div", { style: {
            maxWidth: '600px',
            margin: '50px auto',
            padding: '30px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px'
        }, children: [_jsx("h2", { style: { color: '#fff', marginBottom: '20px' }, children: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" }), _jsxs("div", { style: { color: '#fff', marginBottom: '15px' }, children: [_jsx("strong", { children: "\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F:" }), " ", user.username] }), _jsxs("div", { style: { color: '#fff', marginBottom: '15px' }, children: [_jsx("strong", { children: "\u0420\u043E\u043B\u044C:" }), " ", user.role] }), _jsxs("div", { style: { color: '#fff', marginBottom: '15px' }, children: [_jsx("strong", { children: "ID:" }), " ", user.id] })] }));
};
