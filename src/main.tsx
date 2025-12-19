import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

// 确保在 React 加载前就设置默认主题为夜晚
if (typeof window !== 'undefined') {
  const html = document.documentElement;
  if (!html.getAttribute('data-theme')) {
    html.setAttribute('data-theme', 'dark');
    html.classList.add('dark');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
