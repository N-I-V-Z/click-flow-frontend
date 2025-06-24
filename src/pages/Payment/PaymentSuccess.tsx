import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Copy,
  Download,
  ArrowLeft,
  Heart,
  Mail,
  Phone
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import BasePages from '@/components/shared/base-pages';
import { useRouter } from '@/routes/hooks';

interface TransactionData {
  transactionId: string;
  amount: number;
  currency: string;
  orderCode: string;
  description: string;
  timestamp: string;
  paymentMethod: string;
}

const PayOSSuccessPage: React.FC = () => {
  const [transactionData, setTransactionData] = useState<TransactionData>({
    transactionId:
      'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    amount: 299000,
    currency: 'VND',
    orderCode: 'ORD_' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    description: 'Thanh toán đơn hàng thành công',
    timestamp: new Date().toLocaleString('vi-VN'),
    paymentMethod: 'Thẻ ngân hàng'
  });
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    // Animation effect on load
    setIsVisible(true);

    // Simulate receiving transaction data from URL params or API
    const amount = searchParams.get('amount');
    const orderCode = searchParams.get('orderCode');

    if (amount) {
      setTransactionData((prev) => ({
        ...prev,
        amount: parseInt(amount),
        orderCode: orderCode || prev.orderCode
      }));
    }
  }, [searchParams]);

  const copyTransactionId = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(transactionData.transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadReceiptPDF = (): void => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Hóa đơn PayOS - ${transactionData.transactionId}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #ffffff;
            color: #333;
            line-height: 1.6;
            padding: 20px;
          }
          .receipt-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .header p {
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 30px;
          }
          .success-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #22c55e;
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 25px;
          }
          .transaction-info {
            background: #f9fafb;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
            border: 1px solid #e5e7eb;
          }
          .info-title {
            font-size: 18px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #6b7280;
            font-size: 14px;
          }
          .info-value {
            font-weight: 700;
            color: #111827;
            font-size: 14px;
            text-align: right;
          }
          .amount-value {
            font-size: 20px !important;
            color: #22c55e !important;
          }
          .footer {
            text-align: center;
            padding: 25px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
          }
          .footer .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 15px;
          }
          .footer .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
          }
          .footer .logo-text {
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .footer p {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 15px;
          }
          .footer .features {
            display: flex;
            justify-content: center;
            gap: 20px;
            font-size: 12px;
            color: #9ca3af;
          }
          @media print {
            body { padding: 0; }
            .receipt-container { border: none; margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <h1>payOS</h1>
            <p>Hóa đơn thanh toán điện tử</p>
          </div>
          
          <div class="content">
            <div class="success-badge">
              ✅ Giao dịch thành công
            </div>
            
            <div class="transaction-info">
              <div class="info-title">📋 Chi tiết giao dịch</div>
              <div class="info-row">
                <span class="info-label">Mã đơn hàng</span>
                <span class="info-value">${getOrderCodeFromURL()}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="logo">
              <div class="logo-icon">P</div>
              <span class="logo-text">payOS</span>
            </div>
            <p>Nền tảng thanh toán an toàn và đáng tin cậy</p>
            <div class="features">
              <span>🔒 Bảo mật SSL</span>
              <span>⚡ Xử lý nhanh</span>
              <span>🏆 Uy tín cao</span>
            </div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  const goHome = (): void => {
    router.push('/');
  };
  const [urlParams] = useSearchParams();
  const getOrderCodeFromURL = (): string => {
    return urlParams.get('orderCode') || transactionData.orderCode;
  };

  return (
    <BasePages pageHead="Thanh toán thành công">
      <div className="via-blue-50 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-indigo-100 p-6">
        <div
          className={`relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-5 shadow-xl transition-all duration-700 ${
            isVisible
              ? 'scale-100 transform opacity-100'
              : 'scale-95 transform opacity-0'
          }`}
        >
          {/* Home Button - Positioned at top left corner */}
          <button
            onClick={goHome}
            className="absolute left-3 top-3 z-20 flex transform items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-md transition-all duration-200 hover:scale-105 hover:bg-gray-50 hover:shadow-lg"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Trang chủ</span>
          </button>

          {/* Animated background elements */}
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 animate-pulse rounded-full bg-gradient-to-br from-green-200 to-emerald-300 opacity-30"></div>
          <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 animate-pulse rounded-full bg-gradient-to-tr from-blue to-indigo-300 opacity-30"></div>

          <div className="relative z-10 mt-6">
            {/* Success Animation */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg">
                  <CheckCircle className="h-8 w-8 animate-bounce text-white" />
                </div>
                <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-green-400 opacity-20"></div>
                <div className="absolute -right-1 -top-1">
                  <div className="flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-yellow">
                    <span className="text-xs">✨</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="mb-6 text-center">
              <h1 className="mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent">
                Thanh toán thành công!
              </h1>
              <p className="text-sm text-gray-600">
                Giao dịch đã được xử lý thành công
              </p>
              <div className="mt-1.5 flex items-center justify-center gap-1">
                <Heart className="text-red-500 h-3.5 w-3.5 animate-pulse" />
                <span className="text-xs text-gray-500">
                  Cảm ơn bạn đã tin tưởng payOS
                </span>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="mb-5 space-y-3 rounded-xl bg-gray-50 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                📋 Chi tiết giao dịch
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-gray-600">Mã giao dịch</span>
                  <div className="flex items-center gap-1.5">
                    <code className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-xs text-gray-800">
                      {getOrderCodeFromURL()}
                    </code>
                    <button
                      onClick={copyTransactionId}
                      className="group rounded-md p-1 transition-colors hover:bg-gray-200"
                      title="Sao chép mã giao dịch"
                    >
                      <Copy className="h-3.5 w-3.5 text-gray-500 group-hover:text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Success Notification */}
            {copied && (
              <div className="animate-fade-in fixed right-4 top-4 z-50 rounded-lg bg-green-500 px-4 py-2 text-sm text-white shadow-lg">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  Đã sao chép mã giao dịch!
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={downloadReceiptPDF}
                className="hover:to-blue-700 flex w-full transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-indigo-700 hover:shadow-xl"
              >
                <Download className="h-4 w-4" />
                Tải hóa đơn PDF
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 border-t border-gray-100 pt-4 text-center">
              <div className="mb-1.5 flex items-center justify-center gap-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-r from-indigo-500 to-purple-500">
                  <span className="text-xs font-bold text-white">P</span>
                </div>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent">
                  payOS
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Nền tảng thanh toán an toàn và đáng tin cậy
              </p>
              <div className="mt-2 flex items-center justify-center gap-3 text-xs text-gray-400">
                <span>🔒 Bảo mật SSL</span>
                <span>⚡ Xử lý nhanh</span>
                <span>🏆 Uy tín cao</span>
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button className="hover:bg-blue-100 flex items-center justify-center gap-1.5 rounded-md bg-blue px-3 py-2 text-xs font-medium text-white transition-colors">
              <Mail className="h-3.5 w-3.5" />
              clickflow.connect@gmail.com
            </button>

            <button className="flex items-center justify-center gap-1.5 rounded-md bg-green-50 px-3 py-2 text-xs font-medium text-green-700 transition-colors hover:bg-green-100">
              <Phone className="h-3.5 w-3.5" />
              0852 793 879
            </button>
          </div>
        </div>
      </div>
    </BasePages>
  );
};

export default PayOSSuccessPage;
