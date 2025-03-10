import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateThread from './pages/CreateThread';
import CategoryThreads from './pages/CategoryThreads';
import Thread from './pages/Thread';
import { createGlobalStyle } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';

const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: #3498db;
    --primary-dark: #2980b9;
    --text-color: #2c3e50;
    --background-color: #f5f6fa;
    
    /* レスポンシブデザインのブレークポイント */
    --mobile: 480px;
    --tablet: 768px;
    --desktop: 1024px;
    --large-desktop: 1200px;
    
    /* コンテナの最大幅 */
    --container-width: 1200px;
    --container-padding: 1rem;
    
    /* フォントサイズ */
    --font-size-base: 16px;
    --font-size-small: 0.875rem;
    --font-size-large: 1.125rem;
    
    @media (max-width: 768px) {
      --font-size-base: 14px;
      --container-padding: 0.75rem;
    }
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: var(--font-size-base);
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background-color);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--primary-dark);
    }
  }

  button {
    font-family: inherit;
  }

  /* スクロールバーのカスタマイズ */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark);
  }

  /* タッチデバイスでのインタラクションの改善 */
  @media (hover: none) and (pointer: coarse) {
    button, a {
      min-height: 44px;
      min-width: 44px;
    }
  }
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-thread" element={<CreateThread />} />
          <Route path="/category/:categoryId" element={<CategoryThreads />} />
          <Route path="/category/:categoryId/thread/:threadId" element={<Thread />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App; 