
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as firebaseServices from './lib/firebaseService';

// Expose services to window for console testing
(window as any).db_debug = firebaseServices;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
