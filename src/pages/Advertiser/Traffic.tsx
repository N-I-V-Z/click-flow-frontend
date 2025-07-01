import { useState, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/data-table';
import { useGetTraffics } from '@/queries/traffic.query';
import { useGetCampaignAdvertiser } from '@/queries/campaign.query';
import helpers from '@/helpers';
import BasePages from '@/components/shared/base-pages';
import Loading from '@/components/ui/loading';
import { TrafficItem, TrafficApiResponse, TokenDecoded } from '@/types';
import __helpers from '@/helpers';
import { useSearchParams } from 'react-router-dom';

// Mapping function to convert API response to UI model
function mapTrafficApiToTrafficItem(apiItem: TrafficApiResponse): TrafficItem {
  return {
    id: apiItem.id,
    ipAddress: apiItem.ipAddress,
    isValid: apiItem.isValid,
    revenue: 0, // TrafficApiResponse doesn't have revenue, set default
    deviceType: apiItem.deviceType,
    orderId: apiItem.clickId, // Map clickId to orderId
    browser: apiItem.browser,
    referrerURL: apiItem.referrerURL,
    timestamp: new Date(apiItem.timestamp).toISOString()
  };
}

export default function Traffic() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null
  );

  // Get pagination params from URL
  const page = searchParams?.get('page') ?? '1';
  const pageAsNumber = Number(page);
  const currentPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;

  const limit = searchParams?.get('limit') ?? '10';
  const limitAsNumber = Number(limit);
  const pageSize = isNaN(limitAsNumber) ? 10 : limitAsNumber;

  const decodedToken: TokenDecoded | null = helpers.decodeTokens(
    __helpers.cookie_get('AT')
  );
  const advertiserId =
    decodedToken?.Id !== undefined ? parseInt(decodedToken.Id) : 0;

  const {
    data: campaignsData,
    isLoading: campaignsLoading,
    isError: campaignsError
  } = useGetCampaignAdvertiser(advertiserId, undefined, 1, 100); // Get all campaigns

  // Fetch traffic data for selected campaign with current pagination
  const {
    data: trafficData,
    isLoading: trafficLoading,
    isError: trafficError
  } = useGetTraffics(
    selectedCampaignId || undefined,
    currentPage, // Use currentPage directly (1-based)
    pageSize
  );

  const campaigns = campaignsData?.result?.datas || [];

  const filteredData = useMemo(() => {
    if (!selectedCampaignId || !trafficData?.result?.datas) {
      return [];
    }

    const traffics = trafficData.result.datas;
    // Map from TrafficApiResponse to TrafficItem
    const mappedTraffics = traffics.map((item: TrafficApiResponse) =>
      mapTrafficApiToTrafficItem(item)
    );

    // If search is handled on frontend (optional - you might want to move this to backend)
    return mappedTraffics.filter((item: TrafficItem) => {
      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();
      const ipMatch = item.ipAddress?.toLowerCase().includes(term);
      const refMatch = item.referrerURL?.toLowerCase().includes(term);
      return ipMatch || refMatch;
    });
  }, [trafficData, searchTerm, selectedCampaignId]);

  const columns: ColumnDef<TrafficItem>[] = [
    {
      id: 'stt',
      header: 'ID',
      cell: ({ row }) => row.original.id
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP Address'
    },
    {
      accessorKey: 'referrerURL',
      header: 'Referrer',
      cell: ({ row }) => {
        const ref = row.original.referrerURL;
        return (
          <a
            href={ref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline transition-colors"
          >
            {ref}
          </a>
        );
      }
    },
    {
      accessorKey: 'isValid',
      header: 'Valid',
      cell: ({ row }) => (
        <span
          className={`rounded px-2 py-1 text-xs font-semibold ${
            row.original.isValid
              ? 'bg-green-100 text-green-800'
              : 'bg-[#fee2e2] text-[#991b1b]'
          }`}
        >
          {row.original.isValid ? 'Valid' : 'Invalid'}
        </span>
      )
    },
    {
      accessorKey: 'deviceType',
      header: 'Device Type'
    },
    {
      accessorKey: 'orderId',
      header: 'Order ID'
    },
    {
      accessorKey: 'browser',
      header: 'Browser'
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) =>
        new Date(row.original.timestamp).toLocaleString('vi-VN')
    }
  ];

  // Handle campaign selection
  const handleCampaignChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const campaignId = event.target.value ? parseInt(event.target.value) : null;
    setSelectedCampaignId(campaignId);
    // Reset search term when changing campaign
    setSearchTerm('');
  };

  const isLoading = campaignsLoading || trafficLoading;
  const isError = campaignsError || trafficError;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-600 text-xl font-semibold">
          Lỗi khi tải dữ liệu.
        </div>
      </div>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Truy cập">
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="rounded-lg bg-white p-6">
            <div className="mb-6 flex flex-col pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="mb-4 text-3xl font-bold text-gray-800 sm:mb-0">
                Danh sách Traffic
              </h2>
              <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row">
                {/* Campaign Dropdown */}
                <div className="flex flex-col">
                  <label
                    htmlFor="campaign-select"
                    className="mb-1 text-sm font-medium text-gray-700"
                  >
                    Chọn Campaign
                  </label>
                  <select
                    id="campaign-select"
                    value={selectedCampaignId || ''}
                    onChange={handleCampaignChange}
                    className="focus:border-blue-500 focus:ring-blue-500 min-w-[150px] rounded border border-gray-300 p-2 focus:ring-1"
                  >
                    <option value="">-- Chọn Campaign --</option>
                    {campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Show message when no campaign is selected */}
            {!selectedCampaignId ? (
              <div className="py-8 text-center">
                <p className="text-lg text-gray-500">
                  Vui lòng chọn một campaign để xem danh sách traffic
                </p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredData}
                pageCount={trafficData?.result?.totalPages || 1}
                isLoading={trafficLoading}
              />
            )}
          </div>
        </div>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </BasePages>
  );
}
