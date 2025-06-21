import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Check } from 'lucide-react';
import { useCreateTransaction } from '@/queries/transaction.query';
import { TransactionType } from '@/types';
import ToastNotification from '@/components/shared/toast-notification';
import { toast } from 'react-toastify';

const Recharge = ({ isOpen, onClose, onSuccess }) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutateAsync: createTracsaction } = useCreateTransaction();

  // Predefined deposit amounts (VND)
  const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  // Handle deposit submission
  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount.replace(/[^\d]/g, ''));

    // if (!amount || amount <= 0) {
    //   alert('Vui lòng nhập số tiền hợp lệ');
    //   return;
    // }

    // if (amount < 10000) {
    //   alert('Số tiền nạp tối thiểu là 10,000 VND');
    //   return;
    // }

    // if (amount > 50000000) {
    //   alert('Số tiền nạp tối đa là 50,000,000 VND');
    //   return;
    // }

    setIsProcessing(true);

    try {
      const depositData = {
        amount: amount,
        transactionType: TransactionType.Deposit
      };

      const response = await createTracsaction(depositData);
      window.location.replace(response.result || '');
      // Reset form and close dialog
      setDepositAmount('');
      onClose();

      // Trigger success callback to refresh data
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error(`Nạp tiền thất bại: ${error || 'Vui lòng thử lại sau'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Format currency input
  const formatCurrencyInput = (value) => {
    const number = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  // Handle currency input change
  const handleAmountChange = (value) => {
    const formatted = formatCurrencyInput(value);
    setDepositAmount(formatted);
  };

  // Set quick amount
  const setQuickAmount = (amount) => {
    setDepositAmount(formatCurrencyInput(amount.toString()));
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Handle modal close
  const handleClose = () => {
    if (!isProcessing) {
      setDepositAmount('');
      onClose();
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="bg-gradient-to-br from-blue to-purple-600 p-6 text-white">
            <h2 className="text-xl font-bold">Nạp tiền vào ví</h2>
            <p className="text-sm text-black">Nhập số tiền bạn muốn nạp</p>
          </div>

          <div className="space-y-6 p-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Số tiền (VND)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="0"
                  value={depositAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="h-16 w-full rounded-2xl border-2 pr-12 text-center text-2xl font-bold focus:border-blue focus:outline-none"
                  disabled={isProcessing}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-slate-400">
                  VND
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Tối thiểu: 10,000 VND</span>
                <span>Tối đa: 50,000,000 VND</span>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Chọn nhanh
              </label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickAmount(amount)}
                    disabled={isProcessing}
                    className="rounded-xl p-2 text-xs font-medium hover:border-blue hover:bg-blue"
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {depositAmount && (
              <div className="space-y-2 rounded-2xl bg-slate-50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Số tiền nạp:</span>
                  <span className="font-semibold">
                    {formatCurrency(
                      parseFloat(depositAmount.replace(/[^\d]/g, '')) || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Phí giao dịch:</span>
                  <span className="font-semibold text-emerald-600">
                    Miễn phí
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold">Tổng cộng:</span>
                  <span className="font-bold text-blue">
                    {formatCurrency(
                      parseFloat(depositAmount.replace(/[^\d]/g, '')) || 0
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing}
                className="h-12 flex-1 rounded-2xl bg-red text-white"
              >
                Hủy
              </Button>
              <Button
                onClick={handleDeposit}
                disabled={!depositAmount || isProcessing}
                className="h-12 flex-1 rounded-2xl bg-gradient-to-r from-blue to-purple-600 text-white hover:from-blue hover:to-purple-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Xác nhận nạp tiền
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ToastNotification />
    </>
  );
};

export default Recharge;
