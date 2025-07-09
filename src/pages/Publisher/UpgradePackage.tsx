import { useState } from 'react';
import {
  useAssignPlan,
  useGetCurrentPlan,
  useGetPlan
} from '@/queries/plan.query';
import { Plans } from '@/types';
import { toast } from 'react-toastify';
import __helpers from '@/helpers';

export default function UpgradePackage() {
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
  const { mutateAsync: assignPlan, isPending } = useAssignPlan();

  // Check user role - chỉ hiển thị cho Publisher và Advertiser
  const decodedToken = __helpers.decodeTokens(__helpers.cookie_get('AT'));
  const userRole = decodedToken?.Role;

  // Không hiển thị component nếu user là Admin
  if (userRole === 'Admin') {
    return null;
  }

  // Xác định currentPlanId: nếu API không trả về thì mặc định free (id=1)
  const currentUserPlan = currentPlanData?.result;
  const currentPlanId = currentUserPlan?.planId ?? 1;

  const handleSelectPlan = (plan: Plans): void => {
    if (plan.id === currentPlanId) return; // chặn chọn gói đang dùng
    setSelectedPlan(plan);
    setShowConfirmModal(true);
  };

  const handleConfirmUpgrade = async (): Promise<void> => {
    if (!selectedPlan) return;

    try {
      await assignPlan({ planId: selectedPlan.id });
      await refetchCurrentPlan();

      // Toast với cấu hình cụ thể để đảm bảo tự động tắt
      toast.success(`Đã nâng cấp thành công lên gói: ${selectedPlan.name}`, {
        toastId: `upgrade-success-${selectedPlan.id}`,
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: false
      });

      setShowUpgradeModal(false);
      setShowConfirmModal(false);
      setSelectedPlan(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi nâng cấp gói. Vui lòng thử lại!', {
        toastId: 'upgrade-error',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: false
      });
      console.error('Error upgrading plan:', error);
    }
  };

  const handleCancelUpgrade = (): void => {
    setShowConfirmModal(false);
    setSelectedPlan(null);
  };

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat('vi-VN').format(price);

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

  const renderPlanCard = (plan: Plans, index: number) => {
    const isCurrent = plan.id === currentPlanId;
    const isFirstPlan = index === 0;
    const isPremium = plan.name.toLowerCase().includes('premium');
    const isPopular = index === 1; // Gói giữa thường là popular

    return (
      <div
        key={plan.id}
        className={`relative flex h-full w-full max-w-sm flex-col rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
          isCurrent
            ? 'border-purple-500 shadow-xl ring-4 ring-purple-200'
            : isPopular
              ? 'border-purple-500 shadow-lg'
              : 'border-gray-200 hover:border-purple-300'
        }`}
      >
        {/* Popular Badge */}
        {isPopular && !isCurrent && (
          <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 transform">
            <div className="whitespace-nowrap rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
              PHỔ BIẾN NHẤT
            </div>
          </div>
        )}

        {/* Current Plan Badge */}
        {isCurrent && (
          <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 transform">
            <div className="whitespace-nowrap rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
              ĐANG SỬ DỤNG
            </div>
          </div>
        )}

        {/* Background Gradient */}
        <div
          className={`absolute inset-0 rounded-2xl ${
            isPremium
              ? 'bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600'
              : isPopular
                ? 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'
                : 'bg-gradient-to-br from-gray-50 to-white'
          }`}
        />

        {/* Card Content */}
        <div className="relative z-10 flex flex-1 flex-col items-center overflow-hidden rounded-2xl p-4 text-center">
          {/* Plan Image/Icon */}
          <div className="mb-2 mt-2">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                isPremium
                  ? 'bg-white/20 backdrop-blur-sm'
                  : isPopular
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100'
                    : 'bg-gray-100'
              }`}
            >
              <div
                className={`text-xl ${
                  isPremium
                    ? 'grayscale-0'
                    : isPopular
                      ? 'grayscale-0'
                      : 'grayscale'
                }`}
              >
                {isPremium ? '👑' : isPopular ? '⭐' : '📦'}
              </div>
            </div>
          </div>

          {/* Plan Name */}
          <div className="mb-2">
            <h3
              className={`text-lg font-bold ${
                isPremium
                  ? 'text-white'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
              }`}
            >
              {plan.name}
            </h3>
            <p
              className={`text-xs ${isPremium ? 'text-purple-100' : 'text-gray-500'}`}
            >
              {isPremium
                ? 'Gói cao cấp'
                : isPopular
                  ? 'Lựa chọn tốt nhất'
                  : 'Gói cơ bản'}
            </p>
          </div>

          {/* Price */}
          <div className="mb-2">
            <div className="flex items-baseline justify-center">
              <span
                className={`text-2xl font-bold ${
                  isPremium ? 'text-white' : 'text-gray-900'
                }`}
              >
                {formatPrice(plan.price)}
              </span>
              <span
                className={`ml-1 text-sm font-medium ${
                  isPremium ? 'text-purple-100' : 'text-gray-500'
                }`}
              >
                ₫
              </span>
            </div>
            <p
              className={`text-xs ${isPremium ? 'text-purple-100' : 'text-gray-500'}`}
            >
              mỗi tháng
            </p>
          </div>

          {/* Description */}
          <div className="mb-2">
            <p
              className={`line-clamp-2 text-xs leading-relaxed ${
                isPremium ? 'text-purple-100' : 'text-gray-600'
              }`}
            >
              {plan.description}
            </p>
          </div>

          {/* Features List */}
          <div className="mb-3 w-full flex-grow">
            <ul className="space-y-1">
              {getPlanFeatures(plan)
                .slice(0, 4)
                .map((feature, idx) => (
                  <li key={idx} className="flex items-center text-left">
                    <div
                      className={`mr-2 flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full ${
                        isPremium
                          ? 'bg-white/20 text-white'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      }`}
                    >
                      <div className="text-xs">✓</div>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isPremium ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Action Button */}
          <div className="w-full">
            <button
              onClick={() => handleSelectPlan(plan)}
              disabled={isCurrent || (isFirstPlan && !isCurrent)}
              className={`w-full rounded-xl px-3 py-2 text-sm font-bold transition-all duration-200 ${
                isCurrent
                  ? 'cursor-not-allowed border-2 border-green-200 bg-green-100 text-green-700'
                  : isFirstPlan && !isCurrent
                    ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                    : isPremium
                      ? 'bg-white text-purple-600 shadow-lg hover:bg-gray-50 hover:shadow-xl'
                      : isPopular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-xl'
                        : 'border-2 border-purple-500 bg-white text-purple-600 hover:bg-purple-50'
              }`}
            >
              {isCurrent
                ? 'Đang sử dụng'
                : isFirstPlan && !isCurrent
                  ? 'Chỉ xem'
                  : isPremium
                    ? 'Nâng cấp Premium'
                    : isPopular
                      ? 'Chọn gói này'
                      : 'Chọn gói'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setShowUpgradeModal(true)}
        className="group relative overflow-hidden rounded-xl border-2 border-purple-200 bg-white px-6 py-3 font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:border-purple-300 hover:shadow-xl"
      >
        <span className="relative z-10 flex items-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          <div className="mr-2 text-lg">⚡</div>
          Nâng cấp gói
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </button>

      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-indigo-900/50 backdrop-blur-sm"
            onClick={() => setShowUpgradeModal(false)}
          />
          <div className="relative max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Nâng cấp gói dịch vụ
                  </h2>
                  <p className="mt-2 text-purple-100">
                    Chọn gói dịch vụ phù hợp với nhu cầu kinh doanh của bạn
                  </p>
                </div>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
                >
                  <div className="h-6 w-6 text-xl">×</div>
                </button>
              </div>
            </div>

            {/* Body */}
            <div
              className="overflow-y-auto p-8"
              style={{ maxHeight: 'calc(95vh - 200px)' }}
            >
              {isLoadingPlans || isLoadingCurrentPlan ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
                  <p className="text-lg font-medium text-gray-600">
                    Đang tải danh sách gói...
                  </p>
                </div>
              ) : plansError ? (
                <div className="rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <div className="text-2xl">⚠️</div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-red-800">
                    Oops! Có lỗi xảy ra
                  </h3>
                  <p className="text-red-600">
                    Không thể tải danh sách gói. Vui lòng thử lại sau!
                  </p>
                </div>
              ) : (
                <div className="mx-auto grid max-w-6xl grid-cols-1 justify-items-center gap-8 px-4 pt-8 md:grid-cols-2 lg:grid-cols-3">
                  {plansData?.result?.datas?.map((plan, index) =>
                    renderPlanCard(plan, index)
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-indigo-50 px-8 py-6">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <div className="text-blue-600">💡</div>
                </div>
                <span className="font-medium">
                  Đổi gói bất kỳ lúc nào • Tính năng đầy đủ có sẵn trong{' '}
                  <span className="font-bold text-purple-600">
                    {plansData?.result?.datas?.[0]?.durationDays || 14} ngày
                  </span>{' '}
                  dùng thử miễn phí
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-pink-900/60 to-indigo-900/60 backdrop-blur-sm"
            onClick={handleCancelUpgrade}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <div className="text-2xl">⚡</div>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Xác nhận nâng cấp gói
              </h3>
              <p className="mt-2 text-purple-100">
                Bạn đang nâng cấp lên gói{' '}
                <span className="font-bold">{selectedPlan.name}</span>
              </p>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Price highlight */}
              <div className="mb-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 p-6 text-center">
                <div className="mb-2 text-sm text-gray-600">
                  Tổng chi phí hàng tháng
                </div>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(selectedPlan.price)}
                  </span>
                  <span className="ml-1 text-lg text-gray-600">₫/tháng</span>
                </div>
                <div className="mt-2 text-sm font-medium text-green-600">
                  Miễn phí {selectedPlan.durationDays} ngày đầu
                </div>
              </div>

              {/* Features preview */}
              <div className="mb-6 rounded-2xl bg-gray-50 p-6">
                <h4 className="mb-4 font-bold text-gray-900">
                  Tính năng của gói {selectedPlan.name}:
                </h4>
                <ul className="space-y-3">
                  {getPlanFeatures(selectedPlan).map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="mr-3 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                        <div className="text-xs text-white">✓</div>
                      </div>
                      <span className="font-medium text-gray-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleCancelUpgrade}
                  disabled={isPending}
                  className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-bold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmUpgrade}
                  disabled={isPending}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Đang xử lý...
                    </div>
                  ) : (
                    'Xác nhận nâng cấp'
                  )}
                </button>
              </div>

              {/* Terms */}
              <div className="mt-6 rounded-xl bg-blue-50 p-4 text-center">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Lưu ý:</span> Bạn có thể hủy
                  hoặc thay đổi gói bất kỳ lúc nào. Không có phí ràng buộc.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
