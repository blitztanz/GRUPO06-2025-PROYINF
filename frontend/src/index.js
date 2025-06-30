import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import { UserProvider } from './context/UserContext';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>        {/* ENVUELVE la app con el contexto */}
      <App />
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();
