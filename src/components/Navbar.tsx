import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <nav style={{
      backgroundColor: '#000',
      borderBottom: '2px solid #311b77',
      padding: '15px 59px',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link 
          to="/" 
          style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '24px',
            fontWeight: '700'
          }}
        >
          Space & Astrophysics.
          Расчет положения планет
        </Link>
      </div>
    </nav>
  );
};