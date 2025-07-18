import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@fontsource/mona-sans'                    // Default weight 400
import '@fontsource/mona-sans/500.css'           // Weight 500
import '@fontsource/mona-sans/600.css'           // Weight 600
import '@fontsource/mona-sans/700.css'           // Weight 700
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
