/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly VITE_API_URL?: string; // если есть свои env переменные
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
