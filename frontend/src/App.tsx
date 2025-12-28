import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Breadcrumbs } from './components/Breadcrumbs';
import { PlanetList } from './pages/PlanetList';
import { PlanetDetail } from './pages/PlanetDetail';
import { WorldDetail } from './pages/WorldDetail';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Breadcrumbs />
      <Routes>
      <Route path="/" element={<PlanetList />} />
      <Route path="/planets" element={<PlanetList />} /> // Оставляем для обратной совместимости
      <Route path="/planets/:id" element={<PlanetDetail />} />
      <Route path="/world/:id" element={<WorldDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;