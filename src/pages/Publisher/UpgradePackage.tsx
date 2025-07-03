import {
  useAssignPlan,
  useGetCurrentPlan,
  useGetPlan
} from '@/queries/plan.query';
import { Plans } from '@/types';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UpgradePackageProps {
  currentPlan: string;
  setCurrentPlan: (plan: string) => void;
}

export default function UpgradePackage({
  currentPlan,
  setCurrentPlan
}: UpgradePackageProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<Plans | null>(null);

  // Lấy danh sách gói từ API
  const {
    data: plansData,
    isLoading: isLoadingPlans,
    error: plansError
  } = useGetPlan(true, 1, 10);

  // Lấy gói hiện tại của user
  const {
    data: currentPlanData,
    isLoading: isLoadingCurrentPlan,
    refetch: refetchCurrentPlan
  } = useGetCurrentPlan();

  // Mutation để assign plan
  const assignPlanMutation = useAssignPlan();

  // Lấy thông tin gói hiện tại từ API response
  const currentUserPlan = currentPlanData?.result?.datas?.[0];

  const handleSelectPlan = (plan: Plans): void => {
    // Không cho phép chọn gói hiện tại
    if (currentUserPlan?.id === plan.id) return;

    setSelectedPlan(plan);
    setShowConfirmModal(true);
  };

  const handleConfirmUpgrade = async (): Promise<void> => {
    if (!selectedPlan) return;

    try {
      const payload = {
        planId: selectedPlan.id
        // Thêm các field khác nếu cần thiết theo interface PlanAssign
      };

      await assignPlanMutation.mutateAsync(payload);

      // Refetch current plan để cập nhật UI
      await refetchCurrentPlan();

      toast.success(`Đã nâng cấp thành công lên gói: ${selectedPlan.name}`);
      setCurrentPlan(selectedPlan.name.toLowerCase());
      setShowUpgradeModal(false);
      setShowConfirmModal(false);
      setSelectedPlan(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi nâng cấp gói. Vui lòng thử lại!');
      console.error('Error upgrading plan:', error);
    }
  };

  const handleCancelUpgrade = (): void => {
    setShowConfirmModal(false);
    setSelectedPlan(null);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getPlanFeatures = (plan: Plans): string[] => {
    const features: string[] = [];

    if (plan.maxCampaigns > 0) {
      features.push(`Tối đa ${plan.maxCampaigns} chiến dịch`);
    } else {
      features.push('Không giới hạn chiến dịch');
    }

    if (plan.maxClicksPerMonth > 0) {
      features.push(`${plan.maxClicksPerMonth.toLocaleString()} clicks/tháng`);
    }

    if (plan.maxConversionsPerMonth > 0) {
      features.push(
        `${plan.maxConversionsPerMonth.toLocaleString()} conversions/tháng`
      );
    }

    features.push(`Thời hạn: ${plan.durationDays} ngày`);

    return features;
  };

  const renderPlanCard = (plan: Plans, isCurrentPlan: boolean) => (
    <div
      key={plan.id}
      className={`border ${
        isCurrentPlan
          ? 'border-purple-500 ring-2 ring-purple-200'
          : 'border-gray-200'
      } relative flex h-full flex-col rounded-xl p-6 ${
        plan.name.toLowerCase() === 'premium'
          ? 'bg-gradient-to-b from-purple-50 to-white'
          : ''
      }`}
    >
      {isCurrentPlan ? (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white">
            Đang sử dụng
          </span>
        </div>
      ) : plan.name.toLowerCase() === 'premium' ? (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
            Phổ biến nhất
          </span>
        </div>
      ) : null}

      <h3 className="mb-2 text-xl font-bold text-gray-800">{plan.name}</h3>
      <div className="mb-1 text-3xl font-bold text-gray-900">
        {formatPrice(plan.price)}
        <span className="text-lg font-normal text-gray-500">₫</span>
      </div>
      <p className="mb-6 text-sm text-gray-500">mỗi tháng</p>

      <div className="mb-4 text-sm text-gray-600">{plan.description}</div>

      <ul className="mb-8 flex-grow space-y-3">
        {getPlanFeatures(plan).map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => handleSelectPlan(plan)}
        disabled={isCurrentPlan}
        className={`w-full rounded-lg py-2 font-medium ${
          isCurrentPlan
            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
            : plan.name.toLowerCase() === 'premium'
              ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700'
              : 'border border-purple-500 bg-white text-purple-700 hover:bg-purple-50'
        }`}
      >
        {isCurrentPlan ? 'Chỉ xem' : `Đăng ký gói ${plan.name}`}
      </button>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setShowUpgradeModal(true)}
        className="rounded-lg bg-white px-4 py-2 font-semibold text-purple-700 transition hover:bg-purple-100"
      >
        Nâng cấp gói
      </button>

      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowUpgradeModal(false)}
          ></div>
          <div className="relative mx-4 max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Nâng cấp gói dịch vụ
                </h2>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Plan Selection Section */}
            <div className="p-6">
              <p className="mb-8 text-gray-600">
                Chọn gói dịch vụ phù hợp với nhu cầu kinh doanh của bạn
              </p>

              {isLoadingPlans || isLoadingCurrentPlan ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
                </div>
              ) : plansError ? (
                <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
                  Có lỗi xảy ra khi tải danh sách gói. Vui lòng thử lại!
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  {plansData?.result?.datas?.map((plan) => {
                    const isCurrentPlan = currentUserPlan?.id === plan.id;
                    return renderPlanCard(plan, isCurrentPlan);
                  })}
                </div>
              )}

              {/* Enterprise Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Bạn cần giải pháp dành riêng cho doanh nghiệp lớn?
                </p>
                <button className="mt-1 font-medium text-purple-600 hover:underline">
                  Liên hệ với chúng tôi về gói Enterprise
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="rounded-b-2xl border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center text-sm text-gray-500">
                <svg
                  className="mr-2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  Đổi gói bất kỳ lúc nào. Tính năng đầy đủ có sẵn trong{' '}
                  {plansData?.result?.datas?.[0]?.durationDays || 14} ngày dùng
                  thử.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCancelUpgrade}
          ></div>
          <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Xác nhận nâng cấp gói
              </h3>
              <p className="text-gray-600">
                Bạn có chắc chắn muốn nâng cấp lên gói{' '}
                <span className="font-semibold text-purple-600">
                  {selectedPlan.name}
                </span>{' '}
                với giá{' '}
                <span className="font-semibold text-purple-600">
                  {formatPrice(selectedPlan.price)}₫/tháng
                </span>
                ?
              </p>
            </div>

            <div className="mb-4 rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 font-medium text-gray-900">
                Tính năng của gói {selectedPlan.name}:
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {getPlanFeatures(selectedPlan).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelUpgrade}
                disabled={assignPlanMutation.isPending}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmUpgrade}
                disabled={assignPlanMutation.isPending}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {assignPlanMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  'Xác nhận nâng cấp'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
