import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@fontsource/mona-sans'                   
import '@fontsource/mona-sans/500.css'          
import '@fontsource/mona-sans/600.css'          
import '@fontsource/mona-sans/700.css'   
import "@fontsource/noto-sans-georgian";
import "@fontsource/noto-sans-georgian/400.css"; 



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
