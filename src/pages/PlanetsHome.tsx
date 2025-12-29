import { Link } from 'react-router-dom';
import './PlanetsHome.css';

export const PlanetsHome: React.FC = () => {
  return (
    <div className="frame">
      <div className="header">
        <h1 className="main-title">Space & Astrophysics</h1>
        <p className="subtitle">Исследуйте космос с нами</p>

        <div className="header-buttons">
          <Link to="/login" className="header-button">Вход</Link>
          <Link to="/register" className="header-button">Регистрация</Link>
        </div>
      </div>

      <div className="home-content">
        <div className="home-card">
          <h2 className="home-title">Добро пожаловать в мир астрофизики!</h2>
          <p className="home-description">
            Наш сервис позволяет рассчитывать положения планет Солнечной системы 
            и создавать заявки на исследования.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <h3 className="feature-title">Исследуйте</h3>
              <p className="feature-text">
                Изучайте планеты Солнечной системы с точными орбитальными данными
              </p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">Рассчитывайте</h3>
              <p className="feature-text">
                Получайте точные расчеты положений планет в реальном времени
              </p>
            </div>
          </div>

          {/* <Link to="/planets" className="select-button">
            Начать исследование
          </Link> */}
        </div>
      </div>
    </div>
  );
};
