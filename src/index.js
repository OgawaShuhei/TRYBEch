import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

// App コンポーネントを遅延読み込み
const App = lazy(() => import('./App'));

// ローディング表示用コンポーネント
const Loading = () => (
  <div className="loading-container">
    <div className="loading-logo">TRYBE</div>
    <div className="loading-spinner"></div>
    <p>読み込み中...</p>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </React.StrictMode>
);

// Web Vitalsの測定
reportWebVitals(process.env.NODE_ENV === 'production' ? sendToAnalytics : console.log);

// 本番環境でのみアナリティクスに送信
function sendToAnalytics(metric) {
  // 実際のアナリティクスサービスに送信するコードをここに追加
  // metricDataを使用するコードをコメントアウトしているため、変数宣言も省略
  
  // 実際の送信処理の例（現在はコメントアウト）
  // const metricData = JSON.stringify(metric);
  // fetch('/analytics', { method: 'POST', body: metricData });
  
  // コンソールにも出力
  if (metric.name === 'LCP') {
    console.log('LCP:', metric.value);
  } else if (metric.name === 'FID') {
    console.log('FID:', metric.value);
  } else if (metric.name === 'CLS') {
    console.log('CLS:', metric.value);
  }
} 