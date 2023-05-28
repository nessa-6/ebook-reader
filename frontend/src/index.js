import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> {/* StrictMode renders components twice (on dev but not production) in order to detect any problems with your code and warn you about them (which can be quite useful).*/}
    <App />
  </React.StrictMode>
);