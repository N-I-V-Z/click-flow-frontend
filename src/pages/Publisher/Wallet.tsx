import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/routes/hooks';
import { useSearchParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  ChevronLeft,
  CreditCard,
  Loader2,
  Eye,
  EyeOff,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';
import BasePages from '@/components/shared/base-pages';
import { useGetOwnWallet } from '@/queries/wallet.query';
import { useGetOwnTransaction } from '@/queries/transaction.query';
import { TransactionType } from '@/types';
import Recharge from './Recharge';

const PublisherWallet = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('all');
  const [showBalance, setShowBalance] = useState(true);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);

  const pageSizeOptions = [10, 20, 30, 40, 50];

  // Lấy tham số phân trang từ URL (giống DataTable)
  const page = searchParams?.get('page') ?? '1';
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const limit = searchParams?.get('limit') ?? '10';
  const limitAsNumber = Number(limit);
  const fallbackLimit = isNaN(limitAsNumber) ? 10 : limitAsNumber;

  // State phân trang
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: fallbackPage - 1, // pageIndex là 0-based
    pageSize: fallbackLimit
  });

  // Cập nhật URL khi phân trang thay đổi (giống DataTable)
  useEffect(() => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: (pageIndex + 1).toString(),
      limit: pageSize.toString()
    });
  }, [pageIndex, pageSize, searchParams, setSearchParams]);

  const currentPage = pageIndex + 1; // Convert về 1-based cho display

  // API calls
  const {
    data: walletData,
    isLoading: walletLoading,
    error: walletError,
    refetch: refetchWallet
  } = useGetOwnWallet();

  const {
    data: transactionData,
    isLoading: transactionLoading,
    error: transactionError,
    refetch: refetchTransactions
  } = useGetOwnTransaction(currentPage, pageSize);

  // Handle successful deposit
  const handleDepositSuccess = async () => {
    // Refresh wallet and transaction data
    await Promise.all([refetchWallet(), refetchTransactions()]);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hôm qua';
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays <= 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get transaction icon and color based on type
  const getTransactionDisplay = (type) => {
    switch (type) {
      case TransactionType.Deposit:
      case TransactionType.Received:
        return {
          icon: TrendingUp,
          colorClass:
            'bg-emerald-50 text-emerald-600 border border-emerald-100',
          textColor: 'text-emerald-600',
          bgColor: 'bg-emerald-500',
          prefix: '+ ',
          category: 'income'
        };
      case TransactionType.Withdraw:
      case TransactionType.Pay:
        return {
          icon: TrendingDown,
          colorClass: 'bg-rose-50 text-rose-600 border border-rose-100',
          textColor: 'text-rose-600',
          bgColor: 'bg-rose-500',
          prefix: '- ',
          category: 'expense'
        };
      default:
        return {
          icon: DollarSign,
          colorClass: 'bg-slate-50 text-slate-600 border border-slate-100',
          textColor: 'text-slate-600',
          bgColor: 'bg-slate-500',
          prefix: '',
          category: 'other'
        };
    }
  };

  // Get transaction description in Vietnamese
  const getTransactionDescription = (type) => {
    switch (type) {
      case TransactionType.Deposit:
        return 'Nạp tiền vào ví';
      case TransactionType.Withdraw:
        return 'Rút tiền khỏi ví';
      case TransactionType.Pay:
        return 'Thanh toán chiến dịch';
      case TransactionType.Received:
        return 'Nhận thanh toán';
      default:
        return 'Giao dịch khác';
    }
  };

  // Filter transactions based on active tab
  const filteredTransactions = useMemo(() => {
    if (!transactionData?.result?.datas) return [];

    return transactionData.result?.datas.filter((tx) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'deposit') {
        return (
          tx.transactionType === TransactionType.Deposit ||
          tx.transactionType === TransactionType.Received
        );
      }
      if (activeTab === 'withdraw') {
        return (
          tx.transactionType === TransactionType.Withdraw ||
          tx.transactionType === TransactionType.Pay
        );
      }
      return true;
    });
  }, [transactionData?.result?.datas, activeTab]);

  // Calculate totals
  const totals = useMemo(() => {
    if (!transactionData?.result?.datas) return { totalIn: 0, totalOut: 0 };

    return transactionData.result?.datas.reduce(
      (acc, tx) => {
        if (
          tx.transactionType === TransactionType.Deposit ||
          tx.transactionType === TransactionType.Received
        ) {
          acc.totalIn += tx.amount;
        } else {
          acc.totalOut += tx.amount;
        }
        return acc;
      },
      { totalIn: 0, totalOut: 0 }
    );
  }, [transactionData?.result?.datas]);

  // Pagination calculations
  const totalPages = transactionData?.result?.totalPages || 1;
  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  // Pagination handlers (giống DataTable)
  const goToFirstPage = () =>
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  const goToPreviousPage = () =>
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.max(0, prev.pageIndex - 1)
    }));
  const goToNextPage = () =>
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.min(totalPages - 1, prev.pageIndex + 1)
    }));
  const goToLastPage = () =>
    setPagination((prev) => ({ ...prev, pageIndex: totalPages - 1 }));

  const handlePageSizeChange = (newPageSize) => {
    setPagination({
      pageIndex: 0, // Reset về trang đầu khi thay đổi page size
      pageSize: Number(newPageSize)
    });
  };

  // Loading states
  if (walletLoading || transactionLoading) {
    return (
      <BasePages pageHead="ClickFlow - Ví">
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 animate-pulse rounded-full border-4 border-blue"></div>
              <Loader2 className="absolute left-4 top-4 h-8 w-8 animate-spin text-blue" />
            </div>
            <span className="font-medium text-slate-600">
              Đang tải dữ liệu ví...
            </span>
          </div>
        </div>
      </BasePages>
    );
  }

  // Error states
  if (walletError || transactionError) {
    return (
      <BasePages pageHead="ClickFlow - Ví">
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue">
          <Card className="mx-4 max-w-md border-0 p-8 text-center shadow-xl">
            <div className="bg-red-100 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <DollarSign className="text-red-600 h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Có lỗi xảy ra
            </h3>
            <p className="mb-6 text-slate-600">
              Không thể tải dữ liệu ví. Vui lòng thử lại.
            </p>
            <Button onClick={() => router.reload()} className="w-full">
              Thử lại
            </Button>
          </Card>
        </div>
      </BasePages>
    );
  }

  const currentBalance = walletData?.result?.balance || 0;
  const lastUpdate = new Date().toLocaleString('vi-VN');

  return (
    <BasePages pageHead="ClickFlow - Ví">
      <div className="via-blue-50 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        {/* Modern Header */}
        <div className="sticky top-0 z-10 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl p-2 transition-colors hover:bg-slate-100"
                  onClick={() => router.push('/publisher/publisher-profile')}
                >
                  <ChevronLeft className="h-5 w-5 text-slate-600" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    Ví cá nhân
                  </h1>
                  <p className="text-sm text-slate-500">
                    Quản lý tài chính của bạn
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="rounded-xl">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto mb-20 px-4 py-8">
          <div className="mx-auto mb-20 max-w-5xl space-y-8">
            {/* Enhanced Balance Card */}
            <div className="relative">
              <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-blue via-purple-600 to-blue text-white shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="relative p-8">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                        <Wallet className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">
                          Số dư hiện tại
                        </h2>
                        <p className="text-sm text-white/70">Ví ClickFlow</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                        onClick={() => setShowBalance(!showBalance)}
                      >
                        {showBalance ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h1 className="mb-2 text-5xl font-bold tracking-tight">
                      {showBalance
                        ? formatCurrency(currentBalance)
                        : '••••••••'}
                    </h1>
                    <div className="flex items-center text-sm text-white/80">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Cập nhật: {lastUpdate}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Deposit Button */}
                    <Button
                      onClick={() => setIsDepositDialogOpen(true)}
                      className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-white font-semibold text-blue shadow-lg hover:bg-white/90"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Nạp tiền</span>
                    </Button>

                    <Button className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/30 bg-white/20 font-semibold backdrop-blur-sm hover:bg-white/30">
                      <CreditCard className="h-5 w-5" />
                      <span>Rút tiền</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Modern Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="rounded-3xl border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 font-medium text-emerald-700">
                      Tổng tiền vào
                    </p>
                    <p className="text-3xl font-bold text-emerald-900">
                      {formatCurrency(totals.totalIn)}
                    </p>
                    <p className="mt-1 text-sm text-emerald-600">
                      ↗ So với tháng trước
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-500 p-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl border-0 bg-gradient-to-br from-rose-50 to-rose-100/50 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 font-medium text-rose-700">
                      Tổng tiền ra
                    </p>
                    <p className="text-3xl font-bold text-rose-900">
                      {formatCurrency(totals.totalOut)}
                    </p>
                    <p className="mt-1 text-sm text-rose-600">
                      ↘ Chi tiêu tháng này
                    </p>
                  </div>
                  <div className="rounded-2xl bg-rose-500 p-4">
                    <TrendingDown className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Enhanced Transaction History */}
            <Card className="mb-20 rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur-sm">
              <div className="border-b border-slate-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Lịch sử giao dịch
                    </h3>
                    <p className="text-sm text-slate-500">
                      Theo dõi các giao dịch gần đây
                    </p>
                  </div>
                </div>
              </div>

              {/* Modern Tabs */}
              <div className="border-b border-slate-100">
                <div className="flex overflow-x-auto px-6">
                  {[
                    {
                      key: 'all',
                      label: 'Tất cả',
                      count: transactionData?.result?.datas?.length || 0
                    },
                    {
                      key: 'deposit',
                      label: 'Tiền vào',
                      count: filteredTransactions.filter(
                        (tx) =>
                          getTransactionDisplay(tx.transactionType).category ===
                          'income'
                      ).length
                    },
                    {
                      key: 'withdraw',
                      label: 'Tiền ra',
                      count: filteredTransactions.filter(
                        (tx) =>
                          getTransactionDisplay(tx.transactionType).category ===
                          'expense'
                      ).length
                    }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      className={`relative flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                        activeTab === tab.key
                          ? 'text-blue'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          activeTab === tab.key
                            ? 'bg-blue text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {tab.count}
                      </span>
                      {activeTab === tab.key && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Transactions List */}
              <div className="divide-y divide-slate-100">
                {filteredTransactions.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                      <DollarSign className="h-8 w-8 text-slate-400" />
                    </div>
                    <h4 className="mb-2 text-lg font-semibold text-slate-900">
                      Chưa có giao dịch
                    </h4>
                    <p className="text-slate-500">
                      Các giao dịch của bạn sẽ hiển thị tại đây
                    </p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => {
                    const display = getTransactionDisplay(
                      transaction.transactionType
                    );
                    const formattedDate = formatDate(transaction.paymentDate);
                    const IconComponent = display.icon;

                    return (
                      <div
                        key={transaction.id}
                        className="group flex items-center justify-between p-6 transition-colors hover:bg-slate-50/50"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${display.colorClass} transition-transform group-hover:scale-110`}
                          >
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="mb-1 font-semibold text-slate-900">
                              {getTransactionDescription(
                                transaction.transactionType
                              )}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                              <span>{formattedDate}</span>
                              <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                              <span>
                                Số dư: {formatCurrency(transaction.balance)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`text-right text-lg font-bold ${display.textColor}`}
                        >
                          {display.prefix}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination Controls */}
              {filteredTransactions.length > 0 && (
                <div className="border-t border-slate-100 p-6">
                  <div className="flex flex-col items-center justify-end gap-2 space-x-2 sm:flex-row">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex-1 text-sm text-muted-foreground">
                        {/* Thông tin tổng số bản ghi nếu cần */}
                      </div>
                      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                        <div className="flex items-center space-x-2">
                          <p className="whitespace-nowrap text-sm font-medium">
                            Hiển thị
                          </p>
                          <Select
                            value={`${pageSize}`}
                            onValueChange={handlePageSizeChange}
                          >
                            <SelectTrigger className="h-8 w-[70px]">
                              <SelectValue placeholder={pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                              {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
                      <div className="flex w-[150px] items-center justify-center text-sm font-medium">
                        Trang {currentPage} trên {totalPages}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          aria-label="Go to first page"
                          variant="outline"
                          className="hidden h-8 w-8 p-0 lg:flex"
                          onClick={goToFirstPage}
                          disabled={!canPreviousPage}
                        >
                          <DoubleArrowLeftIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </Button>
                        <Button
                          aria-label="Go to previous page"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={goToPreviousPage}
                          disabled={!canPreviousPage}
                        >
                          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          aria-label="Go to next page"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={goToNextPage}
                          disabled={!canNextPage}
                        >
                          <ChevronRight
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </Button>
                        <Button
                          aria-label="Go to last page"
                          variant="outline"
                          className="hidden h-8 w-8 p-0 lg:flex"
                          onClick={goToLastPage}
                          disabled={!canNextPage}
                        >
                          <DoubleArrowRightIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
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

export default PublisherWallet;
