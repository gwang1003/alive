import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from "./pages/ProductDetail.tsx";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";
import OrderHistory from "./pages/OrderHistory";
import Wishlist from "./pages/Wishlist";
import AddressBook from "./pages/AddressBook";
import ProductList from "./pages/ProductList";
import axios from "./api/axios";
import useAuthStore from "./assets/authStore.tsx";
import useCartStore from "./store/cartStore";
import ProductForm from "./pages/admin/ProductForm.tsx";
import AdminRoute from "./components/AdminRoute";
import AdminProductList from "./pages/admin/AdminProductList";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import AdminOrderList from "./pages/admin/AdminOrderList";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";

const App: React.FC = () => {
    const login = useAuthStore((state) => state.login);
    const setAuthChecked = useAuthStore((state) => state.setAuthChecked);
    const fetchCart = useCartStore((state) => state.fetchCart);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // 백엔드의 재발급 엔드포인트 호출
                // 이때 브라우저가 쿠키에 담긴 RefreshToken을 알아서 실어 보냅니다.
                const response = await axios.post('/auth/refresh');
                const { accessToken, user } = response.data;

                // Zustand 스토어 업데이트
                login(accessToken, user);
                fetchCart();
            } catch (error) {
                console.log("기존 로그인 정보 없음 (비로그인 상태)");
                // 여기서 로그아웃 처리를 하거나 그대로 둡니다.
            } finally {
                setAuthChecked();
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
                    <Route path="/signup" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/addresses" element={<AddressBook />} />
                    <Route path="/orders/:orderId" element={<OrderDetail />} />
                    <Route path="/product/detail/:productId" element={<ProductDetail />} />
                    <Route path="/new" element={<ProductList title="신상품" defaultSort="createdAt,desc" />} />
                    <Route path="/best" element={<ProductList title="베스트" defaultSort="viewCount,desc" />} />
                    <Route path="/tops" element={<ProductList title="상의" categoryId={1} />} />
                    <Route path="/bottoms" element={<ProductList title="하의" categoryId={2} />} />
                    <Route path="/outer" element={<ProductList title="아우터" categoryId={3} />} />
                    <Route path="/sets" element={<ProductList title="세트" categoryId={5} />} />
                    <Route path="/sale" element={<ProductList title="세일" discountedOnly />} />
                    <Route path="/admin/products" element={<AdminRoute><AdminProductList /></AdminRoute>} />
                    <Route path="/admin/products/new" element={<AdminRoute><ProductForm /></AdminRoute>} />
                    <Route path="/admin/products/:productId/edit" element={<AdminRoute><AdminProductEdit /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><AdminOrderList /></AdminRoute>} />
                    <Route path="/admin/orders/:orderId" element={<AdminRoute><AdminOrderDetail /></AdminRoute>} />
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