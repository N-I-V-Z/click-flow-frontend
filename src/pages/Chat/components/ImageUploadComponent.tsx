import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Image,
  X,
  Upload,
  Send,
  FileImage,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface ImageUploadProps {
  onSendFile: (file: File) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onSendFile,
  disabled = false
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Các định dạng hình ảnh được hỗ trợ
  const supportedFormats = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // Validate file
  const validateFile = (file: File): string | null => {
    if (!supportedFormats.includes(file.type)) {
      return 'Định dạng file không được hỗ trợ. Vui lòng chọn JPG, PNG, GIF hoặc WebP.';
    }

    if (file.size > maxFileSize) {
      return 'File quá lớn. Kích thước tối đa là 10MB.';
    }

    return null;
  };

  // Xử lý chọn file
  const handleFileSelect = (file: File) => {
    setUploadError('');

    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setSelectedImage(file);

    // Tạo preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setShowImageModal(true);
    };
    reader.readAsDataURL(file);
  };

  // Xử lý khi chọn file từ input
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Clear input để có thể chọn lại cùng một file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Xử lý drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith('image/'));

    if (imageFile) {
      handleFileSelect(imageFile);
    }
  };

  // Gửi hình ảnh
  const handleSendImage = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    setUploadError('');

    try {
      await onSendFile(selectedImage);
      handleCloseModal();
    } catch (error) {
      setUploadError('Không thể gửi hình ảnh. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
    setImagePreview('');
    setUploadError('');
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Modal Component
  const Modal = () => (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <Card className="max-h-[90vh] w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <FileImage size={20} className="text-blue" />
            Gửi hình ảnh
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseModal}
            className="h-8 w-8"
          >
            <X size={16} />
          </Button>
        </div>

        <CardContent className="space-y-4 p-4">
          {/* Image Preview */}
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-48 w-full rounded-lg border object-cover"
            />
            <div className="absolute right-2 top-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
              {selectedImage && formatFileSize(selectedImage.size)}
            </div>
          </div>

          {/* File Info */}
          {selectedImage && (
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Tên file:</span>
                <span
                  className="max-w-32 truncate font-medium"
                  title={selectedImage.name}
                >
                  {selectedImage.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Định dạng:</span>
                <span className="font-medium uppercase">
                  {selectedImage.type.split('/')[1]}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="border-red text-red flex items-center gap-2 rounded-lg border bg-red-50 p-3 text-sm">
              <AlertCircle size={16} />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleCloseModal}
              disabled={isUploading}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSendImage}
              disabled={isUploading || !selectedImage}
              className="from-blue to-blue hover:from-blue hover:to-blue flex-1 bg-gradient-to-r"
            >
              {isUploading ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <Send size={16} className="mr-2" />
              )}
              {isUploading ? 'Đang gửi...' : 'Gửi'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Drag Overlay Component
  const DragOverlay = () => (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-blue-500/20"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="border-blue rounded-lg border-2 border-dashed bg-white p-8 shadow-lg">
        <div className="text-center">
          <Upload size={48} className="text-blue mx-auto mb-4" />
          <p className="text-gray text-lg font-semibold">
            Thả hình ảnh vào đây
          </p>
          <p className="text-sm text-gray-600">để gửi ngay</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Image Upload Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative flex-shrink-0 text-gray-600 hover:bg-gray-100"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isUploading}
        title="Gửi hình ảnh"
      >
        {isUploading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Image size={18} />
        )}
      </Button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInputChange}
        className="hidden"
        accept={supportedFormats.join(',')}
        multiple={false}
      />

      {/* Portal-based Modal */}
      {showImageModal &&
        typeof document !== 'undefined' &&
        createPortal(<Modal />, document.body)}

      {/* Portal-based Drag Overlay */}
      {dragOver &&
        typeof document !== 'undefined' &&
        createPortal(<DragOverlay />, document.body)}
    </>
  );
};

export default ImageUpload;
