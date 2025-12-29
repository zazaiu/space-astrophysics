import { useDispatch, useSelector } from 'react-redux';
// Создаем типизированные версии хуков
export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);
