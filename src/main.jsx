import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/styles/custom.scss';      
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './chartjs-setup.js';  

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
