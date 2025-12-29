// Конфигурация для разных окружений
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// GitHub Pages URL
const GITHUB_PAGES_URL = 'https://zazaiu.github.io/space-astrophysics';

// Базовый URL для API
export const API_BASE = isDevelopment
  ? 'http://localhost:8080'  // В разработке через Vite прокси
  : 'http://localhost:8080'; // В продакшене - укажите ваш Go бэкенд домен

// Базовый URL для изображений
export const IMG_BASE = isDevelopment
  ? '/images'  // Через Vite прокси в разработке
  : 'http://localhost:9000/planets'; // В продакшене - укажите ваш MinIO домен

// Базовый URL приложения
export const APP_BASE = isDevelopment
  ? 'http://localhost:5173'
  : GITHUB_PAGES_URL;

// Проксируемые пути (для Vite прокси)
export const API_PROXY = '/api';
export const IMG_PROXY = '/images';

console.log('PWA Config:', {
  isDevelopment,
  isProduction,
  API_BASE,
  IMG_BASE,
  APP_BASE
});