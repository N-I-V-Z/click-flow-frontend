import React, { useState } from 'react';
import { Button, Card, Space, InputNumber } from 'antd';
import { useInsufficientBalance } from '@/hooks/use-insufficient-balance';
import InsufficientBalanceModal from '@/components/shared/insufficient-balance-modal';
import { toast } from 'react-toastify';

const InsufficientBalanceDemo: React.FC = () => {
  const [testAmount, setTestAmount] = useState<number>(1000000);

  const { isModalVisible, hideModal, checkBalance, currentBalance } =
    useInsufficientBalance({
      action: 'test tính năng',
      onSuccess: () => {
        toast.success('Số dư đủ! Tính năng sẽ được thực hiện.');
      }
    });

  const handleTest = () => {
    checkBalance(testAmount);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Demo: Kiểm tra số dư ví
        </h1>

        <Card className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Số dư hiện tại:
              </label>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(currentBalance)} đ
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Số tiền test:
              </label>
              <InputNumber
                value={testAmount}
                onChange={(value) => setTestAmount(value || 0)}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) =>
                  parseInt(value!.replace(/\$\s?|(,*)/g, ''), 10)
                }
                style={{ width: '100%' }}
                size="large"
                placeholder="Nhập số tiền để test"
              />
              <div className="mt-1 text-xs text-gray-500">
                Nhập số tiền lớn hơn số dư để test modal
              </div>
            </div>

            <div className="pt-4">
              <Space wrap>
                <Button type="primary" size="large" onClick={handleTest}>
                  Test kiểm tra số dư
                </Button>
                <Button
                  onClick={() => setTestAmount(currentBalance + 100000)}
                  type="dashed"
                >
                  Set số tiền lớn hơn số dư
                </Button>
                <Button
                  onClick={() => setTestAmount(currentBalance - 10000)}
                  type="dashed"
                >
                  Set số tiền nhỏ hơn số dư
                </Button>
              </Space>
            </div>
          </div>
        </Card>

        <Card title="Hướng dẫn sử dụng">
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              • <strong>Nếu đủ số dư:</strong> Sẽ hiển thị thông báo thành công
            </p>
            <p>
              • <strong>Nếu không đủ số dư:</strong> Sẽ hiển thị modal với hai
              tùy chọn:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>Hủy bỏ:</strong> Đóng modal và không làm gì
              </li>
              <li>
                <strong>Nạp tiền ngay:</strong> Chuyển đến trang nạp tiền
              </li>
            </ul>
            <p className="mt-4 font-medium text-blue-600">
              Tính năng này đã được tích hợp vào:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Nâng cấp gói dịch vụ (Publisher)</li>
              <li>Tạo chiến dịch mới (Advertiser)</li>
            </ul>
          </div>
        </Card>

        <InsufficientBalanceModal
          visible={isModalVisible}
          onCancel={hideModal}
          requiredAmount={testAmount}
          currentBalance={currentBalance}
          action="test tính năng"
        />
      </div>
    </div>
  );
};

export default InsufficientBalanceDemo;
