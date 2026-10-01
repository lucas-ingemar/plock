import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./i18n";
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { ApiProvider } from './api/ApiContext.tsx';
import { ServerApi } from './api/ServerApi.ts';


const api = new ServerApi()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiProvider api={api}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApiProvider>
  </StrictMode>,
)
