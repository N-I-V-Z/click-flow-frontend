import React from 'react';
import {
  XCircle,
  ArrowLeft,
  Phone,
  Mail,
  Shield,
  Zap,
  Trophy
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import BasePages from '@/components/shared/base-pages';
import { useRouter } from '@/routes/hooks';
import __helpers from '@/helpers';

const PayOSFailurePage: React.FC = () => {
  const [urlParams] = useSearchParams();
  const router = useRouter();
  const decodedToken = __helpers.decodeTokens(__helpers.cookie_get('AT'));
  const userRole = decodedToken?.Role;

  const getOrderCodeFromURL = (): string => {
    return urlParams.get('orderCode') || '';
  };

  const goBack = (): void => {
    // Redirect based on user role
    if (userRole === 'Advertiser') {
      router.push('/advertiser/dashboard');
    } else if (userRole === 'Publisher') {
      router.push('/publisher/dashboard');
    } else {
      router.push('/'); // fallback to home
    }
  };

  const getDashboardText = (): string => {
    if (userRole === 'Advertiser') {
      return 'Trang chủ';
    } else if (userRole === 'Publisher') {
      return 'Trang chủ';
    }
    return 'Trang chủ';
  };

  return (
    <BasePages pageHead="Thanh toán thất bại">
      <div className="via-orange to-yellow top-0 flex items-center justify-center bg-gradient-to-br from-red-50 p-6">
        <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white p-6 shadow-xl">
          <button
            onClick={goBack}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {getDashboardText()}
          </button>

          {/* Background decoration */}
          <div className="from-red absolute right-0 top-0 h-24 w-24 -translate-y-12 translate-x-12 rounded-full bg-gradient-to-br to-pink-100 opacity-50"></div>
          <div className="from-orange to-yellow absolute bottom-0 left-0 h-20 w-20 -translate-x-10 translate-y-10 rounded-full bg-gradient-to-tr opacity-50"></div>

          <div className="relative z-10 mt-2">
            {/* Failure Icon */}
            <div className="mb-5 flex justify-center">
              <div className="relative">
                <div
                  className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  <XCircle className="h-8 w-8 text-white" />
                </div>
                <div
                  className="absolute inset-0 h-16 w-16 animate-ping rounded-full opacity-25"
                  style={{ backgroundColor: '#ef4444' }}
                ></div>
              </div>
            </div>

            {/* Title */}
            <div className="mb-6 text-center">
              <h1 className="mb-1 text-xl font-bold text-gray-900">
                Thanh toán thất bại
              </h1>
              <p className="text-sm text-gray-600">
                Giao dịch không thể hoàn tất
              </p>
            </div>
            {/* Transaction Details */}
            <div className="mb-5 space-y-2 rounded-lg bg-gray-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mã đơn hàng</span>
                <span className="font-mono text-xs text-gray-900">
                  {getOrderCodeFromURL()}
                </span>
              </div>
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
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Bảo mật SSL
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Xử lý nhanh
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  Uy tín cao
                </span>
              </div>
            </div>
            {/* Support Section */}
            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="mb-3 text-center">
                <h3 className="mb-1 text-sm font-semibold text-gray-900">
                  Cần hỗ trợ?
                </h3>
                <p className="mb-3 text-xs text-gray-600">
                  Đội ngũ hỗ trợ sẵn sàng giúp bạn
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                className="flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-white transition-colors hover:opacity-90"
                style={{
                  backgroundColor: '#3b82f6'
                }}
              >
                <Mail className="h-3.5 w-3.5" />
                clickflow.connect@gmail.com
              </button>

              <button className="flex items-center justify-center gap-1.5 rounded-md bg-green-200 px-3 py-2 text-xs font-medium text-green-700 transition-colors hover:bg-green-100">
                <Phone className="h-3.5 w-3.5" />
                0852 793 879
              </button>
            </div>
          </div>
        </div>
      </div>
    </BasePages>
  );
};

export default PayOSFailurePage;
