import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';

type TPopupModalProps = {
  onConfirm?: () => void;
  loading?: boolean;
  renderModal: (onClose: () => void) => React.ReactNode;
};

/**
 * Thành phần PopupModal hiển thị một nút bấm để mở modal.
 * Khi nút được nhấn, modal sẽ hiển thị nội dung được cung cấp bởi hàm `renderModal`.
 * Modal có thể được đóng lại bằng cách gọi hàm `onClose`.
 *
 * @param renderModal - Hàm để render nội dung của modal, nhận vào một hàm `onClose` để đóng modal.
 *
 * @deprecated
 * Phải được bọc trong DayPickerProvider
 */
export default function PopupModal({ renderModal }: TPopupModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  return (
    <>
      <Button className="text-xs md:text-sm" onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Thêm mới
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className={'!bg-background !px-1'}
      >
        <ScrollArea className="h-[80dvh] px-6  ">
          {renderModal(onClose)}
        </ScrollArea>
      </Modal>
    </>
  );
}
