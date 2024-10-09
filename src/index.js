import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store'; // Import your store
import App from './App'; // Your root component


const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
