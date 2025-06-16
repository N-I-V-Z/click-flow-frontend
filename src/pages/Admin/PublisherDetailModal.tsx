import React from 'react';
import { Modal, Input, Avatar, Spin, Tag } from 'antd';
import {
  BiUser,
  BiPhone,
  BiEnvelope,
  BiCalendar,
  BiMapPin,
  BiCheckCircle,
  BiXCircle
} from 'react-icons/bi';
import { FiUser } from 'react-icons/fi';
import { useGetUserDetail } from '@/queries/user.query';

interface PublisherDetailModalProps {
  open: boolean;
  onClose: () => void;
  publisherId: number | null;
}

export const PublisherDetailModal: React.FC<PublisherDetailModalProps> = ({
  open,
  onClose,
  publisherId
}) => {
  console.log('🖼️ PublisherDetailModal props:', { open, publisherId });

  // Hook sẽ không chạy khi publisherId là null
  const { data, isLoading, error } = useGetUserDetail(publisherId || undefined);

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
      title={null}
      width={900}
      className="publisher-detail-modal"
      styles={{
        body: { padding: 0 }
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spin size="large" />
          <span className="ml-3 text-lg text-gray-600">
            Đang tải thông tin...
          </span>
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <BiXCircle className="text-red-400 mx-auto mb-4 text-6xl" />
          <div className="text-red-500 mb-2 text-xl font-semibold">
            Có lỗi xảy ra
          </div>
          <div className="text-sm text-gray-500">
            {error.message || 'Không thể tải dữ liệu'}
          </div>
        </div>
      ) : !userDetailResponse || !userInfo ? (
        <div className="py-8 text-center">
          <BiUser className="mx-auto mb-4 text-6xl text-gray-400" />
          <div className="text-xl text-gray-500">Không có dữ liệu</div>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="p-6">
            {/* Header compact với avatar và thông tin cơ bản */}
            <div className="mb-6 flex items-center gap-4 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4">
              <Avatar
                size={80}
                src={userDetailResponse.avatarURL}
                icon={<BiUser />}
                className="border-3 border-white shadow-md"
                style={{ backgroundColor: '#10b981' }}
              />
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold text-gray-800">
                  {userInfo.fullName || 'Chưa cập nhật'}
                </h3>
                <div className="mb-2 flex items-center gap-2">
                  <Tag color="blue" className="text-xs">
                    ID: #{userInfo.id}
                  </Tag>
                  <Tag color="green" className="text-xs">
                    {userInfo.role}
                  </Tag>
                  <Tag
                    color={userInfo.isDeleted ? 'red' : 'green'}
                    icon={
                      userInfo.isDeleted ? <BiXCircle /> : <BiCheckCircle />
                    }
                    className="flex items-center gap-1 text-xs"
                  >
                    {userInfo.isDeleted ? 'Bị khóa' : 'Hoạt động'}
                  </Tag>
                </div>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <BiUser className="text-emerald-600" />
                  Giới tính: {getGenderLabel(userDetailResponse.gender)}
                </span>
              </div>
            </div>

            {/* Main content trong 2 cột */}
            <div className="grid grid-cols-2 gap-6">
              {/* Cột trái - Thông tin liên hệ */}
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <BiEnvelope className="text-emerald-600" />
                  Thông tin liên hệ
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <BiPhone className="text-emerald-600" />
                      Số điện thoại
                    </label>
                    <Input
                      readOnly
                      value={userInfo.phoneNumber || 'Chưa cập nhật'}
                      className="rounded-lg border-gray-200 bg-gray-50"
                      size="middle"
                    />
                  </div>

                  <div>
                    <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FiUser className="text-emerald-600" />
                      Tên người dùng
                    </label>
                    <Input
                      readOnly
                      value={userInfo.userName || 'Chưa cập nhật'}
                      className="rounded-lg border-gray-200 bg-gray-50"
                      size="middle"
                    />
                  </div>

                  <div>
                    <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <BiEnvelope className="text-emerald-600" />
                      Email
                    </label>
                    <Input
                      readOnly
                      value={userInfo.email || 'Chưa cập nhật'}
                      className="rounded-lg border-gray-200 bg-gray-50"
                      size="middle"
                    />
                  </div>
                </div>
              </div>

              {/* Cột phải - Thông tin cá nhân */}
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <BiUser className="text-emerald-600" />
                  Thông tin cá nhân
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <BiCalendar className="text-emerald-600" />
                      Ngày sinh
                    </label>
                    <Input
                      readOnly
                      value={formatDate(userDetailResponse.dateOfBirth)}
                      className="rounded-lg border-gray-200 bg-gray-50"
                      size="middle"
                    />
                  </div>

                  <div>
                    <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <BiMapPin className="text-emerald-600" />
                      Địa chỉ
                    </label>
                    <Input.TextArea
                      readOnly
                      value={userDetailResponse.address || 'Chưa cập nhật'}
                      className="rounded-lg border-gray-200 bg-gray-50"
                      rows={2}
                      size="middle"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
