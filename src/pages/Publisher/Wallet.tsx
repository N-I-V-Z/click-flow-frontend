import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
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
  Loader2,
  Eye,
  EyeOff,
  MoreHorizontal,
  ChevronRight,
  CreditCard,
  Edit3
} from 'lucide-react';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';
import BasePages from '@/components/shared/base-pages';
import { useGetOwnWallet, useUpdateBankInfo } from '@/queries/wallet.query';
import { useGetOwnTransaction } from '@/queries/transaction.query';
import { TransactionType } from '@/types';
import Recharge from './Recharge';

const PublisherWallet = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('all');
  const [showBalance, setShowBalance] = useState(true);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isBankInfoDialogOpen, setIsBankInfoDialogOpen] = useState(false);
  const [bankFormData, setBankFormData] = useState({
    bankCode: '',
    bankName: ''
  });

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

  // Bank info update mutation
  const { mutate: updateBankInfo, isPending: isUpdatingBank } =
    useUpdateBankInfo();

  // Handle successful deposit
  const handleDepositSuccess = async () => {
    // Refresh wallet and transaction data
    await Promise.all([refetchWallet(), refetchTransactions()]);
  };

  // Handle bank info dialog
  const handleOpenBankDialog = () => {
    if (walletData?.result) {
      setBankFormData({
        bankCode: walletData.result.bankCode || '',
        bankName: walletData.result.bankName || ''
      });
    }
    setIsBankInfoDialogOpen(true);
  };

  const handleBankInfoSubmit = () => {
    if (!walletData?.result?.id) return;

    updateBankInfo(
      {
        walletId: walletData.result.id,
        bankData: {
          bankCode: bankFormData.bankCode,
          bankName: bankFormData.bankName
        }
      },
      {
        onSuccess: () => {
          setIsBankInfoDialogOpen(false);
          // Toast notification có thể thêm ở đây
        },
        onError: (error) => {
          console.error('Update bank info failed:', error);
          // Error handling có thể thêm ở đây
        }
      }
    );
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
          colorClass: 'border',
          textColor: 'text-[#059669]',
          bgColor: 'bg-[#10B981]',
          bgStyle: {
            backgroundColor: '#ECFDF5',
            color: '#059669',
            borderColor: '#A7F3D0'
          },
          prefix: '+ ',
          category: 'income'
        };
      case TransactionType.Withdraw:
      case TransactionType.Pay:
        return {
          icon: TrendingDown,
          colorClass: 'border',
          textColor: 'text-[#E11D48]',
          bgColor: 'bg-[#EF4444]',
          bgStyle: {
            backgroundColor: '#FFF1F2',
            color: '#E11D48',
            borderColor: '#FECDD3'
          },
          prefix: '- ',
          category: 'expense'
        };
      default:
        return {
          icon: DollarSign,
          colorClass: 'border',
          textColor: 'text-[#64748B]',
          bgColor: 'bg-[#64748B]',
          bgStyle: {
            backgroundColor: '#F8FAFC',
            color: '#64748B',
            borderColor: '#E2E8F0'
          },
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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="h-16 w-16 animate-pulse rounded-full border-4"
                style={{ borderColor: '#8B5CF6' }}
              ></div>
              <Loader2
                className="absolute left-4 top-4 h-8 w-8 animate-spin"
                style={{ color: '#8B5CF6' }}
              />
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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50">
          <Card className="mx-4 max-w-md border-0 p-8 text-center shadow-xl">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <DollarSign className="h-8 w-8" style={{ color: '#DC2626' }} />
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#EEF2FF] to-[#E0E7FF]">
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
              <Card
                className="overflow-hidden rounded-3xl border-0 text-white shadow-2xl"
                style={{
                  background:
                    'linear-gradient(to bottom right, #8B5CF6, #A855F7, #C084FC)'
                }}
              >
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
                      className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-white font-semibold shadow-lg hover:bg-white/90"
                      style={{ color: '#8B5CF6' }}
                    >
                      <Plus className="h-5 w-5" />
                      <span>Nạp tiền</span>
                    </Button>

                    {/* Bank Info Button */}
                    <Button
                      onClick={handleOpenBankDialog}
                      className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-white/20 font-semibold text-white backdrop-blur-sm hover:bg-white/30"
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>Ngân hàng</span>
                    </Button>
                  </div>

                  {/* Bank Info Display */}
                  {walletData?.result && (
                    <div
                      className="relative mt-6 overflow-hidden rounded-xl border p-5 backdrop-blur-sm"
                      style={{
                        background:
                          'linear-gradient(135deg, #4C1D95 0%, #5B21B6 25%, #6D28D9 50%, #7C3AED 75%, #8B5CF6 100%)',
                        borderColor: '#A855F7',
                        boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)'
                      }}
                    >
                      {/* Harmonized Diamond Pattern Background */}
                      <div className="absolute inset-0 opacity-15">
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 400 400"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            <pattern
                              id="diamond-pattern"
                              x="0"
                              y="0"
                              width="25"
                              height="25"
                              patternUnits="userSpaceOnUse"
                            >
                              {/* Large outer diamonds */}
                              <polygon
                                points="12.5,2 23,12.5 12.5,23 2,12.5"
                                fill="none"
                                stroke="#DDD6FE"
                                strokeWidth="0.6"
                                opacity="0.5"
                              />
                              {/* Medium diamonds */}
                              <polygon
                                points="12.5,5 20,12.5 12.5,20 5,12.5"
                                fill="none"
                                stroke="#C4B5FD"
                                strokeWidth="0.4"
                                opacity="0.4"
                              />
                              {/* Small inner diamonds */}
                              <polygon
                                points="12.5,8 17,12.5 12.5,17 8,12.5"
                                fill="none"
                                stroke="#A78BFA"
                                strokeWidth="0.3"
                                opacity="0.6"
                              />
                              {/* Cross lines */}
                              <line
                                x1="12.5"
                                y1="2"
                                x2="12.5"
                                y2="23"
                                stroke="#E0E7FF"
                                strokeWidth="0.2"
                                opacity="0.3"
                              />
                              <line
                                x1="2"
                                y1="12.5"
                                x2="23"
                                y2="12.5"
                                stroke="#E0E7FF"
                                strokeWidth="0.2"
                                opacity="0.3"
                              />
                              {/* Corner decorations */}
                              <circle
                                cx="6"
                                cy="6"
                                r="1"
                                fill="#DDD6FE"
                                opacity="0.3"
                              />
                              <circle
                                cx="19"
                                cy="6"
                                r="1"
                                fill="#DDD6FE"
                                opacity="0.3"
                              />
                              <circle
                                cx="6"
                                cy="19"
                                r="1"
                                fill="#DDD6FE"
                                opacity="0.3"
                              />
                              <circle
                                cx="19"
                                cy="19"
                                r="1"
                                fill="#DDD6FE"
                                opacity="0.3"
                              />
                            </pattern>
                          </defs>
                          <rect
                            width="100%"
                            height="100%"
                            fill="url(#diamond-pattern)"
                          />
                        </svg>
                      </div>

                      {/* Purple-Gold Metallic Shine Effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-purple-300/10"></div>
                      <div className="absolute left-0 top-0 h-3 w-full bg-gradient-to-r from-transparent via-white/25 to-transparent"></div>
                      <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-gradient-to-tl from-purple-400/15 to-transparent blur-xl"></div>

                      {/* Luxury Brand Strip - Purple themed */}
                      <div className="absolute right-4 top-2 h-1 w-20 rounded-full bg-gradient-to-r from-purple-300 to-purple-500 opacity-70"></div>

                      <div className="relative flex items-center justify-between">
                        <div className="flex-1">
                          <p
                            className="mb-1 text-xs font-bold uppercase tracking-wider"
                            style={{
                              color: '#E0E7FF',
                              textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                              letterSpacing: '0.1em'
                            }}
                          >
                            Thông tin ngân hàng
                          </p>
                          {walletData.result.bankCode &&
                          walletData.result.bankName ? (
                            <div className="mt-2">
                              <p
                                className="mb-2 text-xl font-bold tracking-wide"
                                style={{
                                  color: '#FFFFFF',
                                  textShadow: '0 2px 4px rgba(0,0,0,0.7)'
                                }}
                              >
                                {walletData.result.bankName}
                              </p>
                              <p
                                className="font-mono text-lg font-bold tracking-widest"
                                style={{
                                  color: '#E5E7EB',
                                  textShadow:
                                    '0 0 10px rgba(229, 231, 235, 0.6), 0 2px 4px rgba(0,0,0,0.5)',
                                  background:
                                    'linear-gradient(45deg, #F3F4F6, #E5E7EB, #D1D5DB)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text'
                                }}
                              >
                                {walletData.result.bankCode}
                              </p>
                            </div>
                          ) : (
                            <p
                              className="mt-2 text-sm"
                              style={{ color: '#C4B5FD' }}
                            >
                              Chưa cập nhật thông tin ngân hàng
                            </p>
                          )}
                        </div>
                        <div className="ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleOpenBankDialog}
                            className="rounded-xl p-3 shadow-lg transition-all duration-300 hover:opacity-80"
                            style={{
                              background:
                                'linear-gradient(135deg, #A855F7 0%, #C084FC 50%, #E879F9 100%)',
                              color: 'white',
                              boxShadow:
                                '0 4px 15px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                              border: '1px solid rgba(192, 132, 252, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                'translateY(-1px)';
                              e.currentTarget.style.boxShadow =
                                '0 6px 20px rgba(168, 85, 247, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow =
                                '0 4px 15px rgba(168, 85, 247, 0.4)';
                            }}
                          >
                            <Edit3 className="h-4 w-4 font-bold" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Modern Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card
                className="rounded-3xl border-0 p-6 shadow-lg"
                style={{
                  background:
                    'linear-gradient(to bottom right, #ECFDF5, #D1FAE5)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="mb-1 font-medium"
                      style={{ color: '#047857' }}
                    >
                      Tổng tiền vào
                    </p>
                    <p
                      className="text-3xl font-bold"
                      style={{ color: '#064E3B' }}
                    >
                      {formatCurrency(totals.totalIn)}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: '#059669' }}>
                      ↗ So với tháng trước
                    </p>
                  </div>
                  <div
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: '#10B981' }}
                  >
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card
                className="rounded-3xl border-0 p-6 shadow-lg"
                style={{
                  background:
                    'linear-gradient(to bottom right, #FFF1F2, #FECDD3)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="mb-1 font-medium"
                      style={{ color: '#BE123C' }}
                    >
                      Tổng tiền ra
                    </p>
                    <p
                      className="text-3xl font-bold"
                      style={{ color: '#881337' }}
                    >
                      {formatCurrency(totals.totalOut)}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: '#E11D48' }}>
                      ↘ Chi tiêu tháng này
                    </p>
                  </div>
                  <div
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: '#EF4444' }}
                  >
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
                          ? ''
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                      style={activeTab === tab.key ? { color: '#8B5CF6' } : {}}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          activeTab === tab.key
                            ? 'text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                        style={
                          activeTab === tab.key
                            ? { backgroundColor: '#8B5CF6' }
                            : {}
                        }
                      >
                        {tab.count}
                      </span>
                      {activeTab === tab.key && (
                        <div
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                          style={{ backgroundColor: '#8B5CF6' }}
                        ></div>
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
                      <DollarSign
                        className="h-8 w-8"
                        style={{ color: '#94A3B8' }}
                      />
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
                            style={display.bgStyle}
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
                              <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  transaction.status
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {transaction.status
                                  ? 'Thành công'
                                  : 'Đang xử lý'}
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

        {/* Bank Info Modal */}
        <Dialog
          open={isBankInfoDialogOpen}
          onOpenChange={setIsBankInfoDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" style={{ color: '#8B5CF6' }} />
                Cập nhật thông tin ngân hàng
              </DialogTitle>
              <DialogDescription>
                Cập nhật thông tin tài khoản ngân hàng để nhận thanh toán.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="bankName">Tên ngân hàng</Label>
                <Input
                  id="bankName"
                  placeholder="Ví dụ: Vietcombank"
                  value={bankFormData.bankName}
                  onChange={(e) =>
                    setBankFormData((prev) => ({
                      ...prev,
                      bankName: e.target.value
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bankCode">Số tài khoản</Label>
                <Input
                  id="bankCode"
                  placeholder="Nhập số tài khoản ngân hàng"
                  value={bankFormData.bankCode}
                  onChange={(e) =>
                    setBankFormData((prev) => ({
                      ...prev,
                      bankCode: e.target.value
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBankInfoDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={handleBankInfoSubmit}
                disabled={
                  isUpdatingBank ||
                  !bankFormData.bankCode.trim() ||
                  !bankFormData.bankName.trim()
                }
                className="hover:opacity-90"
                style={{
                  backgroundColor: '#8B5CF6',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#7C3AED';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#8B5CF6';
                  }
                }}
              >
                {isUpdatingBank ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  'Cập nhật'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </BasePages>
  );
};

export default PublisherWallet;
