import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import './config/i18n' // Khởi tạo i18n
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <App />
)
