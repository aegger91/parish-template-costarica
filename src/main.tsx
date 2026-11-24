import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { site } from '@/content';
import '@/index.css';

if (site.slavonicFont) document.documentElement.dataset.slavonic = site.slavonicFont;

/** If IntersectionObserver never fires, force Reveal content visible ~1.5s after load. */
const armRevealFallback = () => {
  window.setTimeout(() => {
    document.documentElement.classList.add('reveal-fallback');
  }, 1500);
};
if (document.readyState === 'complete') armRevealFallback();
else window.addEventListener('load', armRevealFallback, { once: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
