import React from 'react';
import aliveLogo from '../assets/logo.png';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#1a1a1a] text-[#888] pt-4 pb-4 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-12">
                {/* 상단: 로고 및 주요 메뉴 */}
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-6">
                        <img src={aliveLogo} alt="Alive Logo" className="h-8 brightness-0 invert opacity-80" />
                        <div className="flex gap-8 text-[13px] font-bold text-gray-300 uppercase tracking-widest">
                            <a href="#" className="hover:text-white transition-colors">About Us</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors text-white">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Guide</a>
                        </div>
                    </div>
                    <div className="text-right space-y-2">
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Customer Center</p>
                        <p className="text-2xl font-black text-white">1588-0000</p>
                        <p className="text-[12px] font-medium">Mon - Fri 10:00 - 17:00 (Lunch 12:00 - 13:00)</p>
                    </div>
                </div>

                {/* 중단: 기업 정보 (자바 엔티티처럼 정형화된 데이터 영역) */}
                <div className="grid grid-cols-2 gap-20 py-4 border-y border-gray-800/50 text-[12px] leading-relaxed">
                    <div className="space-y-1">
                        <p><b className="text-gray-400 mr-2 font-bold">상호명</b> (주)얼라이브 키즈 (Alive Kids)</p>
                        <p><b className="text-gray-400 mr-2 font-bold">대표이사</b> 김개발</p>
                        <p><b className="text-gray-400 mr-2 font-bold">사업자등록번호</b> 123-45-67890 <span className="ml-2 text-gray-600 underline cursor-pointer">[사업자정보확인]</span></p>
                        <p><b className="text-gray-400 mr-2 font-bold">통신판매업신고</b> 제 2024-서울강남-0000호</p>
                    </div>
                    <div className="space-y-1">
                        <p><b className="text-gray-400 mr-2 font-bold">주소</b> 서울특별시 강남구 테헤란로 123 얼라이브 타워 10층</p>
                        <p><b className="text-gray-400 mr-2 font-bold">개인정보보호책임자</b> 김얼라이브 (help@alivekids.com)</p>
                        <p><b className="text-gray-400 mr-2 font-bold">호스팅서비스</b> (주)얼라이브컴퍼니</p>
                    </div>
                </div>

                {/* 하단: 하단 문구 및 소셜 */}
                <div className="mt-4 flex justify-between items-center">
                    <div className="text-[11px] font-medium tracking-tight">
                        <p>© 2026 ALIVE KIDS. ALL RIGHTS RESERVED. DESIGNED BY ALIVE.</p>
                    </div>
                    <div className="flex gap-6">
                        {['INSTAGRAM', 'YOUTUBE', 'FACEBOOK'].map(sns => (
                            <a key={sns} href="#" className="text-[10px] font-black hover:text-white transition-colors tracking-[0.2em]">{sns}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;