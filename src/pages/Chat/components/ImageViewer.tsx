import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ImageViewerProps {
  isOpen: boolean;
  imageUrl: string;
  imageAlt?: string;
  timestamp?: string | Date;
  onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  isOpen,
  imageUrl,
  imageAlt = 'Image',
  timestamp,
  onClose
}) => {
  const formatTime = (timestamp: string | Date) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return '--:--';
      }
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.warn(
        'Invalid timestamp in ImageViewer formatTime:',
        timestamp,
        error
      );
      return '--:--';
    }
  };

  const formatDate = (timestamp: string | Date) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Ngày không xác định';
      }

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Hôm nay';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Hôm qua';
      } else {
        return date.toLocaleDateString('vi-VN');
      }
    } catch (error) {
      console.warn(
        'Invalid timestamp in ImageViewer formatDate:',
        timestamp,
        error
      );
      return 'Ngày không xác định';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative max-h-[90vh] max-w-[90vw] p-4">
        {/* Close button */}
        <Button
          size="sm"
          variant="ghost"
          className="absolute -right-2 -top-2 z-10 h-8 w-8 rounded-full bg-white/90 p-0 shadow-lg hover:bg-white"
          onClick={onClose}
        >
          <X size={16} className="text-gray-700" />
        </Button>

        {/* Large image */}
        <img
          src={imageUrl}
          alt={imageAlt}
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Image info */}
        {timestamp && (
          <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-sm text-white opacity-80">
              Gửi lúc {formatTime(timestamp)} - {formatDate(timestamp)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
