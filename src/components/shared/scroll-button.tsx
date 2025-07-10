import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const ScrollButton: React.FC = () => {
  const [showButton, setShowButton] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [isNearTop, setIsNearTop] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollProgress = currentScrollY / (documentHeight - windowHeight);

      // Hiển thị button khi scroll hơn 100px
      setShowButton(currentScrollY > 100);

      // Xác định vị trí scroll
      setIsNearTop(scrollProgress < 0.2);
      setIsNearBottom(scrollProgress > 0.8);

      // Logic thông minh cho direction
      if (isNearTop) {
        setScrollDirection('down'); // Ở gần top → hiện nút scroll down
      } else if (isNearBottom) {
        setScrollDirection('up'); // Ở gần bottom → hiện nút scroll up
      } else {
        // Ở giữa → xem hướng scroll gần nhất
        setScrollDirection(scrollProgress > 0.5 ? 'up' : 'down');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Chạy ngay lần đầu
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isNearTop, isNearBottom]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  const handleClick = () => {
    if (scrollDirection === 'up') {
      scrollToTop();
    } else {
      scrollToBottom();
    }
  };

  if (!showButton) return null;

  return (
    <button
      onClick={handleClick}
      className={`
        fixed bottom-24 right-6 z-[9999]
        flex h-14 w-14
        items-center justify-center rounded-full
        border-2 border-white/20
        bg-gradient-to-r from-purple-600 to-indigo-600
        text-white shadow-lg
        backdrop-blur-sm transition-all
        duration-300
        ease-in-out hover:scale-110 hover:from-purple-700
        hover:to-indigo-700 hover:shadow-xl
        active:scale-95
        ${showButton ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}
      `}
      title={
        scrollDirection === 'up'
          ? 'Cuộn lên đầu trang'
          : 'Cuộn xuống cuối trang'
      }
    >
      <div className="relative">
        {scrollDirection === 'up' ? (
          <ChevronUp className="h-7 w-7 transition-transform duration-200" />
        ) : (
          <ChevronDown className="h-7 w-7 transition-transform duration-200" />
        )}

        {/* Hiệu ứng pulse nhẹ */}
        <div
          className={`
          absolute inset-0 animate-ping
          rounded-full bg-gradient-to-r from-purple-400/30
          to-indigo-400/30
          ${scrollDirection === 'up' ? 'animate-pulse' : 'animate-bounce'}
        `}
          style={{ animationDuration: '2s' }}
        />
      </div>
    </button>
  );
};

export default ScrollButton;
