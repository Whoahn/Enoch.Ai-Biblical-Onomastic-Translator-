import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
import './index.css'; // Assuming you have a CSS file for global styles
import App from './App'; // Import your App component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
