import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Modal } from 'antd';
import { Eye, Check, X } from 'lucide-react';
import DataTable from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  useGetPublisherParticipationByStatusForAdvertiser,
  useUpdateParticipationStatus
} from '@/queries/campaign.query';
import Loading from '@/components/ui/loading';
import { CampaignParticipationApiResponse } from '@/types';

function formatDate(dateString?: string | Date): string {
  if (!dateString) return '';

  // Handle both string and Date types
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) return '';

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const AttractivePublisherParticipationRequest: React.FC = () => {
  const [pageCount, setPageCount] = useState(0);
  const { data, isLoading, error, refetch } =
    useGetPublisherParticipationByStatusForAdvertiser(1, 10, 'Pending');
  const { mutate: updateParticipationStatus } = useUpdateParticipationStatus();
  const [localParticipations, setLocalParticipations] = useState<
    CampaignParticipationApiResponse[] | undefined
  >([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<
    CampaignParticipationApiResponse['campaign'] | null
  >(null);

  useEffect(() => {
    if (data) {
      setLocalParticipations(data.result?.datas);
      setPageCount(data?.result?.totalPages ?? 0);
    }
  }, [data]);

  const handleAccept = useCallback(
    (item: CampaignParticipationApiResponse) => {
      updateParticipationStatus(
        {
          publisherId: item.publisherId || 0,
          campaignParticipationId: item.id,
          newStatus: 'Participated'
        },
        {
          onSuccess: () => {
            toast.success('Đã duyệt yêu cầu tham gia thành công!');
            refetch();
          },
          onError: () => {
            toast.error('Có lỗi xảy ra khi duyệt yêu cầu!');
          }
        }
      );
    },
    [updateParticipationStatus, refetch]
  );

  const handleReject = useCallback(
    (item: CampaignParticipationApiResponse) => {
      updateParticipationStatus(
        {
          publisherId: item.publisherId || 0,
          campaignParticipationId: item.id,
          newStatus: 'Rejected'
        },
        {
          onSuccess: () => {
            toast.success('Đã từ chối yêu cầu thành công!');
            refetch();
          },
          onError: () => {
            toast.error('Có lỗi xảy ra khi từ chối yêu cầu!');
          }
        }
      );
    },
    [updateParticipationStatus, refetch]
  );

  const openModal = useCallback(
    (campaign: CampaignParticipationApiResponse['campaign']) => {
      setSelectedCampaign(campaign);
      setIsModalVisible(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setSelectedCampaign(null);
    setIsModalVisible(false);
  }, []);

  const columns = useMemo<ColumnDef<CampaignParticipationApiResponse>[]>(
    () => [
      {
        header: 'STT',
        cell: ({ row }) => row.index + 1
      },
      {
        accessorKey: 'publisher.applicationUser.fullName',
        header: 'Publisher',
        cell: ({ row }) => {
          // Safe access with fallback
          return row.original?.publisher?.applicationUser?.fullName || '-';
        }
      },
      {
        accessorKey: 'campaign.name',
        header: 'Chiến dịch',
        cell: ({ row }) => {
          return row.original?.campaign?.name || '-';
        }
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
          return row.original?.status || '-';
        }
      },
      {
        accessorKey: 'createdAt',
        header: 'Ngày tạo',
        cell: ({ row }) => {
          return formatDate(row.original?.createdAt);
        }
      },
      {
        id: 'actions',
        header: 'Hành động',
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex gap-3">
              <Eye
                onClick={() => item?.campaign && openModal(item.campaign)}
                className="cursor-pointer text-blue hover:text-blue"
                size={20}
              />
              <Check
                onClick={() => handleAccept(item)}
                className="hover:text-green cursor-pointer text-green-500"
                size={20}
              />
              <X
                onClick={() => handleReject(item)}
                className="cursor-pointer text-red hover:text-red"
                size={20}
              />
            </div>
          );
        }
      }
    ],
    [handleAccept, handleReject, openModal]
  );

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="text-red-600 flex h-screen items-center justify-center">
        Đã có lỗi xảy ra khi tải dữ liệu!
      </div>
    );

  return (
    <div className="mb-10 min-h-screen bg-gray-50 p-6">
      <h2 className="mb-6 text-center text-3xl font-bold text-indigo-700">
        Yêu cầu tham gia từ Publisher
      </h2>

      <DataTable
        columns={columns}
        data={localParticipations || []}
        pageCount={pageCount}
        pageSizeOptions={[10, 20, 30, 40, 50]}
        showAdd={false}
      />

      <Modal
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        centered
        width={1000}
        className="!p-0"
      >
        {selectedCampaign && (
          <div className="flex flex-col md:flex-row">
            {/* Left Side: Ảnh chiến dịch */}
            <div className="relative mt-10 h-[400px] w-full overflow-hidden sm:w-1/2">
              {selectedCampaign.image ? (
                <img
                  src={selectedCampaign.image}
                  alt={selectedCampaign.name || 'Campaign'}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-l-lg bg-gray-300">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black via-transparent to-transparent opacity-70 md:rounded-l-md md:rounded-tr-none"></div>
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-bold text-white">
                  {selectedCampaign.name || 'Untitled Campaign'}
                </h2>
              </div>
            </div>

            <div className="bg-white p-6 md:w-1/2 md:p-8">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">
                Thông tin chiến dịch
              </h3>
              <p className="mb-4 italic text-gray-600">
                {selectedCampaign.description || 'Không có mô tả.'}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm uppercase text-gray-500">URL gốc</p>
                  <p className="font-medium text-gray-800">
                    {selectedCampaign.originURL || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-500">Ngân sách</p>
                  <p className="font-medium text-gray-800">
                    {selectedCampaign.budget ?? '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-500">
                    Ngân sách còn lại
                  </p>
                  <p className="font-medium text-gray-800">
                    {selectedCampaign.remainingBudget ?? '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-500">
                    Loại thanh toán
                  </p>
                  <p className="font-medium text-gray-800">
                    {selectedCampaign.typePay || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-500">
                    Loại chiến dịch
                  </p>
                  <p className="font-medium text-gray-800">
                    {selectedCampaign.typeCampaign || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-500">Trạng thái</p>
                  <p className="font-medium text-gray-800">
                    {selectedCampaign.status || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-500">Hoa hồng</p>
                  <p className="font-medium text-gray-800">
                    {selectedCampaign.commission ?? '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-500">Phần trăm</p>
                  <p className="font-medium text-gray-800">
                    {selectedCampaign.percents
                      ? `${selectedCampaign.percents}%`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-500">Đánh giá</p>
                  <p className="font-medium text-gray-800">
                    {selectedCampaign.averageStarRate ?? '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-500">
                    Ngày bắt đầu
                  </p>
                  <p className="font-medium text-gray-800">
                    {formatDate(selectedCampaign.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-500">
                    Ngày kết thúc
                  </p>
                  <p className="font-medium text-gray-800">
                    {formatDate(selectedCampaign.endDate)}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 text-white transition hover:opacity-90 focus:outline-none"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default AttractivePublisherParticipationRequest;
