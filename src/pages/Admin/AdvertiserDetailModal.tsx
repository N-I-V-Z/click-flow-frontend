// AdvertiserDetailModal.tsx
import React from 'react';
import { Modal, Input } from 'antd';
import { BiBuildings } from 'react-icons/bi';

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
  // Gọi API chi tiết, chỉ fetch khi advertiserId != null
  const { data, isLoading } = useGetAdvertiserDetail(advertiserId ?? undefined);

  // Tuỳ backend mà data trả về shape gì
  // Ví dụ data = { id, fullName, phone, userName, email, advertiser:{...} }
  // Ta map sang 1 biến cục bộ, hoặc dùng thẳng data
  const advertiserDetail = data?.result; // tuỳ backend

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Thông tin chi tiết"
    >
      {isLoading ? (
        <div>Đang tải...</div>
      ) : !advertiserDetail ? (
        <div>Không có dữ liệu</div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-2xl text-gray-600">
              <BiBuildings />
            </div>
            <div>
              <h3 className="text-lg font-semibold ">
                {advertiserDetail.fullName}
              </h3>
              <p className="text-sm text-gray-500">Nhà quảng cáo</p>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-600">
              Số điện thoại
            </label>
            <Input readOnly value={advertiserDetail.phone} />
          </div>
          <div>
            <label className="block font-semibold text-gray-600">
              Tên người dùng
            </label>
            <Input readOnly value={advertiserDetail.userName} />
          </div>
          <div>
            <label className="block font-semibold text-gray-600">Email</label>
            <Input readOnly value={advertiserDetail.email} />
          </div>
          <div>
            <label className="block font-semibold text-gray-600">
              Tên công ty
            </label>
            <Input
              readOnly
              value={advertiserDetail.advertiser?.companyName ?? ''}
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-600">
              Lĩnh vực kinh doanh
            </label>
            <Input
              readOnly
              value={advertiserDetail.advertiser?.businessArea ?? ''}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
