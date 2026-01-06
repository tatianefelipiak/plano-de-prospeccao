import React from 'react';

interface CanvasBlockProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const CanvasBlock: React.FC<CanvasBlockProps> = ({ 
  title, 
  subtitle, 
  icon, 
  children, 
  className = "" 
}) => {
  return (
    <div className={`relative flex flex-col p-10 bg-white ${className}`}>
      {icon && (
        <div className="absolute top-10 right-10 text-gray-200">
          {icon}
        </div>
      )}
      <div className="mb-6 pr-12">
        <h3 className="font-bold text-[15px] text-black uppercase tracking-tight leading-tight">{title}</h3>
        {subtitle && <p className="text-[13px] text-[#757575] mt-1.5 leading-tight font-normal">{subtitle}</p>}
      </div>
      <div className="flex-1 flex flex-col items-start justify-start">
        {children}
      </div>
    </div>
  );
};