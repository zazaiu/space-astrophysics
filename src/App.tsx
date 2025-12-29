import { HashRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import { PlanetsHome } from './pages/PlanetsHome';
import PlanetList from './pages/PlanetList';
import { PlanetDetail } from './pages/PlanetDetail';
import { WorldEdit } from './pages/WorldEdit';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PlanetsHome />} />

        {/* авторизация */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* планеты */}
        <Route path="/planets" element={<PlanetList />} />
        <Route path="/planets/:id" element={<PlanetDetail />} />

        {/* редактирование мира */}
        <Route path="/world/:id" element={<WorldEdit />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
