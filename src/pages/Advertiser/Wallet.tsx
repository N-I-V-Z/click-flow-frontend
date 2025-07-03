import BasePages from '@/components/shared/base-pages';
import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useGetOwnWallet } from '@/queries/wallet.query';
import { useGetOwnTransaction } from '@/queries/transaction.query';
import { Transaction, TransactionType } from '@/types';
import Recharge from '../Publisher/Recharge';

const Wallet: React.FC = () => {
  // State cho modal nạp tiền
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);

  // Fetch wallet data
  const {
    data: walletData,
    isLoading: walletLoading,
    error: walletError,
    refetch: refetchWallet
  } = useGetOwnWallet();

  // Fetch transaction data (increased page size to get more data for chart)
  const {
    data: transactionData,
    isLoading: transactionLoading,
    error: transactionError,
    refetch: refetchTransactions
  } = useGetOwnTransaction(1, 50);

  // Handle successful deposit
  const handleDepositSuccess = async () => {
    // Refresh wallet and transaction data
    await Promise.all([refetchWallet(), refetchTransactions()]);
  };

  // Process transaction data for chart
  const chartData = useMemo(() => {
    if (!transactionData?.result?.datas) return [];

    const monthlyData: { [key: string]: { income: number; outcome: number } } =
      {};

    transactionData.result.datas.forEach((transaction) => {
      const date = new Date(transaction.paymentDate);
      const monthKey = `Tháng ${date.getMonth() + 1}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, outcome: 0 };
      }

      // Sử dụng balance thay vì amount nếu amount = 0
      const transactionValue =
        transaction.amount !== 0 ? transaction.amount : transaction.balance;

      // Phân loại theo type
      if (
        transaction.transactionType === 'Received' ||
        transaction.transactionType === 'Deposit'
      ) {
        monthlyData[monthKey].income += transactionValue;
      } else if (
        transaction.transactionType === 'Pay' ||
        transaction.transactionType === 'Withdraw'
      ) {
        monthlyData[monthKey].outcome += transactionValue;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      income: data.income / 1000000,
      outcome: data.outcome / 1000000
    }));
  }, [transactionData]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Get transaction type display info
  const getTransactionDisplay = (transaction: Transaction) => {
    const isPositive =
      transaction.transactionType === TransactionType.Received ||
      transaction.transactionType === TransactionType.Deposit;

    return {
      color: isPositive ? 'text-green-600' : 'text-red-600',
      sign: isPositive ? '+' : '-',
      label: getTransactionLabel(transaction.transactionType)
    };
  };

  // Get Vietnamese label for transaction type
  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'Pay':
        return 'Thanh toán';
      case 'Received':
        return 'Nhận tiền';
      case 'Deposit':
        return 'Nạp tiền';
      case 'Withdraw':
        return 'Rút tiền';
      default:
        return type;
    }
  };

  // Get display amount (use balance if amount is 0)
  const getDisplayAmount = (transaction: Transaction) => {
    return transaction.amount !== 0
      ? Math.abs(transaction.amount)
      : transaction.balance;
  };

  if (walletLoading || transactionLoading) {
    return (
      <BasePages pageHead="ClickFlow - Ví">
        <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-yellow-50 p-6">
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-xl text-gray-600">Đang tải dữ liệu...</div>
          </div>
        </div>
      </BasePages>
    );
  }

  if (walletError || transactionError) {
    return (
      <BasePages pageHead="ClickFlow - Ví">
        <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-yellow-50 p-6">
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-xl text-red-600">
              Có lỗi xảy ra khi tải dữ liệu
            </div>
          </div>
        </div>
      </BasePages>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Ví">
      <div className=" min-h-screen p-6">
        <div className="mx-auto max-w-6xl">
          {/* Header với tiêu đề và card thông tin */}
          <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
            <h1 className="mb-4 text-4xl font-bold text-gray-800 sm:mb-0">
              Ví cá nhân
            </h1>
            <div className="flex gap-6">
              {/* Card Tài sản của bạn */}
              <div className="flex transform items-center rounded-xl bg-white p-5 shadow-lg transition hover:scale-105">
                <div className="mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tài sản của bạn</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(walletData?.result?.balance || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Khu vực chính: Biểu đồ và Lịch sử giao dịch */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Biểu đồ (chiếm 2 cột) */}
            <div className="rounded-xl bg-white p-6 shadow-lg lg:col-span-2">
              <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                Sơ đồ giao dịch (triệu VND)
              </h2>
              <div className="h-80">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          `${value.toFixed(2)} triệu`,
                          name === 'income' ? 'Thu nhập' : 'Chi tiêu'
                        ]}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#10B981"
                        strokeWidth={3}
                        name="Thu nhập"
                      />
                      <Line
                        type="monotone"
                        dataKey="outcome"
                        stroke="#EF4444"
                        strokeWidth={3}
                        name="Chi tiêu"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">Chưa có dữ liệu giao dịch</p>
                  </div>
                )}
              </div>
            </div>

            {/* Lịch sử giao dịch */}
            <div className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-lg">
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                  Lịch sử giao dịch
                </h2>
                <div className="max-h-80 space-y-3 overflow-y-auto">
                  {transactionData?.result?.datas &&
                  transactionData.result?.datas.length > 0 ? (
                    transactionData.result?.datas
                      .slice(0, 10)
                      .map((transaction) => {
                        const display = getTransactionDisplay(transaction);
                        const displayAmount = getDisplayAmount(transaction);

                        return (
                          <div
                            key={transaction.id}
                            className="flex transform items-center justify-between rounded-lg bg-gray-50 px-4 py-3 transition hover:scale-105"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-600">
                                {display.label}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(
                                  transaction.paymentDate
                                ).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <span className={`font-semibold ${display.color}`}>
                              {display.sign}
                              {formatCurrency(displayAmount)}
                            </span>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center text-gray-500">
                      Chưa có giao dịch nào
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsDepositDialogOpen(true)}
                  className="rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-6 py-3 text-white shadow-lg transition hover:from-green-500 hover:to-green-700"
                >
                  Nạp tiền
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Modal Component */}
        <Recharge
          isOpen={isDepositDialogOpen}
          onClose={() => setIsDepositDialogOpen(false)}
          onSuccess={handleDepositSuccess}
        />
      </div>
    </BasePages>
  );
};

export default Wallet;
