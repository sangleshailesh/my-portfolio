import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import { applyStoredPreferences } from './lib/preferences';
import App from './App.jsx';

/**
 * iOS withholds `:active` styling unless the document has a touch listener
 * attached. Since base.css clears the default tap highlight, without this
 * there would be no tap feedback at all on iPhone. Passive, so it never blocks
 * scrolling.
 */
document.addEventListener('touchstart', () => {}, { passive: true });

// Applied before React's first paint so a stored non-default theme never
// flashes the default one.
applyStoredPreferences();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
