import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async () => {
        if (!username || !password)
            return alert('Введите username и пароль');
        try {
            await dispatch(loginAsync({ username, password })).unwrap();
            navigate('/planets', { replace: true });
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsxs("div", { className: "auth-frame", children: [_jsx("h2", { children: "Login" }), _jsx("input", { placeholder: "Username", value: username, onChange: (e) => setUsername(e.target.value) }), _jsx("input", { type: "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value) }), error && _jsx("p", { className: "error", children: error }), _jsx("button", { onClick: handleLogin, disabled: isLoading, children: isLoading ? 'Loading...' : 'Login' })] }));
};
export default Login;
