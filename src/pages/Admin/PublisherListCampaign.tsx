import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/data-table';
import Loading from '@/components/ui/loading';
import { useGetPublishersInCampaign } from '@/queries/campaign.query';
import {
  ApiResponse,
  PublisherInCampaignApiResponse,
  PagingResponse
} from '@/types';
import { Mail, User, TrendingUp } from 'lucide-react';

interface PublisherListCampaignProps {
  campaignId: number;
}

const PublisherListCampaign: React.FC<PublisherListCampaignProps> = ({
  campaignId
}) => {
  const [searchParams] = useSearchParams();
  const [dataSource, setDataSource] = useState<
    PublisherInCampaignApiResponse[]
  >([]);
  const [paginationData, setPaginationData] =
    useState<PagingResponse<PublisherInCampaignApiResponse> | null>(null);

  // Lấy pagination từ URL search params (giống DataTable)
  const page = searchParams?.get('page') ?? '1';
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;

  const per_page = searchParams?.get('limit') ?? '10';
  const perPageAsNumber = Number(per_page);
  const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;

  const { data, isLoading, error, isSuccess } = useGetPublishersInCampaign(
    campaignId,
    fallbackPage, // Dùng page từ URL
    fallbackPerPage // Dùng pageSize từ URL
  );

  useEffect(() => {
    if (isSuccess && data) {
      const response = data as ApiResponse<
        PagingResponse<PublisherInCampaignApiResponse>
      >;
      const paginationResult = response.result;

      if (paginationResult) {
        setDataSource(paginationResult.datas ?? []);
        setPaginationData(paginationResult);
      }
    }
  }, [data, isSuccess]);

  // Handle search (nếu cần implement search trong tương lai)
  const handleSearchChange = (searchTerm: string) => {
    // TODO: Implement search functionality
  };

  const columns = useMemo<ColumnDef<PublisherInCampaignApiResponse>[]>(
    () => [
      {
        accessorKey: 'publisher.applicationUser.fullName',
        header: 'TÊN PUBLISHER',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="from-blue-500 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r to-purple-500 font-semibold text-white">
              {row.original.publisher?.applicationUser?.fullName
                ?.charAt(0)
                .toUpperCase() || 'P'}
            </div>
            <div>
              <p className="hover:text-blue-600 cursor-pointer font-medium text-gray-900 transition-colors">
                {row.original.publisher?.applicationUser?.fullName || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                ID: #{row.original.publisherId}
              </p>
            </div>
          </div>
        )
      },
      {
        accessorKey: 'publisher.applicationUser.email',
        header: 'EMAIL',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            {row.original.publisher?.applicationUser?.email ? (
              <a
                href={`mailto:${row.original.publisher.applicationUser.email}`}
                className="text-blue-600 hover:text-blue-800 transition-colors hover:underline"
              >
                {row.original.publisher.applicationUser.email}
              </a>
            ) : (
              <span className="text-gray-500">N/A</span>
            )}
          </div>
        )
      },
      {
        accessorKey: 'totalCampaigns',
        header: 'TỔNG CAMPAIGNS',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="font-semibold text-green-700">
              {row.original.totalCampaigns || 0}
            </span>
            <span className="text-sm text-gray-500">campaigns</span>
          </div>
        )
      },
      {
        accessorKey: 'dailyTraffic',
        header: 'TRAFFIC HÀNG NGÀY',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 flex h-8 w-8 items-center justify-center rounded-full">
              <TrendingUp className="text-blue-600 h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {(row.original.dailyTraffic || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">views/day</p>
            </div>
          </div>
        )
      },
      {
        accessorKey: 'status',
        header: 'TRẠNG THÁI',
        cell: ({ row }) => {
          const status = row.original.status;
          const isDeleted =
            row.original.publisher?.applicationUser?.isDeleted ?? false;

          const getStatusStyle = () => {
            if (isDeleted) return 'bg-red-100 text-red-800';
            if (status === 'Participated') return 'bg-green-100 text-green-800';
            if (status === 'Pending') return 'bg-yellow-100 text-yellow-800';
            return 'bg-gray-100 text-gray-800';
          };

          const getStatusText = () => {
            if (isDeleted) return 'Ngưng hoạt động';
            if (status === 'Participated') return 'Đang tham gia';
            if (status === 'Pending') return 'Chờ duyệt';
            return status;
          };

          return (
            <div className="flex items-center gap-2">
              <div
                className={`flex h-2 w-2 rounded-full ${
                  isDeleted
                    ? 'bg-red-400'
                    : status === 'Participated'
                      ? 'bg-green-400'
                      : 'bg-yellow-400'
                }`}
              ></div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle()}`}
              >
                {getStatusText()}
              </span>
            </div>
          );
        }
      }
    ],
    []
  );

  if (error) {
    return (
      <div className="bg-red-50 border-red-200 rounded-lg border p-6">
        <div className="text-red-600 text-center">
          <p className="font-medium">Không thể tải danh sách publishers</p>
          <p className="mt-1 text-sm">Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="to-blue-500 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-400">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Publishers tham gia chiến dịch
              </h3>
              <p className="text-sm text-gray-600">
                Danh sách các publishers đang tham gia chiến dịch này
              </p>
            </div>
          </div>
          {paginationData && (
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {paginationData.totalItems} publishers
              </p>
              <p className="text-xs text-gray-500">tổng cộng</p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loading />
          </div>
        ) : dataSource.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="mb-2 text-lg font-medium text-gray-900">
              Chưa có publishers tham gia
            </h4>
            <p className="text-gray-600">
              Chiến dịch này chưa có publisher nào đăng ký tham gia.
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={dataSource}
            pageCount={paginationData?.totalPages || 1}
            pageSizeOptions={[5, 10, 20]}
            heightTable="60dvh"
            onSearchChange={handleSearchChange}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default PublisherListCampaign;
