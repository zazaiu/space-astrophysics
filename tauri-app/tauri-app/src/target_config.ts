// target_config.ts
export const target_tauri = true; // true → Tauri, false → dev сервер

export const LOCAL_IP_API_ADDR = "http://192.168.1.69:8080"; // Ваш IP: 192.168.1.69
export const DEV_API_ADDR = "http://localhost:8080"; // dev сервер

export const API_BASE = target_tauri ? LOCAL_IP_API_ADDR : DEV_API_ADDR;

// Для изображений
export const IMG_BASE = target_tauri
  ? "http://192.168.1.69:9000/planets"  // Ваш MinIO bucket
  : "http://localhost:9000/planets";

// Логирование для отладки
console.log('🎯 Config loaded:');
console.log('Mode:', target_tauri ? 'Tauri Desktop' : 'Dev Server');
console.log('API Base:', API_BASE);
console.log('Image Base:', IMG_BASE);