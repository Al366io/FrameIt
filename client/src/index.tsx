import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_DOMAIN_ID!}
    clientId={process.env.REACT_APP_CLIENT_ID!}
    redirectUri={process.env.REACT_APP_REDIRECT_URI!}
  >
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </Auth0Provider>
);
