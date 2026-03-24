
import React from 'react';

interface PanelProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Panel: React.FC<PanelProps> = ({ title, children, className }) => {
    return (
        <div className={`bg-[#0a0f18]/80 backdrop-blur-sm border-2 border-[#214d68] p-4 h-full ${className}`}>
            <h2 className="text-lg font-bold text-[#2dffb5] text-glow uppercase mb-4">{title}</h2>
            {children}
        </div>
    );
};
