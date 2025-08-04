import { useState } from 'react';
import { useGetOwnWallet } from '@/queries/wallet.query';

interface UseInsufficientBalanceParams {
  onSuccess?: () => void;
  action?: string;
}

export const useInsufficientBalance = (
  params?: UseInsufficientBalanceParams
) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState<number | undefined>();

  const { data: walletData } = useGetOwnWallet();
  const currentBalance = walletData?.result?.balance || 0;

  const checkBalance = (amount: number): boolean => {
    if (currentBalance >= amount) {
      // Đủ số dư, thực hiện action
      params?.onSuccess?.();
      return true;
    } else {
      // Không đủ số dư, hiển thị modal
      setRequiredAmount(amount);
      setIsModalVisible(true);
      return false;
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setRequiredAmount(undefined);
  };

  return {
    isModalVisible,
    hideModal,
    checkBalance,
    currentBalance,
    requiredAmount,
    action: params?.action
  };
};
