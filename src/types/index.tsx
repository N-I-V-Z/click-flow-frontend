import { Icons } from '@/components/ui/icons';

// Interface
export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  subTitle?: string;
  color?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface Campaign {
  id: number;
  name: string;
  advertiserId: number | null;
  advertiserName: string;
  description: string;
  originUrl: string;
  budget: number;
  startDate: string;
  endDate: string;
  method: string; // CPC, CPA, CPS
  status: string; // "Bị từ chối" / "Hoạt động" / "Chờ duyệt"
  category: string; // "Thực phẩm&Đồ uống", "Du lịch& Nghỉ dưỡng", ...
  commissionType: string; // "VND" hoặc "%"
  commissionValue: number | null; // Số tiền hoa hồng hoặc %
  imageUrl: string | null;
}

// Type definitions
export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type TokenDecoded = {
  Email: string;
  Id: string;
  Role: string;
  Name: string;
};

export type ApiResponse<T = unknown> = {
  statusCode: string | number;
  isSuccess: boolean;
  message?: string;
  result?: T;
  errors?: ErrorDetail[];
};

export type ErrorDetail = {
  key: string;
  value: string;
};

export type PagingResponse<T = unknown> = {
  pageIndex: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  datas: T[];
};

export type CampaignApiResponse = {
  id: number;
  name: string;
  description: string;
  originURL: string;
  budget: number;
  remainingBudget: number;
  startDate: Date;
  endDate: Date;
  typePay: string;
  typeCampaign: string;
  status: string;
  commission: number | null;
  percents: number | null;
  image: string | null;
  averageStarRate: number | null;
  advertiserId: number | null;
  Advertiser: AdvertiserApiResponse;
};

export type AdvertiserApiResponse = {
  id: number;
  companyName: string;
  introductionWebsite: string;
  staffSize: number;
  industry: string;
  applicationUser: ApplicationUserApiResponse;
};

export type ApplicationUserApiResponse = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isDeleted: boolean;
  advertiser: AdvertiserApiResponse;
};

export type PublisherApiResponse = {
  id: number;
  userId: number;
  applicationUser: ApplicationUserApiResponse;
};

export type ReportApiResponse = {
  id: number;
  reason: string;
  status: string;
  createdAt: Date;
  response: string;
  evidenceURL: string;
  publisherId: number | null;
  publisher: PublisherApiResponse | null;
  advertiserId: number | null;
  advertiser: AdvertiserApiResponse | null;
  campaignId: number | null;
  campaign: CampaignApiResponse | null;
};

export type TrafficApiResponse = {
  id: number;
  ipAddress: string;
  isValid: boolean;
  revenue: number | null;
  deviceType: string;
  orderId: string | null;
  browser: string;
  referrerURL: string;
  timestamp: Date;
  campaignParticipationId: number | null;
  campaignParticipation: CampaignParticipationApiResponse | null;
};

export type CampaignParticipationApiResponse = {
  id: number;
  status: string;
  shortLink: string;
  createdAt: Date;
  publisherId: number | null;
  publisher: PublisherApiResponse | null;
  campaignId: number;
  campaign: CampaignApiResponse;
};

export type UserDetailApiResponse = {
  id: number;
  fullName: string;
  dateOfBirth: Date;
  gender: string;
  avatarURL: string;
  address: string;
  applicationUserId: number;
};

export type LoginApiResponse = {
  token: string;
  refreshToken: string;
};

/**
 *
 */
