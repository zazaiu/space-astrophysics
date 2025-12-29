// src/App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import { PlanetsHome } from './pages/PlanetsHome';
import PlanetList from './pages/PlanetList';
import { PlanetDetail } from './pages/PlanetDetail';
import { WorldEdit } from './pages/WorldEdit';
import { Breadcrumbs } from './components/Breadcrumbs';

function App() {
  return (
    <HashRouter basename="/space-astrophysics">
      {/* Хлебные крошки */}
      <Breadcrumbs />

      <Routes>
        {/* Главная */}
        <Route path="/" element={<PlanetsHome />} />

        {/* Авторизация */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Планеты */}
        <Route path="/planets" element={<PlanetList />} />
        <Route path="/planets/:id" element={<PlanetDetail />} />

        {/* Редактирование мира */}
        <Route path="/world/:id" element={<WorldEdit />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
