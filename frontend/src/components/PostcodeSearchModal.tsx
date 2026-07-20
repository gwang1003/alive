import React, { useEffect, useRef, useState } from 'react';
import { loadDaumPostcodeScript, embedDaumPostcode } from '../utils/daumPostcode';

interface PostcodeSearchModalProps {
    onComplete: (result: { zonecode: string; address: string }) => void;
    onClose: () => void;
}

// 다음 우편번호 검색 위젯을 모달로 띄워 주소 선택 결과를 상위로 전달
const PostcodeSearchModal: React.FC<PostcodeSearchModalProps> = ({ onComplete, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        loadDaumPostcodeScript()
            .then(() => {
                if (cancelled || !containerRef.current) return;
                embedDaumPostcode(containerRef.current, onComplete);
            })
            .catch((err: Error) => setError(err.message));
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl overflow-hidden w-full max-w-[480px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                    <span className="text-xs font-black text-gray-500 tracking-widest uppercase">주소 검색</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs font-bold text-gray-400 hover:text-gray-900"
                    >
                        닫기
                    </button>
                </div>
                {error ? (
                    <p className="p-8 text-sm text-red-500">{error}</p>
                ) : (
                    <div ref={containerRef} className="w-full h-[480px]" />
                )}
            </div>
        </div>
    );
};

export default PostcodeSearchModal;
