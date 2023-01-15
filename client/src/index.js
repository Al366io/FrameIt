import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Auth0Provider
    domain="dev-1qkrqe1l7lkx2qt6.us.auth0.com"
    clientId="Gse5squkieYkvFUOozcxIwnDxnPxwAAH"
    redirectUri="https://frame-it.vercel.app/dashboard/"
    // redirectUri='http://localhost:3000/dashboard'
    // domain={process.env.DOMAIN_ID}
    // clientId={process.env.CLIENT_ID}
    // redirectUri={process.env.REDIRECT_URI}
  >
    <App />
  </Auth0Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
