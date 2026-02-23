import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from "./pages/ProductDetail.tsx";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import axios from "./api/axios";
import useAuthStore from "./assets/authStore.tsx";
import ProductForm from "./pages/admin/ProductForm.tsx";

const App: React.FC = () => {
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // 백엔드의 재발급 엔드포인트 호출
                // 이때 브라우저가 쿠키에 담긴 RefreshToken을 알아서 실어 보냅니다.
                const response = await axios.post('/auth/refresh');
                const { accessToken, user } = response.data;

                // Zustand 스토어 업데이트
                login(accessToken, user);
            } catch (error) {
                console.log("기존 로그인 정보 없음 (비로그인 상태)");
                // 여기서 로그아웃 처리를 하거나 그대로 둡니다.
            }
        };

        initAuth();
    }, [login]);
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 text-gray-900">
                <Header />
                <Routes>
                    {/* 메인 페이지: 신상품 목록 표시 */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/product/detail/:productId" element={<ProductDetail />} />
                    <Route path="/new" element={<ProductForm />} />
                    {/* 나중에 추가할 경로들 예시 */}
                    {/* <Route path="/login" element={<Login />} /> */}
                    {/* <Route path="/products/:id" element={<ProductDetail />} /> */}
                </Routes>
                <Footer/>
            </div>
        </Router>
    );
};

export default App;