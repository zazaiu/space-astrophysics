
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/authSlice';

export const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav>
      {auth.isAuthenticated ? (
        <>
          <span>Привет, {auth.user?.username}</span>
          <button onClick={handleLogout}>Выйти</button>
        </>
      ) : (
        <>
          <Link to="/login">Войти</Link>
          <Link to="/register">Регистрация</Link>
        </>
      )}
    </nav>
  );
};
