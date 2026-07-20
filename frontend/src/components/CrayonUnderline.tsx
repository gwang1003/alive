import React from 'react';

interface CrayonUnderlineProps {
    className?: string;
}

// 크레용으로 그은 듯한 손그림 밑줄 SVG 장식 요소
const CrayonUnderline: React.FC<CrayonUnderlineProps> = ({ className = '' }) => (
    <svg
        viewBox="0 0 220 20"
        preserveAspectRatio="none"
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-1 left-0 w-full h-[0.3em] ${className}`}
    >
        <path
            d="M4 14 Q 28 3, 54 11 T 108 9 T 164 13 T 216 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.85"
        />
    </svg>
);

export default CrayonUnderline;
