import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./lib/setup.css";
import "./lib/layout.css";
import "./lib/style.css";
import "/fonts/Chillax-Variable.woff";
// import "./lib/animate.css";
// import "./lib/input.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
