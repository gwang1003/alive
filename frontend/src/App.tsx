import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from "./pages/ProductDetail.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 text-gray-900">
                <Header />
                <Routes>
                    {/* 메인 페이지: 신상품 목록 표시 */}
                    <Route path="/" element={<Home />} />
                    <Route path="/product/detail" element={<ProductDetail />} />
                    {/* 나중에 추가할 경로들 예시 */}
                    {/* <Route path="/login" element={<Login />} /> */}
                    {/* <Route path="/products/:id" element={<ProductDetail />} /> */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;