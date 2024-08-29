import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Modal from 'react-modal'; // Import the Modal component from the appropriate library

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
Modal.setAppElement('body');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

