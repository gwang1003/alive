import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // 이 줄이 반드시 있어야 합니다!

// 앱 진입점: React 루트를 생성하고 App을 StrictMode로 마운트
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)