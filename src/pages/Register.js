import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerAsync } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('guest');
    const handleRegister = async () => {
        if (!username || !password)
            return alert('Введите username и пароль');
        try {
            await dispatch(registerAsync({ username, password, role })).unwrap();
            navigate('/planets', { replace: true });
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsxs("div", { className: "auth-frame", children: [_jsx("h2", { children: "Register" }), _jsx("input", { placeholder: "Username", value: username, onChange: (e) => setUsername(e.target.value) }), _jsx("input", { type: "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value) }), _jsxs("select", { value: role, onChange: (e) => setRole(e.target.value), children: [_jsx("option", { value: "guest", children: "Guest" }), _jsx("option", { value: "astronaut", children: "Astronaut" }), _jsx("option", { value: "mission_control", children: "Mission Control" })] }), error && _jsx("p", { className: "error", children: error }), _jsx("button", { onClick: handleRegister, disabled: isLoading, children: isLoading ? 'Loading...' : 'Register' })] }));
};
export default Register;
