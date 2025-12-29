import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { PlanetsHome } from './pages/PlanetsHome';
import PlanetList from './pages/PlanetList';
import { PlanetDetail } from './pages/PlanetDetail';
import { WorldEdit } from './pages/WorldEdit';
function App() {
    return (_jsx(HashRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(PlanetsHome, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/planets", element: _jsx(PlanetList, {}) }), _jsx(Route, { path: "/planets/:id", element: _jsx(PlanetDetail, {}) }), _jsx(Route, { path: "/world/:id", element: _jsx(WorldEdit, {}) })] }) }));
}
export default App;
