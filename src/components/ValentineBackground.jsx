import React from 'react';

const ValentineBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Rose pattern - scattered throughout */}
        <defs>
          <g id="rose">
            {/* Rose petals */}
            <ellipse cx="20" cy="20" rx="8" ry="12" fill="#be123c" transform="rotate(-30 20 20)"/>
            <ellipse cx="20" cy="20" rx="8" ry="12" fill="#be123c" transform="rotate(30 20 20)"/>
            <ellipse cx="20" cy="20" rx="8" ry="12" fill="#be123c" transform="rotate(90 20 20)"/>
            <ellipse cx="20" cy="20" rx="7" ry="10" fill="#e11d48" transform="rotate(150 20 20)"/>
            <ellipse cx="20" cy="20" rx="7" ry="10" fill="#e11d48" transform="rotate(210 20 20)"/>
            {/* Center */}
            <circle cx="20" cy="20" r="5" fill="#9f1239"/>
            {/* Stem */}
            <path d="M 20 28 L 20 45" stroke="#15803d" strokeWidth="2" fill="none"/>
            {/* Leaves */}
            <ellipse cx="17" cy="35" rx="4" ry="6" fill="#22c55e" transform="rotate(-45 17 35)"/>
            <ellipse cx="23" cy="38" rx="4" ry="6" fill="#22c55e" transform="rotate(45 23 38)"/>
          </g>
        </defs>
        
        {/* 20 scattered roses across the background */}
        <use href="#rose" x="5%" y="8%" opacity="0.4" transform="scale(1.2)"/>
        <use href="#rose" x="85%" y="12%" opacity="0.3" transform="scale(0.9) rotate(45)"/>
        <use href="#rose" x="15%" y="78%" opacity="0.35" transform="scale(1.1) rotate(-20)"/>
        <use href="#rose" x="75%" y="72%" opacity="0.4" transform="scale(1) rotate(30)"/>
        <use href="#rose" x="45%" y="5%" opacity="0.25" transform="scale(0.8) rotate(-45)"/>
        <use href="#rose" x="60%" y="88%" opacity="0.3" transform="scale(1.3) rotate(60)"/>
        <use href="#rose" x="30%" y="42%" opacity="0.2" transform="scale(0.7) rotate(15)"/>
        <use href="#rose" x="90%" y="52%" opacity="0.25" transform="scale(0.9) rotate(-30)"/>
        <use href="#rose" x="10%" y="90%" opacity="0.3" transform="scale(1) rotate(90)"/>
        <use href="#rose" x="50%" y="95%" opacity="0.35" transform="scale(1.1) rotate(-60)"/>
        {/* Additional 10 roses */}
        <use href="#rose" x="20%" y="25%" opacity="0.3" transform="scale(0.85) rotate(120)"/>
        <use href="#rose" x="65%" y="18%" opacity="0.35" transform="scale(1.15) rotate(-70)"/>
        <use href="#rose" x="38%" y="68%" opacity="0.25" transform="scale(0.95) rotate(25)"/>
        <use href="#rose" x="82%" y="35%" opacity="0.3" transform="scale(1.05) rotate(-15)"/>
        <use href="#rose" x="12%" y="55%" opacity="0.4" transform="scale(1.2) rotate(80)"/>
        <use href="#rose" x="55%" y="30%" opacity="0.25" transform="scale(0.75) rotate(-90)"/>
        <use href="#rose" x="72%" y="85%" opacity="0.35" transform="scale(1.1) rotate(35)"/>
        <use href="#rose" x="25%" y="15%" opacity="0.3" transform="scale(0.9) rotate(-50)"/>
        <use href="#rose" x="48%" y="60%" opacity="0.2" transform="scale(0.8) rotate(110)"/>
        <use href="#rose" x="92%" y="75%" opacity="0.35" transform="scale(1.25) rotate(-25)"/>
      </svg>
    </div>
  );
};

export default ValentineBackground;