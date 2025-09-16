import React from 'react';

interface GovEmblemProps {
  size?: number;
  className?: string;
}

const GovEmblem: React.FC<GovEmblemProps> = ({ size = 40, className = "" }) => {
  return (
    <div className={`gov-emblem flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="url(#tricolorGradient)" stroke="#000080" strokeWidth="2"/>
        
        {/* Ashoka Chakra inspired design */}
        <circle cx="50" cy="50" r="35" fill="none" stroke="#000080" strokeWidth="2"/>
        <circle cx="50" cy="50" r="25" fill="none" stroke="#000080" strokeWidth="1"/>
        <circle cx="50" cy="50" r="15" fill="none" stroke="#000080" strokeWidth="1"/>
        
        {/* 24 spokes of Ashoka Chakra */}
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i * 15) * (Math.PI / 180);
          const x1 = 50 + 15 * Math.cos(angle);
          const y1 = 50 + 15 * Math.sin(angle);
          const x2 = 50 + 35 * Math.cos(angle);
          const y2 = 50 + 35 * Math.sin(angle);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#000080"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Center circle */}
        <circle cx="50" cy="50" r="8" fill="#000080"/>
        <circle cx="50" cy="50" r="4" fill="#FFFFFF"/>
        
        <defs>
          <linearGradient id="tricolorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#138808" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default GovEmblem;