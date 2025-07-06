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
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { RefreshCw, Eye, CheckCircle, DollarSign } from 'lucide-react';
import BasePages from '@/components/shared/base-pages';
import { useGetAllTransactions } from '@/queries/transaction.query';
import { Transaction } from '@/types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const WithdrawTransactionsApproved: React.FC = () => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // API call to get approved transactions only
  const {
    data: transactionData,
    isLoading,
    error,
    refetch
  } = useGetAllTransactions(
    currentPage,
    pageSize,
    undefined, // keyword
    true, // status = true (approved)
    'Withdraw' // transactionType
  );

  // Auto refresh when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

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

  const handleViewDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
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
    <BasePages pageHead="ClickFlow - Giao dịch rút tiền đã duyệt">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Giao dịch rút tiền đã duyệt
                </h1>
                <p className="text-gray-600">
                  Danh sách các giao dịch rút tiền đã được duyệt
                </p>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <Card className="overflow-hidden border-0 bg-white shadow-lg">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Danh sách giao dịch đã duyệt
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="border-2 border-blue-300 text-blue-700 hover:border-blue-400 hover:bg-blue-50"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Làm mới
                  </Button>
                  <span className="text-sm text-gray-500">
                    Hiển thị {withdrawTransactions.length} / {totalItems} giao
                    dịch
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Mã GD</TableHead>
                    <TableHead className="font-semibold">Số tiền</TableHead>
                    <TableHead className="font-semibold">Ngày tạo</TableHead>
                    <TableHead className="font-semibold">
                      Số dư sau GD
                    </TableHead>
                    <TableHead className="font-semibold">Trạng thái</TableHead>
                    <TableHead className="font-semibold">Wallet ID</TableHead>
                    <TableHead className="min-w-[120px] font-semibold">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center">
                        <div className="flex items-center justify-center">
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Đang tải dữ liệu...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : withdrawTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center">
                        <div className="flex flex-col items-center text-gray-500">
                          <CheckCircle className="mb-2 h-12 w-12" />
                          <p>Không có giao dịch rút tiền nào đã được duyệt</p>
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
                        <TableCell className="font-mono text-sm">
                          {transaction.walletId}
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(transaction)}
                            className="flex-shrink-0 whitespace-nowrap"
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Chi tiết
                          </Button>
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
          <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b border-gray-100 pb-4">
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 p-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-gray-900">
                    Chi tiết giao dịch đã duyệt
                  </span>
                  <div className="mt-1 text-sm font-normal text-gray-500">
                    Mã: #{selectedTransaction?.id} • Đã hoàn thành
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>

            {selectedTransaction && (
              <div className="space-y-6 py-4">
                {/* Status Card - Compact */}
                <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="mb-1 text-base font-semibold text-gray-800">
                        Trạng thái giao dịch
                      </h3>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(selectedTransaction.status)}
                        <span className="text-xs font-medium text-green-600">
                          ✅ Giao dịch đã hoàn thành
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
                          Số tiền đã rút
                        </h4>
                        <p className="text-sm text-red-600">
                          Đã được xử lý thành công
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
                        <p className="text-sm text-green-600">Số dư hiện tại</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(selectedTransaction.balance)}
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Thông tin chi tiết
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="rounded-full bg-green-500 p-2">
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

                        <div className="flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4">
                          <div className="rounded-full bg-purple-500 p-2">
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
                        <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
                          <div className="rounded-full bg-orange-500 p-2">
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

                        <div className="flex items-center gap-3 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                          <div className="rounded-full bg-indigo-500 p-2">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              ID hệ thống
                            </label>
                            <p className="font-mono text-sm text-gray-600">
                              TXN-{selectedTransaction.id}-WD-APPROVED
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success Completion Banner */}
                <div className="rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-500 p-2">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">
                        Giao dịch hoàn thành
                      </h4>
                      <p className="mt-1 text-sm text-green-700">
                        Giao dịch rút tiền này đã được xử lý và hoàn thành thành
                        công. Tiền đã được chuyển đến tài khoản người dùng.
                      </p>
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
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </BasePages>
  );
};

export default WithdrawTransactionsApproved;
