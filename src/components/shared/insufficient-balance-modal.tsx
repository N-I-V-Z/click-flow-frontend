import React from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined, WalletOutlined } from '@ant-design/icons';
import { useRouter } from '@/routes/hooks';

interface InsufficientBalanceModalProps {
  visible: boolean;
  onCancel: () => void;
  requiredAmount?: number;
  currentBalance?: number;
  action?: string; // Ví dụ: "nâng cấp gói", "tạo chiến dịch", etc.
  onRecharge?: () => void; // Callback để đóng các modal khác trước khi chuyển trang
}

const InsufficientBalanceModal: React.FC<InsufficientBalanceModalProps> = ({
  visible,
  onCancel,
  requiredAmount,
  currentBalance,
  action = 'thực hiện hành động này',
  onRecharge
}) => {
  const router = useRouter();

  const handleRecharge = () => {
    // Gọi callback để đóng các modal khác nếu có
    if (onRecharge) {
      onRecharge();
    }

    onCancel(); // Đóng modal hiện tại

    // Delay nhỏ để đảm bảo modal đã đóng trước khi chuyển trang
    setTimeout(() => {
      // Chuyển đến trang nạp tiền tương ứng với role và auto mở popup
      const currentPath = window.location.pathname;
      if (currentPath.includes('/advertiser/')) {
        router.push('/publisher/wallet-publisher?autoRecharge=true');
      } else if (currentPath.includes('/publisher/')) {
        router.push('/publisher/wallet-publisher?autoRecharge=true');
      } else {
        router.push('/publisher/wallet-publisher?autoRecharge=true');
      }
    }, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const shortfall =
    requiredAmount && currentBalance ? requiredAmount - currentBalance : 0;

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      className="insufficient-balance-modal"
      width={480}
    >
      <div className="text-center">
        {/* Icon cảnh báo */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ExclamationCircleOutlined className="text-3xl text-red-500" />
          </div>
        </div>

        {/* Tiêu đề */}
        <h3 className="mb-3 text-xl font-semibold text-gray-800">
          Số dư ví không đủ
        </h3>

        {/* Thông tin chi tiết */}
        <div className="mb-6 space-y-2 text-gray-600">
          <p>Bạn cần thêm tiền để {action}</p>

          {currentBalance !== undefined && (
            <div className="rounded-lg bg-gray-50 p-3 text-sm">
              <div className="flex justify-between">
                <span>Số dư hiện tại:</span>
                <span className="font-medium">
                  {formatCurrency(currentBalance)} đ
                </span>
              </div>
              {requiredAmount && (
                <>
                  <div className="flex justify-between">
                    <span>Số tiền cần thiết:</span>
                    <span className="font-medium">
                      {formatCurrency(requiredAmount)} đ
                    </span>
                  </div>
                  <div className="mt-2 border-t pt-2">
                    <div className="flex justify-between text-red-600">
                      <span className="font-medium">Cần nạp thêm:</span>
                      <span className="font-semibold">
                        {formatCurrency(shortfall)} đ
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Lưu ý */}
        <div className="mb-6 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          <p>
            💡 Lưu ý: Bạn có thể hủy hoặc thay đổi gói bất kỳ lúc nào. Không có
            phí ràng buộc.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <Button size="large" onClick={onCancel} className="flex-1">
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<WalletOutlined />}
            onClick={handleRecharge}
            className="flex-1 border-none bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Nạp tiền ngay
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InsufficientBalanceModal;
