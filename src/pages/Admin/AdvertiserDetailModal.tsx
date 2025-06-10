import React from 'react';
import { Modal, Input, Avatar, Spin } from 'antd';
import {
  BiBuildings,
  BiUser,
  BiPhone,
  BiEnvelope,
  BiCalendar,
  BiMapPin
} from 'react-icons/bi';
import { FiMail, FiUser, FiBriefcase } from 'react-icons/fi';
import { useGetUserDetail } from '@/queries/user.query';

interface AdvertiserDetailModalProps {
  open: boolean;
  onClose: () => void;
  advertiserId: number | null;
}

export const AdvertiserDetailModal: React.FC<AdvertiserDetailModalProps> = ({
  open,
  onClose,
  advertiserId
}) => {
  // Hook sẽ không chạy khi advertiserId là null
  const { data, isLoading, error } = useGetUserDetail(
    advertiserId || undefined
  );
  const userDetailResponse = data?.result; // Đây là UserDetailApiResponse
  const userInfo = userDetailResponse?.user; // Đây là ApplicationUserApiResponse

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getGenderLabel = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case 'male':
      case 'nam':
        return 'Nam';
      case 'female':
      case 'nữ':
        return 'Nữ';
      default:
        return 'Chưa cập nhật';
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <div className="flex items-center gap-2">
          <BiBuildings className="text-blue-600 text-xl" />
          <span className="font-semibold text-gray-800">
            Thông tin chi tiết nhà quảng cáo
          </span>
        </div>
      }
      width={700}
      className="advertiser-detail-modal"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spin size="large" />
          <span className="ml-2">Đang tải thông tin...</span>
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <div className="text-red-500 mb-2 text-lg">Có lỗi xảy ra</div>
          <div className="text-sm text-gray-500">
            {error.message || 'Không thể tải dữ liệu'}
          </div>
        </div>
      ) : !userDetailResponse || !userInfo ? (
        <div className="py-8 text-center">
          <div className="text-lg text-gray-500">Không có dữ liệu</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Avatar và thông tin cơ bản */}
          <div className="from-blue-50 border-blue-100 flex items-center gap-4 rounded-lg border bg-gradient-to-r to-indigo-50 p-4">
            <Avatar
              size={80}
              src={userDetailResponse.avatarURL}
              icon={<BiUser />}
              className="border-blue-200 border-2"
            />
            <div className="flex-1">
              <h3 className="mb-1 text-xl font-bold text-gray-800">
                {userInfo.fullName || 'Chưa cập nhật'}
              </h3>
              <p className="mb-2 text-sm text-gray-600">
                ID: #{userInfo.id} • Role: {userInfo.role}
              </p>
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    userInfo.isDeleted
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {userInfo.isDeleted ? 'Bị khóa' : 'Hoạt động'}
                </span>
                <span className="text-xs text-gray-500">
                  Giới tính: {getGenderLabel(userDetailResponse.gender)}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                <BiPhone className="text-blue-600" />
                Số điện thoại
              </label>
              <Input
                readOnly
                value={userInfo.phoneNumber || 'Chưa cập nhật'}
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                <FiUser className="text-blue-600" />
                Tên người dùng
              </label>
              <Input
                readOnly
                value={userInfo.userName || 'Chưa cập nhật'}
                className="bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
              <BiEnvelope className="text-blue-600" />
              Email
            </label>
            <Input
              readOnly
              value={userInfo.email || 'Chưa cập nhật'}
              className="bg-gray-50"
            />
          </div>

          {/* Thông tin cá nhân */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                <BiCalendar className="text-blue-600" />
                Ngày sinh
              </label>
              <Input
                readOnly
                value={formatDate(userDetailResponse.dateOfBirth)}
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                <BiMapPin className="text-blue-600" />
                Địa chỉ
              </label>
              <Input
                readOnly
                value={userDetailResponse.address || 'Chưa cập nhật'}
                className="bg-gray-50"
              />
            </div>
          </div>

          {/* Thông tin công ty */}
          {userInfo.advertiser && (
            <div className="border-t pt-4">
              <h4 className="mb-4 flex items-center gap-2 font-semibold text-gray-800">
                <FiBriefcase className="text-blue-600" />
                Thông tin công ty
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                      <BiBuildings className="text-blue-600" />
                      Tên công ty
                    </label>
                    <Input
                      readOnly
                      value={userInfo.advertiser.companyName || 'Chưa cập nhật'}
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                      <FiBriefcase className="text-blue-600" />
                      Ngành nghề
                    </label>
                    <Input
                      readOnly
                      value={userInfo.advertiser.industry || 'Chưa cập nhật'}
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                      <BiUser className="text-blue-600" />
                      Quy mô nhân sự
                    </label>
                    <Input
                      readOnly
                      value={
                        userInfo.advertiser.staffSize
                          ? `${userInfo.advertiser.staffSize} nhân viên`
                          : 'Chưa cập nhật'
                      }
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                      <FiMail className="text-blue-600" />
                      Website giới thiệu
                    </label>
                    <Input
                      readOnly
                      value={
                        userInfo.advertiser.introductionWebsite ||
                        'Chưa cập nhật'
                      }
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
