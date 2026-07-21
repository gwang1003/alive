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
import MyPage from "./pages/MyPage";
import ProductList from "./pages/ProductList";
import { refreshAuth } from "./api/axios";
import useAuthStore from "./assets/authStore.tsx";
import useCartStore from "./store/cartStore";
import ProductForm from "./pages/admin/ProductForm.tsx";
import AdminRoute from "./components/AdminRoute";
import AdminProductList from "./pages/admin/AdminProductList";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import AdminOrderList from "./pages/admin/AdminOrderList";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminBannerList from "./pages/admin/AdminBannerList";
import AdminInquiryList from "./pages/admin/AdminInquiryList";
import Inquiry from "./pages/Inquiry";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import FindEmail from "./pages/FindEmail";
import ResetPassword from "./pages/ResetPassword";
import OAuthCallback from "./pages/OAuthCallback";
import Notifications from "./pages/Notifications";
import VerifyEmail from "./pages/VerifyEmail";

// 라우터 루트. 마운트 시 /auth/refresh를 호출해 로그인 상태를 복원하고(authChecked 플래그로 완료 시점 표시),
// 성공하면 장바구니도 함께 불러온다.
const App: React.FC = () => {
    const login = useAuthStore((state) => state.login);
    const setAuthChecked = useAuthStore((state) => state.setAuthChecked);
    const fetchCart = useCartStore((state) => state.fetchCart);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // 백엔드의 재발급 엔드포인트 호출 (다른 곳에서 이미 진행 중이면 그 결과를 같이 사용)
                // 이때 브라우저가 쿠키에 담긴 RefreshToken을 알아서 실어 보냅니다.
                const { accessToken, user } = await refreshAuth();

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
            <div className="min-h-screen bg-canvas text-ink">
                <Header />
                <Routes>
                    {/* 메인 페이지: 신상품 목록 표시 */}
                    <Route path="/" element={<Home />} />
                    {/* 인증/계정 관련 페이지 */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/find-email" element={<FindEmail />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/oauth/callback" element={<OAuthCallback />} />
                    <Route path="/notifications" element={<Notifications />} />
                    {/* 장바구니/결제 플로우 */}
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/fail" element={<PaymentFail />} />
                    {/* 마이페이지 관련 (주문/찜/배송지/문의) */}
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/addresses" element={<AddressBook />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/inquiries" element={<Inquiry />} />
                    <Route path="/orders/:orderId" element={<OrderDetail />} />
                    {/* 상품 상세 및 카테고리/조건별 목록 페이지 */}
                    <Route path="/product/detail/:productId" element={<ProductDetail />} />
                    <Route path="/new" element={<ProductList title="신상품" defaultSort="createdAt,desc" />} />
                    <Route path="/best" element={<ProductList title="베스트" defaultSort="viewCount,desc" />} />
                    <Route path="/tops" element={<ProductList title="상의" categoryId={1} />} />
                    <Route path="/bottoms" element={<ProductList title="하의" categoryId={2} />} />
                    <Route path="/outer" element={<ProductList title="아우터" categoryId={3} />} />
                    <Route path="/sets" element={<ProductList title="세트" categoryId={5} />} />
                    <Route path="/sale" element={<ProductList title="세일" discountedOnly />} />
                    <Route path="/search" element={<ProductList title="검색결과" />} />
                    {/* 관리자 전용 페이지: AdminRoute로 감싸 ADMIN 권한을 체크 */}
                    <Route path="/admin/products" element={<AdminRoute><AdminProductList /></AdminRoute>} />
                    <Route path="/admin/products/new" element={<AdminRoute><ProductForm /></AdminRoute>} />
                    <Route path="/admin/products/:productId/edit" element={<AdminRoute><AdminProductEdit /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><AdminOrderList /></AdminRoute>} />
                    <Route path="/admin/orders/:orderId" element={<AdminRoute><AdminOrderDetail /></AdminRoute>} />
                    <Route path="/admin/banners" element={<AdminRoute><AdminBannerList /></AdminRoute>} />
                    <Route path="/admin/inquiries" element={<AdminRoute><AdminInquiryList /></AdminRoute>} />
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