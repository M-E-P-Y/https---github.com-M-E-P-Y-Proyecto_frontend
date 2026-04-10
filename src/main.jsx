import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Importamos los estilos de Bootstrap antes que los nuestros
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)