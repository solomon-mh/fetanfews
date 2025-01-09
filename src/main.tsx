import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'leaflet/dist/leaflet.css';

import App from './App.tsx'
import { ColorContextProvider } from './contexts/ColorContext.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <ColorContextProvider>
      <App />
    </ColorContextProvider>    </AuthProvider>
    
  </StrictMode>,
)
