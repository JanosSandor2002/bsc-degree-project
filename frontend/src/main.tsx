import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { GlobalProvider } from './Context/GlobalContext.tsx';
import { ViewProvider } from './Context/ViewContext.tsx';

createRoot(document.getElementById('root')!).render(
  <GlobalProvider>
    <ViewProvider>
      <App />
    </ViewProvider>
  </GlobalProvider>,
);
