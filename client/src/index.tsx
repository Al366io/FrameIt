import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";
import 'font-awesome/css/font-awesome.min.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
<Auth0Provider
    domain={process.env.DOMAIN_ID || "dev-tfrj80myq4cljd41.us.auth0.com"}
    clientId={process.env.CLIENT_ID || "i5wOLko87w1qqgDZtMQfD7JVlTjOpT8E"}
    redirectUri={ process.env.REDIRECT_URI || "http://localhost:3000/dashboard"}
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
