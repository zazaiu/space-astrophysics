import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Navbar } from './components/Navbar';
import { PlanetsHome } from './pages/PlanetsHome';
import { Breadcrumbs } from './components/Breadcrumbs';
import { PlanetList } from './pages/PlanetList';
import { PlanetDetail } from './pages/PlanetDetail';
import { WorldDetail } from './pages/WorldDetail';
import './App.css';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <Breadcrumbs />
          <Routes>
            <Route path="/" element={<PlanetsHome />} />
            <Route path="/planets" element={<PlanetList />} />
            <Route path="/planets/:id" element={<PlanetDetail />} />
            <Route path="/world/:id" element={<WorldDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;