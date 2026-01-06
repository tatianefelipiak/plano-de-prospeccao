import React, { useEffect, useRef } from 'react';

interface AutoGrowingTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const AutoGrowingTextarea: React.FC<AutoGrowingTextareaProps> = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const textColor = value.trim() !== '' ? 'text-[#2B59FF]' : 'text-gray-300';

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || ''}
      className={`w-full resize-none bg-transparent outline-none font-normal text-[20px] placeholder:text-gray-200 min-h-[60px] leading-[1.3] transition-colors duration-200 ${textColor} text-left overflow-hidden break-words whitespace-pre-wrap`}
      rows={1}
    />
  );
};