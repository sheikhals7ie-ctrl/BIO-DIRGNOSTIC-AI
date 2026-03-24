import React from 'react';

export const RoboticHeadAnimation: React.FC = () => (
    <div className="w-48 h-48">
        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <g className="head-glow-animate" stroke="#00f0ff">
                {/* <!-- Base Circles --> */}
                <circle cx="100" cy="180" r="40" strokeWidth="1" strokeOpacity="0.5" />
                <circle cx="100" cy="180" r="50" strokeWidth="1" strokeOpacity="0.3" />
                <circle cx="100" cy="180" r="60" strokeWidth="0.5" strokeOpacity="0.2" />

                {/* <!-- Neck --> */}
                <path d="M100 135 C 110 145, 110 160, 100 170" strokeWidth="1.5" />
                <path d="M100 135 C 90 145, 90 160, 100 170" strokeWidth="1.5" />
                <line x1="100" y1="135" x2="100" y2="170" strokeWidth="1" />

                {/* <!-- Head Outline --> */}
                <path d="M100,20 C135,20 160,50 160,85 C160,120 140,135 100,135 C60,135 40,120 40,85 C40,50 65,20 100,20 Z" strokeWidth="2" />
                
                {/* <!-- Face Features --> */}
                <path d="M70 80 C 75 75, 85 75, 90 80" strokeWidth="1" />
                <path d="M110 80 C 115 75, 125 75, 130 80" strokeWidth="1" />
                <line x1="100" y1="90" x2="100" y2="105" strokeWidth="1" />
                <path d="M85 115 C 95 120, 105 120, 115 115" strokeWidth="1" />

                {/* <!-- Wireframe Grid --> */}
                <g strokeWidth="0.5" strokeOpacity="0.7">
                    {/* <!-- Vertical Lines --> */}
                    <path d="M100,20 V135" />
                    <path d="M80,25 C80,50 75,120 80,134" />
                    <path d="M120,25 C120,50 125,120 120,134" />
                    <path d="M60,45 C55,60 55,110 60,128" />
                    <path d="M140,45 C145,60 145,110 140,128" />
                    {/* <!-- Horizontal Lines --> */}
                    <path d="M42 60 H 158" />
                    <path d="M40 85 H 160" />
                    <path d="M45 110 H 155" />
                    <path d="M65 130 H 135" />
                </g>
            </g>
        </svg>
    </div>
);