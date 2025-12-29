import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store/authSlice';
export const Navbar = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const handleLogout = () => {
        dispatch(logout());
    };
    return (_jsx("nav", { children: auth.isAuthenticated ? (_jsxs(_Fragment, { children: [_jsxs("span", { children: ["\u041F\u0440\u0438\u0432\u0435\u0442, ", auth.user?.username] }), _jsx("button", { onClick: handleLogout, children: "\u0412\u044B\u0439\u0442\u0438" })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", children: "\u0412\u043E\u0439\u0442\u0438" }), _jsx(Link, { to: "/register", children: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F" })] })) }));
};
