// Простейший main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './target_config' // Импортируем конфиг
import App from './App'
import './index.css'

console.log('🎬 Main.tsx запускается...')

const rootElement = document.getElementById('root')
if (rootElement) {
  console.log('✅ Root element найден')
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  console.error('❌ Root element не найден!')
  document.body.innerHTML = '<h1>Error: Root element not found</h1>'
}