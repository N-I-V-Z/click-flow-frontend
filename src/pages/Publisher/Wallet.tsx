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
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
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
  Edit3,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';
import BasePages from '@/components/shared/base-pages';
import { useGetOwnWallet, useUpdateBankInfo } from '@/queries/wallet.query';
import {
  useGetOwnTransaction,
  useCreateNewTransaction
} from '@/queries/transaction.query';
import { useGetBanks, Bank } from '@/queries/bank.query';
import { TransactionType } from '@/types';
import Recharge from './Recharge';
import { toast } from 'react-toastify';
import ToastNotification from '@/components/shared/toast-notification';

const PublisherWallet = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('all');
  const [showBalance, setShowBalance] = useState(false);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isBankInfoDialogOpen, setIsBankInfoDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankFormData, setBankFormData] = useState({
    bankCode: '',
    bankName: '',
    selectedBank: null as Bank | null
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

  // Tự động mở popup nạp tiền nếu có parameter autoRecharge
  useEffect(() => {
    const autoRecharge = searchParams?.get('autoRecharge');
    if (autoRecharge === 'true') {
      setIsDepositDialogOpen(true);
      // Xóa parameter sau khi đã mở popup
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('autoRecharge');
      setSearchParams(newSearchParams);
    }
  }, [searchParams, setSearchParams]);

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

  // Banks API call
  const {
    data: banksData,
    isLoading: banksLoading,
    error: banksError
  } = useGetBanks();

  // Bank info update mutation
  const { mutate: updateBankInfo, isPending: isUpdatingBank } =
    useUpdateBankInfo();

  // Withdraw mutation
  const { mutate: createWithdrawTransaction, isPending: isWithdrawing } =
    useCreateNewTransaction();

  // Handle successful deposit
  const handleDepositSuccess = async () => {
    // Refresh wallet and transaction data
    await Promise.all([refetchWallet(), refetchTransactions()]);
  };

  // Handle bank info dialog
  const handleOpenBankDialog = () => {
    if (walletData?.result) {
      // Find selected bank if exists
      let selectedBank: Bank | null = null;
      if (walletData.result.bankCode && banksData?.data) {
        selectedBank =
          banksData.data.find(
            (bank) =>
              bank.code === walletData.result!.bankCode ||
              bank.bin === walletData.result!.bankCode
          ) || null;
      }

      setBankFormData({
        bankCode: walletData.result.bankCode || '',
        bankName: walletData.result.bankName || '',
        selectedBank: selectedBank
      });
    }
    setIsBankInfoDialogOpen(true);
  };

  const handleBankInfoSubmit = () => {
    if (!walletData?.result?.id) return;

    // Use selected bank info if available, otherwise use manual input
    const bankData = bankFormData.selectedBank
      ? {
          bankCode: bankFormData.bankCode, // Account number
          bankName: `${bankFormData.selectedBank.shortName} - ${bankFormData.selectedBank.name}`
        }
      : {
          bankCode: bankFormData.bankCode,
          bankName: bankFormData.bankName
        };

    updateBankInfo(
      {
        walletId: walletData.result.id,
        bankData: bankData
      },
      {
        onSuccess: () => {
          setIsBankInfoDialogOpen(false);
          toast.success('Cập nhật thông tin ngân hàng thành công!');
          refetchWallet(); // Refresh wallet data
        },
        onError: (error) => {
          console.error('Update bank info failed:', error);
          toast.error('Cập nhật thông tin ngân hàng thất bại!');
        }
      }
    );
  };

  // Handle withdraw dialog
  const handleOpenWithdrawDialog = () => {
    if (!walletData?.result) {
      toast.error('Không thể lấy thông tin ví!');
      return;
    }
    setWithdrawAmount('');
    setIsWithdrawDialogOpen(true);
  };

  const handleWithdrawSubmit = () => {
    if (!walletData?.result) {
      toast.error('Không thể lấy thông tin ví!');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    const currentBalance = walletData.result.balance;

    // Validation
    if (isNaN(amount) || amount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ!');
      return;
    }

    if (amount < 10000) {
      toast.error('Số tiền rút tối thiểu là 10.000 VNĐ!');
      return;
    }

    if (amount > 2000000) {
      toast.error('Số tiền rút tối đa là 2.000.000 VNĐ!');
      return;
    }

    if (amount > currentBalance) {
      toast.error(
        `Số dư không đủ để thực hiện giao dịch! Số dư hiện tại: ${currentBalance.toLocaleString().replace(/,/g, '.')} VNĐ`
      );
      return;
    }

    const payload = {
      amount: amount,
      transactionType: 'Withdraw'
    };

    createWithdrawTransaction(payload, {
      onSuccess: () => {
        toast.success('Yêu cầu rút tiền đã được gửi thành công!');
        setIsWithdrawDialogOpen(false);
        setWithdrawAmount('');
        // Refresh data
        handleDepositSuccess();
      },
      onError: (error: unknown) => {
        // Extract error message properly (same logic as Recharge.tsx)
        let errorMessage = 'Có lỗi xảy ra khi rút tiền!';

        if (error) {
          if (typeof error === 'string') {
            errorMessage = error;
          } else if (error && typeof error === 'object') {
            const errorObj = error as Record<string, unknown>;

            // Check for nested response.data.message (typical axios error)
            if (errorObj.response && typeof errorObj.response === 'object') {
              const response = errorObj.response as Record<string, unknown>;
              if (response.data && typeof response.data === 'object') {
                const data = response.data as Record<string, unknown>;
                if (typeof data.message === 'string') {
                  errorMessage = data.message;
                }
              }
            }
            // Check for direct message property
            else if (typeof errorObj.message === 'string') {
              errorMessage = errorObj.message;
            }
          }
        }

        toast.error(`Rút tiền thất bại: ${errorMessage}`);
      }
    });
  };

  const handleWithdrawCancel = () => {
    setIsWithdrawDialogOpen(false);
    setWithdrawAmount('');
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

  // Get bank info for display
  const getBankDisplayInfo = () => {
    if (!walletData?.result?.bankCode || !banksData?.data) return null;

    // Try to find bank by various matching criteria
    const bank = banksData.data.find(
      (bank) =>
        bank.code === walletData.result!.bankCode ||
        bank.bin === walletData.result!.bankCode ||
        walletData.result!.bankName?.includes(bank.shortName) ||
        walletData.result!.bankName?.includes(bank.name)
    );

    return bank;
  };

  const bankDisplayInfo = getBankDisplayInfo();
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

                    {/* Withdraw Button */}
                    <Button
                      onClick={handleOpenWithdrawDialog}
                      className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-white/20 font-semibold text-white backdrop-blur-sm hover:bg-white/30"
                    >
                      <DollarSign className="h-5 w-5" />
                      <span>Rút tiền</span>
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
                        boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
                        animation: 'metallic-glow 4s ease-in-out infinite'
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

                      {/* Enhanced Purple Metallic Shine Effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-purple-200/5 to-indigo-300/10"></div>

                      {/* Main metallic shine sweep */}
                      <div className="absolute left-0 top-0 h-full w-full -translate-x-full -skew-x-12 transform animate-[shine_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                      {/* Top edge light */}
                      <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

                      {/* Corner highlights */}
                      <div className="absolute left-0 top-0 h-16 w-16 rounded-full bg-gradient-to-br from-white/25 to-transparent blur-lg"></div>
                      <div className="absolute bottom-0 right-0 h-20 w-20 rounded-full bg-gradient-to-tl from-purple-400/20 to-transparent blur-xl"></div>

                      {/* Metallic reflection strips */}
                      <div className="absolute left-0 top-1/4 h-px w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                      <div className="absolute left-0 top-3/4 h-px w-full bg-gradient-to-r from-transparent via-purple-300/40 to-transparent"></div>

                      {/* Luxury Brand Strip - Enhanced Purple themed */}
                      <div className="absolute right-4 top-2 h-1.5 w-24 rounded-full bg-gradient-to-r from-purple-200 via-white to-purple-400 opacity-80 shadow-lg"></div>

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
                              <div className="mb-2 flex items-center gap-4">
                                {bankDisplayInfo && (
                                  <div
                                    className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border shadow-xl"
                                    style={{
                                      background:
                                        'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 25%, #E2E8F0 50%, #CBD5E1 75%, #94A3B8 100%)',
                                      borderColor: '#E2E8F0',
                                      boxShadow:
                                        '0 8px 25px rgba(255, 255, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                                    }}
                                  >
                                    {/* Enhanced metallic shine effect for logo container */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-purple-200/30"></div>
                                    <div className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
                                    <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-gradient-to-br from-white/40 to-transparent blur-sm"></div>

                                    {/* Metallic pulse animation on logo background */}
                                    <div
                                      className="absolute inset-0 -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                      style={{
                                        animation:
                                          'metallic-pulse 2s ease-in-out infinite'
                                      }}
                                    ></div>

                                    <img
                                      src={bankDisplayInfo.logo}
                                      alt={bankDisplayInfo.shortName}
                                      className="relative z-10 h-10 w-10 object-contain drop-shadow-lg filter"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p
                                    className="text-xl font-bold tracking-wide"
                                    style={{
                                      color: '#FFFFFF',
                                      textShadow: '0 2px 4px rgba(0,0,0,0.7)',
                                      background:
                                        'linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 50%, #C7D2FE 100%)',
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent',
                                      backgroundClip: 'text'
                                    }}
                                  >
                                    {bankDisplayInfo
                                      ? bankDisplayInfo.shortName
                                      : walletData.result.bankName}
                                  </p>
                                  <p
                                    className="mt-1 font-mono text-lg font-bold tracking-widest"
                                    style={{
                                      textShadow:
                                        '0 0 15px rgba(232, 121, 249, 0.8), 0 2px 4px rgba(0,0,0,0.7)',
                                      background:
                                        'linear-gradient(135deg, #F7FAFC 0%, #E0E7FF 25%, #DDD6FE 50%, #E879F9 75%, #F3E8FF 100%)',
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent',
                                      backgroundClip: 'text',
                                      filter:
                                        'drop-shadow(0 0 8px rgba(232, 121, 249, 0.6))'
                                    }}
                                  >
                                    STK: {walletData.result.bankCode}
                                  </p>
                                </div>
                              </div>
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
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="font-medium" style={{ color: '#047857' }}>
                        Tổng tiền vào
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-xl p-2 hover:bg-green-100"
                        onClick={() => setShowBalance(!showBalance)}
                      >
                        {showBalance ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                    </div>
                    <p
                      className="text-3xl font-bold"
                      style={{ color: '#064E3B' }}
                    >
                      {showBalance
                        ? formatCurrency(totals.totalIn)
                        : '••••••••'}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: '#059669' }}>
                      ↗ So với tháng trước
                    </p>
                  </div>
                  <div
                    className="ml-4 rounded-2xl p-4"
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
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="font-medium" style={{ color: '#BE123C' }}>
                        Tổng tiền ra
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-xl p-2 hover:bg-red-100"
                        onClick={() => setShowBalance(!showBalance)}
                      >
                        {showBalance ? (
                          <Eye className="h-4 w-4 text-red-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-red-600" />
                        )}
                      </Button>
                    </div>
                    <p
                      className="text-3xl font-bold"
                      style={{ color: '#881337' }}
                    >
                      {showBalance
                        ? formatCurrency(totals.totalOut)
                        : '••••••••'}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: '#E11D48' }}>
                      ↘ Chi tiêu tháng này
                    </p>
                  </div>
                  <div
                    className="ml-4 rounded-2xl p-4"
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

        {/* Withdraw Modal */}
        <Dialog
          open={isWithdrawDialogOpen}
          onOpenChange={setIsWithdrawDialogOpen}
        >
          <DialogContent className="overflow-hidden p-0 sm:max-w-[480px]">
            {/* Header với gradient đẹp */}
            <div
              className="relative overflow-hidden px-6 py-6 text-white"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {/* Custom close button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsWithdrawDialogOpen(false);
                }}
                className="absolute right-4 top-4 z-50 cursor-pointer rounded-full bg-white/10 p-2 backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
                style={{ zIndex: 9999 }}
              >
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,0 Q50,20 100,0 L100,100 L0,100 Z"
                    fill="white"
                    opacity="0.1"
                  />
                  <circle cx="80" cy="20" r="10" fill="white" opacity="0.05" />
                  <circle cx="20" cy="80" r="8" fill="white" opacity="0.05" />
                </svg>
              </div>

              <div className="relative">
                <DialogTitle className="mb-1 flex items-center gap-3 text-xl font-bold">
                  <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  Rút tiền về ví
                </DialogTitle>
                <DialogDescription className="text-white/80">
                  Rút tiền từ ví ClickFlow về tài khoản ngân hàng của bạn
                </DialogDescription>
              </div>
            </div>

            <div className="space-y-4 px-6 py-4">
              {/* Số tiền input */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-800">
                  Số tiền
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="0"
                    value={
                      withdrawAmount
                        ? parseInt(withdrawAmount)
                            .toLocaleString()
                            .replace(/,/g, '.')
                        : ''
                    }
                    onChange={(e) => {
                      // Chỉ cho phép số và dấu chấm, loại bỏ tất cả ký tự khác
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setWithdrawAmount(value);
                    }}
                    className="h-12 rounded-xl border-2 pl-4 pr-16 text-center text-xl font-bold text-gray-800 focus:border-purple-500"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                    VND
                  </span>
                </div>

                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>Tối thiểu: 10.000 VND</span>
                  <span>Tối đa: 2.000.000 VND</span>
                </div>
              </div>

              {/* Chọn nhanh số tiền */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-800">
                  Chọn nhanh
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[50000, 100000, 200000, 500000, 1000000, 2000000].map(
                    (amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        className="h-9 rounded-lg border text-xs transition-all hover:border-purple-500 hover:bg-purple-50"
                        onClick={() => setWithdrawAmount(amount.toString())}
                        disabled={
                          !walletData?.result?.balance ||
                          walletData.result.balance < amount
                        }
                      >
                        {amount.toLocaleString().replace(/,/g, '.')}
                      </Button>
                    )
                  )}
                </div>
              </div>

              {/* Thông tin số dư và ngân hàng gộp lại */}
              {walletData?.result && (
                <div className="space-y-2">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Số dư hiện tại:</span>
                      <span className="font-bold text-purple-600">
                        {walletData.result.balance
                          .toLocaleString()
                          .replace(/,/g, '.')}{' '}
                        VND
                      </span>
                    </div>
                  </div>

                  {/* Bank Info Display */}
                  {walletData.result.bankCode && walletData.result.bankName ? (
                    <div className="rounded-lg border border-purple-200 bg-gradient-to-r from-blue-50 to-purple-50 p-3">
                      <div className="flex items-center gap-3">
                        {bankDisplayInfo ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
                              style={{
                                background:
                                  'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #E2E8F0 100%)',
                                boxShadow:
                                  '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                              }}
                            >
                              {/* Metallic shine for modal logo */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-purple-100/20"></div>
                              <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>

                              <img
                                src={bankDisplayInfo.logo}
                                alt={bankDisplayInfo.shortName}
                                className="relative z-10 h-6 w-6 object-contain drop-shadow-sm filter"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="rounded-lg bg-purple-100 p-1.5">
                              <CreditCard className="h-4 w-4 text-purple-600" />
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-lg bg-purple-100 p-1.5">
                            <CreditCard className="h-4 w-4 text-purple-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-700">
                            Chuyển về:{' '}
                            {bankDisplayInfo
                              ? bankDisplayInfo.shortName
                              : walletData.result.bankName}
                          </p>
                          <p className="font-mono text-xs text-gray-600">
                            STK: {walletData.result.bankCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-red-100 p-1.5">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="mb-1 text-xs text-red-600">
                            ⚠️ Chưa cập nhật thông tin ngân hàng
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 border-red-200 text-xs text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setIsWithdrawDialogOpen(false);
                              handleOpenBankDialog();
                            }}
                          >
                            Cập nhật ngay
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="flex gap-3 px-6 pb-4">
              <Button
                variant="outline"
                onClick={handleWithdrawCancel}
                className="h-10 flex-1 rounded-xl border font-medium"
              >
                Hủy
              </Button>
              <Button
                onClick={handleWithdrawSubmit}
                disabled={
                  isWithdrawing ||
                  !withdrawAmount ||
                  !walletData?.result?.bankCode ||
                  !walletData?.result?.bankName
                }
                className="h-10 flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-medium text-white transition-all hover:from-purple-700 hover:to-blue-700"
              >
                {isWithdrawing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Xác nhận rút tiền
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bank Info Modal */}
        <Dialog
          open={isBankInfoDialogOpen}
          onOpenChange={setIsBankInfoDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader className="relative">
              {/* Custom close button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsBankInfoDialogOpen(false);
                }}
                className="absolute right-0 top-0 z-50 cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-gray-100"
                style={{ zIndex: 9999 }}
              >
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" style={{ color: '#8B5CF6' }} />
                Cập nhật thông tin ngân hàng
              </DialogTitle>
              <DialogDescription>
                Chọn ngân hàng và nhập số tài khoản để nhận thanh toán.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Bank Selection */}
              <div className="grid gap-2">
                <Label htmlFor="bankSelect">Chọn ngân hàng</Label>
                {banksLoading ? (
                  <div className="flex h-10 items-center justify-center rounded-lg border bg-gray-50">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    <span className="ml-2 text-sm text-gray-500">
                      Đang tải danh sách ngân hàng...
                    </span>
                  </div>
                ) : banksError ? (
                  <div className="flex h-10 items-center justify-center rounded-lg border border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="ml-2 text-sm text-red-600">
                      Không thể tải danh sách ngân hàng
                    </span>
                  </div>
                ) : (
                  <Combobox
                    value={bankFormData.selectedBank?.code || ''}
                    onValueChange={(value) => {
                      const selectedBank = banksData?.data?.find(
                        (bank) => bank.code === value
                      );
                      setBankFormData((prev) => ({
                        ...prev,
                        selectedBank: selectedBank || null
                      }));
                    }}
                    placeholder="Chọn ngân hàng..."
                    searchPlaceholder="Tìm kiếm ngân hàng..."
                    emptyText="Không tìm thấy ngân hàng phù hợp."
                    options={
                      banksData?.data
                        ?.filter((bank) => bank.isTransfer === 1) // Only show banks that support transfer
                        ?.sort((a, b) => a.shortName.localeCompare(b.shortName))
                        ?.map(
                          (bank): ComboboxOption => ({
                            value: bank.code,
                            label: `${bank.shortName} - ${bank.name}`,
                            searchText: `${bank.shortName} ${bank.name} ${bank.code}`,
                            customTriggerDisplay: (
                              <div className="flex items-center gap-3">
                                <img
                                  src={bank.logo}
                                  alt={bank.shortName}
                                  className="h-6 w-6 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                <span className="font-medium">
                                  {bank.shortName}
                                </span>
                                <span className="truncate text-sm text-gray-500">
                                  {bank.name}
                                </span>
                              </div>
                            ),
                            customDisplay: (
                              <div className="flex w-full items-center gap-3">
                                <img
                                  src={bank.logo}
                                  alt={bank.shortName}
                                  className="h-6 w-6 flex-shrink-0 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                <div className="flex min-w-0 flex-1 flex-col">
                                  <span className="text-sm font-medium">
                                    {bank.shortName}
                                  </span>
                                  <span className="truncate text-xs text-gray-500">
                                    {bank.name}
                                  </span>
                                </div>
                              </div>
                            )
                          })
                        ) || []
                    }
                  />
                )}
              </div>

              {/* Account Number */}
              <div className="grid gap-2">
                <Label htmlFor="bankCode">Số tài khoản</Label>
                <Input
                  id="bankCode"
                  placeholder="Nhập số tài khoản ngân hàng"
                  value={bankFormData.bankCode}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, '');
                    setBankFormData((prev) => ({
                      ...prev,
                      bankCode: value
                    }));
                  }}
                  className="font-mono"
                />
              </div>

              {/* Preview */}
              {bankFormData.selectedBank && bankFormData.bankCode && (
                <div className="rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 text-sm font-medium text-gray-800">
                        Xem trước thông tin
                      </p>
                      <div className="mb-1 flex items-center gap-2">
                        <img
                          src={bankFormData.selectedBank.logo}
                          alt={bankFormData.selectedBank.shortName}
                          className="h-4 w-4 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <span className="text-sm font-medium text-purple-700">
                          {bankFormData.selectedBank.shortName}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-gray-600">
                        STK: {bankFormData.bankCode}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                  !bankFormData.selectedBank
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
        <ToastNotification />
      </div>
    </BasePages>
  );
};

export default PublisherWallet;
