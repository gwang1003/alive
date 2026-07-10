import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

// Swiper 스타일 임포트
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface ProductProps {
    product: {
        productId: number;
        name: string;
        price: number;
        discountRate: number;
        images: string[]; // 사진이 여러 장이라고 가정
        tag?: string[];
    };
}

// 백엔드가 내려주는 이미지는 "/products/..." 형태의 상대 경로라 "/api"를 붙여야 하지만,
// 목업 데이터의 로컬 import 이미지는 이미 완성된 URL이라 그대로 써야 함
const resolveImageSrc = (img: string) => (img.startsWith('/products/') ? `/api${img}` : img);

const ProductCard: React.FC<ProductProps> = ({ product }) => {
    const navigate = useNavigate();
    const productDetail = () => {
        navigate(`/product/detail/${product.productId}`);
    }
    return (
        <div className="group flex flex-col gap-4" onClick={productDetail}>
            {/* 이미지 슬라이드 영역 */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm">
                <Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{ clickable: true }}
                    navigation={true} // 좌우 화살표
                    className="w-full h-full mySwiper"
                >
                    {product.images.map((img, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={resolveImageSrc(img)}
                                alt={`${product.name}-${index}`}
                                className="w-full h-full object-cover"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="absolute top-4 left-4 z-10 grid gap-1 grid-cols-4">
                {product.tag && (
                    product.tag.map((tags) => (
                        <span key={tags} className="bg-white px-2 py-1 text-[10px] font-bold tracking-widest shadow-sm group block float-left">
                            {tags}
                        </span>
                    ))
                )}
                </div>
            </div>

            {/* 텍스트 영역 */}
            <Link to={`/product/detail/${product.productId}`} className="flex flex-col gap-1">
                <h3 className="text-[14px] font-bold text-gray-800 tracking-tight">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
          <span className="text-[15px] font-black text-gray-900">
            {Math.floor(product.price * (1 - product.discountRate / 100)).toLocaleString()} KRW
          </span>
                    {product.discountRate > 0 && (
                        <span className="text-[13px] text-red-500 font-bold">{product.discountRate}%</span>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;