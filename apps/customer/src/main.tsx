import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../../../shared/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register PWA service worker safely in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Tronx SW registration skipped:', err);
    });
  });
}
