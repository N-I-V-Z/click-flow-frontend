// File: src/components/ui/LikeButton.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

interface LikeButtonProps {
  liked: boolean;
  likes: number;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  liked,
  likes,
  onToggle,
  size = 'md',
  showCount = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    onToggle();
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const iconSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.05 }}
      className="group relative flex items-center space-x-1"
    >
      <motion.div
        animate={
          liked
            ? {
                scale: [1, 1.4, 1.1, 1],
                rotate: [0, -10, 10, 0]
              }
            : { scale: 1, rotate: 0 }
        }
        transition={{
          duration: 0.6,
          ease: 'easeInOut'
        }}
        className="relative"
      >
        {liked ? (
          <FaHeart
            className={`${iconSizeClasses[size]} text-red drop-shadow-sm`}
          />
        ) : (
          <FaRegHeart
            className={`${iconSizeClasses[size]} group-hover:text-red-400 text-gray-500 transition-colors`}
          />
        )}

        {/* Hiệu ứng bùng nổ khi like */}
        {isAnimating && liked && (
          <>
            {/* Vòng tròn mở rộng */}
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-red-400 absolute inset-0 rounded-full"
            />

            {/* Particles bay ra */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 1
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 8) * 20,
                  y: Math.sin((i * Math.PI * 2) / 8) * 20,
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.02
                }}
                className="bg-red-400 absolute left-1/2 top-1/2 h-1 w-1 rounded-full"
                style={{
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {showCount && (
        <motion.span
          key={likes}
          initial={{ scale: 1 }}
          animate={{
            scale: isAnimating ? [1, 1.3, 1] : 1,
            color: liked ? '#ef4444' : '#6b7280'
          }}
          transition={{ duration: 0.3 }}
          className={`${textSizeClasses[size]} select-none font-medium`}
        >
          {likes}
        </motion.span>
      )}

      {/* Hiệu ứng glow khi hover */}
      <motion.div
        className="bg-red-200 absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-20"
        style={{ scale: 1.5 }}
      />
    </motion.button>
  );
};

export default LikeButton;
