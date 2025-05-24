import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/routes/hooks';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  DollarSign,
  ChevronLeft,
  CreditCard,
  Download,
  Share2
} from 'lucide-react';

const PublisherWallet = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  // Mock data for wallet
  const walletData = {
    balance: 5250000,
    currency: 'VND',
    lastUpdate: '18/05/2025 14:30',
    transactions: [
      {
        id: 'tx-001',
        type: 'deposit',
        amount: 2000000,
        status: 'completed',
        date: '18/05/2025',
        time: '14:15',
        description: 'Nạp tiền vào tài khoản',
        method: 'Bank Transfer'
      },
      {
        id: 'tx-002',
        type: 'withdraw',
        amount: 750000,
        status: 'completed',
        date: '15/05/2025',
        time: '09:45',
        description: 'Thanh toán chiến dịch Spring Sale',
        method: 'Wallet'
      },
      {
        id: 'tx-003',
        type: 'deposit',
        amount: 4000000,
        status: 'completed',
        date: '10/05/2025',
        time: '16:30',
        description: 'Nạp tiền vào tài khoản',
        method: 'Credit Card'
      },
      {
        id: 'tx-004',
        type: 'withdraw',
        amount: 2500000,
        status: 'completed',
        date: '05/05/2025',
        time: '10:15',
        description: 'Thanh toán chiến dịch New Product Launch',
        method: 'Wallet'
      },
      {
        id: 'tx-005',
        type: 'deposit',
        amount: 2500000,
        status: 'completed',
        date: '01/05/2025',
        time: '11:20',
        description: 'Nạp tiền vào tài khoản',
        method: 'Bank Transfer'
      }
    ]
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Filter transactions based on active tab
  const filteredTransactions = walletData.transactions.filter((tx) => {
    if (activeTab === 'all') return true;
    return tx.type === activeTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white ">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-2 hover:bg-gray-100"
                onClick={() => router.push('/publisher/publisher-profile')}
              >
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Ví cá nhân</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mb-20 px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Balance Card */}
          <Card className="overflow-hidden rounded-xl border-none bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl">
            <div className="p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="h-6 w-6" />
                  <h2 className="text-xl font-bold">Số dư hiện tại</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full bg-white/20 p-2 hover:bg-white/30"
                  >
                    <Share2 className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full bg-white/20 p-2 hover:bg-white/30"
                  >
                    <Download className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm font-medium text-white/70">Tổng số dư</p>
                <h1 className="mt-1 text-4xl font-bold tracking-tight">
                  {formatCurrency(walletData.balance)}
                </h1>
                <div className="mt-2 flex items-center text-sm text-white/70">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Cập nhật lần cuối: {walletData.lastUpdate}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button className="flex items-center justify-center gap-2 bg-white/90 text-indigo-600 hover:bg-white">
                  <Plus className="h-4 w-4" />
                  <span>Nạp tiền</span>
                </Button>
                <Button className="flex items-center justify-center gap-2 bg-white/30 text-white hover:bg-white/40">
                  <CreditCard className="h-4 w-4" />
                  <span>Phương thức thanh toán</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="flex flex-col items-center justify-center rounded-xl border-none bg-white p-4 shadow-md">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <ArrowDownLeft className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-center text-sm font-medium text-gray-500">
                Tiền vào
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {formatCurrency(8500000)}
              </p>
            </Card>

            <Card className="flex flex-col items-center justify-center rounded-xl border-none bg-white p-4 shadow-md">
              <div className="bg-red-100 mb-2 flex h-12 w-12 items-center justify-center rounded-full">
                <ArrowUpRight className="text-red-600 h-6 w-6" />
              </div>
              <p className="text-center text-sm font-medium text-gray-500">
                Tiền ra
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {formatCurrency(3250000)}
              </p>
            </Card>
          </div>

          {/* Transaction History */}
          <Card className="rounded-xl border-none bg-white shadow-lg">
            <div className="border-b border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800">Lịch sử giao dịch</h3>
            </div>

            {/* Transaction Tabs */}
            <div className="border-b border-gray-100">
              <div className="flex overflow-x-auto px-6">
                <button
                  className={`flex-shrink-0 border-b-2 px-4 py-3 text-sm font-medium ${
                    activeTab === 'all'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('all')}
                >
                  Tất cả
                </button>
                <button
                  className={`flex-shrink-0 border-b-2 px-4 py-3 text-sm font-medium ${
                    activeTab === 'deposit'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('deposit')}
                >
                  Tiền vào
                </button>
                <button
                  className={`flex-shrink-0 border-b-2 px-4 py-3 text-sm font-medium ${
                    activeTab === 'withdraw'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('withdraw')}
                >
                  Tiền ra
                </button>
              </div>
            </div>

            {/* Transactions List */}
            <div className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <div className="py-16 text-center">
                  <DollarSign className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-gray-500">Không có giao dịch nào</p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-6 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          transaction.type === 'deposit'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {transaction.type === 'deposit' ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {transaction.description}
                        </h4>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-sm text-gray-500">
                            {transaction.date} {transaction.time}
                          </p>
                          <span className="inline-block h-1 w-1 rounded-full bg-gray-300"></span>
                          <p className="text-sm text-gray-500">
                            {transaction.method}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-right font-medium ${
                        transaction.type === 'deposit'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'deposit' ? '+ ' : '- '}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredTransactions.length > 0 && (
              <div className="border-t border-gray-100 p-4 text-center">
                <Button
                  variant="ghost"
                  className="text-sm text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Xem thêm giao dịch
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublisherWallet;
