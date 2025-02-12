import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

type TAlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
};

/**
 * Hiển thị một modal cảnh báo với các nút xác nhận và hủy bỏ.
 *
 * @param isOpen - Trạng thái mở của modal.
 * @param onClose - Hàm được gọi khi người dùng đóng modal.
 * @param onConfirm - Hàm được gọi khi người dùng xác nhận hành động.
 * @param loading - Trạng thái tải, nếu true thì các nút sẽ bị vô hiệu hóa.
 * @param title - Tiêu đề của modal. Mặc định là 'Xác nhận'.
 * @param description - Thông điệp mô tả hiển thị trong modal. Mặc định là 'Bạn có chắc muốn tiếp tục chứ?'.
 * @returns Phần tử JSX đại diện cho modal cảnh báo với các nút xác nhận và hủy bỏ.
 */
export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = 'Xác nhận',
  description = 'Bạn có chắc muốn tiếp tục chứ?'
}: TAlertModalProps) => {
  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Quay lại
        </Button>
        <Button
          disabled={loading}
          variant="destructive"
          className=""
          onClick={onConfirm}
        >
          Tiếp tục
        </Button>
      </div>
    </Modal>
  );
};
