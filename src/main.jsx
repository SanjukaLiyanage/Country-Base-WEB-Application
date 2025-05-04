import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Force logout on server disconnect - import before App
import './utils/forceLogoutOnServerDisconnect'
import App from './App.jsx'

// Check if the user was logged out due to server disconnection
if (localStorage.getItem('server_disconnected')) {
  console.log('User was logged out due to server disconnection');
  // Clear the flag
  localStorage.removeItem('server_disconnected');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
