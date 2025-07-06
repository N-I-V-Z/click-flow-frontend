import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { RefreshCw, Eye, CheckCircle, Clock, DollarSign } from 'lucide-react';
import BasePages from '@/components/shared/base-pages';
import {
  useGetAllTransactions,
  useUpdateTransactionStatus
} from '@/queries/transaction.query';
import { Transaction } from '@/types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { showToast } from '@/utils/toastUtils';

interface WithdrawTransactionsProps {
  status?: 'pending' | 'approved';
}

const WithdrawTransactions: React.FC<WithdrawTransactionsProps> = ({
  status: propStatus
}) => {
  const [statusFilter, setStatusFilter] = useState<string>(propStatus || 'all'); // 'all', 'pending', 'approved'
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Convert filter to API parameters
  const getStatusParam = () => {
    if (statusFilter === 'pending') return false;
    if (statusFilter === 'approved') return true;
    return undefined; // for 'all'
  };

  // API call to get all transactions with filters
  const {
    data: transactionData,
    isLoading,
    error,
    refetch
  } = useGetAllTransactions(
    currentPage,
    pageSize,
    undefined, // keyword
    getStatusParam(), // status
    'Withdraw' // transactionType
  );

  // Update transaction status mutation
  const { mutate: updateTransactionStatus, isPending: isUpdating } =
    useUpdateTransactionStatus();

  // Auto refresh when component mounts or when propStatus changes
  useEffect(() => {
    refetch();
  }, [propStatus, refetch]);

  // Get transactions directly from API (already filtered by server)
  const withdrawTransactions = transactionData?.result?.datas || [];

  // Pagination info
  const totalPages = transactionData?.result?.totalPages || 1;
  const totalItems = transactionData?.result?.totalItems || 0;
  const hasNextPage = transactionData?.result?.hasNextPage || false;
  const hasPreviousPage = transactionData?.result?.hasPreviousPage || false;

  const handleRefresh = () => {
    refetch();
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleViewDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  const handleConfirmTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmStatus = () => {
    if (!selectedTransaction) return;

    updateTransactionStatus(
      {
        id: selectedTransaction.id,
        status: true
      },
      {
        onSuccess: () => {
          showToast.success('Xác nhận giao dịch thành công!');
          setIsConfirmModalOpen(false);
          setSelectedTransaction(null);
          refetch(); // Refresh data
        },
        onError: (error: unknown) => {
          const errorMessage =
            error &&
            typeof error === 'object' &&
            'response' in error &&
            error.response &&
            typeof error.response === 'object' &&
            'data' in error.response &&
            error.response.data &&
            typeof error.response.data === 'object' &&
            'message' in error.response.data &&
            typeof error.response.data.message === 'string'
              ? error.response.data.message
              : 'Có lỗi xảy ra khi xác nhận giao dịch!';
          showToast.error(errorMessage);
        }
      }
    );
  };

  const handleCancelConfirm = () => {
    setIsConfirmModalOpen(false);
    setSelectedTransaction(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  const getStatusBadge = (status: boolean) => {
    if (status) {
      return (
        <Badge className="border-green-200 bg-green-100 text-green-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Đã duyệt
        </Badge>
      );
    } else {
      return (
        <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800">
          <Clock className="mr-1 h-3 w-3" />
          Chưa duyệt
        </Badge>
      );
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(parseInt(newPageSize));
    setCurrentPage(1);
  };

  // Get page title based on status
  const getPageTitle = () => {
    if (propStatus === 'pending') return 'Giao dịch rút tiền chưa duyệt';
    if (propStatus === 'approved') return 'Giao dịch rút tiền đã duyệt';
    return 'Quản lý giao dịch rút tiền';
  };

  const getPageDescription = () => {
    if (propStatus === 'pending')
      return 'Danh sách các giao dịch rút tiền đang chờ duyệt';
    if (propStatus === 'approved')
      return 'Danh sách các giao dịch rút tiền đã được duyệt';
    return 'Theo dõi và quản lý các yêu cầu rút tiền từ người dùng';
  };

  if (error) {
    return (
      <BasePages pageHead="ClickFlow - Lỗi">
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h3 className="mb-2 text-xl font-semibold text-red-600">
              Có lỗi xảy ra khi tải dữ liệu
            </h3>
            <Button onClick={handleRefresh} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Thử lại
            </Button>
          </div>
        </div>
      </BasePages>
    );
  }

  return (
    <BasePages pageHead={`ClickFlow - ${getPageTitle()}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-lg bg-indigo-100 p-2">
                <DollarSign className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {getPageTitle()}
                </h1>
                <p className="text-gray-600">{getPageDescription()}</p>
              </div>
            </div>
          </div>

          {/* Filters - Only show if no specific status prop */}
          {!propStatus && (
            <Card className="mb-8 border-0 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-lg">
              <div className="flex flex-col items-end gap-4 md:flex-row">
                <div>
                  <label className="mb-2 flex items-center text-sm font-semibold text-gray-700">
                    <DollarSign className="mr-1 h-4 w-4 text-blue-600" />
                    Trạng thái giao dịch
                  </label>
                  <Select
                    value={statusFilter}
                    onValueChange={handleStatusFilterChange}
                  >
                    <SelectTrigger className="w-48 border-2 border-blue-200 bg-white shadow-sm focus:border-blue-500">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-blue-200 bg-white shadow-lg">
                      <SelectItem value="all" className="hover:bg-blue-50">
                        <div className="flex items-center">
                          <div className="mr-2 h-2 w-2 rounded-full bg-gray-400"></div>
                          Tất cả giao dịch
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="pending"
                        className="hover:bg-yellow-50"
                      >
                        <div className="flex items-center">
                          <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></div>
                          Chưa duyệt
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="approved"
                        className="hover:bg-green-50"
                      >
                        <div className="flex items-center">
                          <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                          Đã duyệt
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="border-2 border-blue-300 text-blue-700 hover:border-blue-400 hover:bg-blue-50"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Làm mới
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Transactions Table */}
          <Card className="overflow-hidden border-0 bg-white shadow-lg">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Danh sách giao dịch rút tiền
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Hiển thị {withdrawTransactions.length} / {totalItems} giao
                    dịch
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[12%] font-semibold">
                      Mã GD
                    </TableHead>
                    <TableHead className="w-[18%] font-semibold">
                      Số tiền
                    </TableHead>
                    <TableHead className="w-[18%] font-semibold">
                      Ngày tạo
                    </TableHead>
                    <TableHead className="w-[18%] font-semibold">
                      Số dư sau GD
                    </TableHead>
                    <TableHead className="w-[14%] font-semibold">
                      Trạng thái
                    </TableHead>
                    <TableHead className="w-[20%] font-semibold">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center">
                        <div className="flex items-center justify-center">
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Đang tải dữ liệu...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : withdrawTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center">
                        <div className="flex flex-col items-center text-gray-500">
                          <DollarSign className="mb-2 h-12 w-12" />
                          <p>Không có giao dịch rút tiền nào</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    withdrawTransactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="font-mono text-sm">
                          #{transaction.id}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-red-600">
                            -{formatCurrency(transaction.amount)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(transaction.paymentDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatCurrency(transaction.balance)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell className="min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetail(transaction)}
                              className="flex-shrink-0 whitespace-nowrap"
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              Chi tiết
                            </Button>
                            {!transaction.status && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleConfirmTransaction(transaction)
                                }
                                className="flex-shrink-0 whitespace-nowrap bg-green-600 text-white hover:bg-green-700"
                                disabled={isUpdating}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Xác nhận
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {withdrawTransactions.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Hiển thị</span>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={handlePageSizeChange}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-700">kết quả</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={!hasPreviousPage}
                    >
                      Đầu
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPreviousPage}
                    >
                      Trước
                    </Button>

                    <span className="px-4 py-2 text-sm">
                      Trang {currentPage} / {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNextPage}
                    >
                      Sau
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={!hasNextPage}
                    >
                      Cuối
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Transaction Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader className="border-b border-gray-100 pb-6">
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 p-3">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-gray-900">
                    Chi tiết giao dịch rút tiền
                  </span>
                  <div className="mt-1 text-sm font-normal text-gray-500">
                    Mã giao dịch: #{selectedTransaction?.id}
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>

            {selectedTransaction && (
              <div className="space-y-8 py-6">
                {/* Status Card */}
                <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-800">
                        Trạng thái giao dịch
                      </h3>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(selectedTransaction.status)}
                        <span className="text-sm text-gray-600">
                          {selectedTransaction.status
                            ? 'Đã xử lý'
                            : 'Đang chờ xử lý'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        Loại giao dịch
                      </div>
                      <div className="mt-1">
                        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                          {selectedTransaction.transactionType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-pink-50 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-red-500 p-2">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          Số tiền rút
                        </h4>
                        <p className="text-sm text-red-600">
                          Số tiền được yêu cầu rút
                        </p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-red-600">
                      -{formatCurrency(selectedTransaction.amount)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-green-500 p-2">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          Số dư sau giao dịch
                        </h4>
                        <p className="text-sm text-green-600">
                          Số dư còn lại trong ví
                        </p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(selectedTransaction.balance)}
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Thông tin chi tiết
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                          <div className="rounded-full bg-blue-100 p-2">
                            <svg
                              className="h-4 w-4 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                              />
                            </svg>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Mã giao dịch
                            </label>
                            <p className="font-mono text-lg font-bold text-gray-900">
                              #{selectedTransaction.id}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                          <div className="rounded-full bg-purple-100 p-2">
                            <svg
                              className="h-4 w-4 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Wallet ID
                            </label>
                            <p className="font-mono text-lg font-bold text-purple-600">
                              {selectedTransaction.walletId}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                          <div className="rounded-full bg-orange-100 p-2">
                            <svg
                              className="h-4 w-4 text-orange-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Ngày tạo
                            </label>
                            <p className="text-lg font-bold text-gray-900">
                              {formatDate(selectedTransaction.paymentDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                          <div className="rounded-full bg-indigo-100 p-2">
                            <svg
                              className="h-4 w-4 text-indigo-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              ID hệ thống
                            </label>
                            <p className="font-mono text-sm text-gray-600">
                              TXN-{selectedTransaction.id}-WD
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="border-t border-gray-100 pt-6">
              <div className="flex w-full items-center justify-between">
                <div className="text-sm text-gray-500">
                  Thông tin được cập nhật lần cuối:{' '}
                  {new Date().toLocaleString('vi-VN')}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailModalOpen(false)}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Đóng
                  </Button>
                  {selectedTransaction && !selectedTransaction.status && (
                    <Button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        handleConfirmTransaction(selectedTransaction);
                      }}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Duyệt giao dịch
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Transaction Modal */}
        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-orange-600">
                <CheckCircle className="h-5 w-5" />
                Xác nhận giao dịch
              </DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xác nhận giao dịch này không?
              </DialogDescription>
            </DialogHeader>

            {selectedTransaction && (
              <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mã giao dịch:</span>
                  <span className="font-mono">#{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Số tiền:</span>
                  <span className="font-semibold text-red-600">
                    -{formatCurrency(selectedTransaction.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Wallet ID:</span>
                  <span className="font-mono text-sm">
                    {selectedTransaction.walletId}
                  </span>
                </div>
              </div>
            )}

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <p className="text-sm text-yellow-800">
                <strong>Lưu ý:</strong> Sau khi xác nhận, giao dịch sẽ được đánh
                dấu là hoàn thành và không thể hoàn tác.
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCancelConfirm}
                disabled={isUpdating}
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleConfirmStatus}
                disabled={isUpdating}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Xác nhận
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </BasePages>
  );
};

export default WithdrawTransactions;
