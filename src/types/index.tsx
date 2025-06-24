import { Icons } from '@/components/ui/icons';
import { Wallet } from 'lucide-react';

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

export type ConversationApiResponse = {
  id: number;
  user1Id: number;
  User2Id: number;
  createdAt: Date;
  user1: ApplicationUserApiResponse;
  user2: ApplicationUserApiResponse;
  messages: MessageApiResponse[];
};

export type ConversationListApiResponse = {
  id: number;
  parnerId: number;
  parner: ApplicationUserApiResponse;
  lastMessage: MessageApiResponse;
  unreadCount: number;
};

export type MessageApiResponse = {
  id: number;
  conversationId: number;
  conversation: ConversationApiResponse;
  senderId: number;
  sender: ApplicationUserApiResponse;
  text: string;
  type: MessageType;
  fileUrl: string;
  sentAt: Date;
  isRead: boolean;
};

export enum MessageType {
  Text = 'Text',
  Image = 'Image',
  Voice = 'Voice'
}

export enum Role {
  Admin = 'Admin',
  Advertiser = 'Advertiser',
  Publisher = 'Publisher'
}

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
  advertiser: AdvertiserApiResponse;
  publisherStatus?: string;
};

export type AdvertiserApiResponse = {
  id: number;
  companyName: string;
  introductionWebsite: string;
  staffSize: number;
  industry: string;
  applicationUser: ApplicationUserApiResponse;
};

// export type ApplicationUserApiResponse = {
//   id: number;
//   fullName: string;
//   email: string;
//   role: string;
//   isDeleted: boolean;
//   advertiser: AdvertiserApiResponse;
//   userDetail: UserDetail;
// };
export type ApplicationUserApiResponse = {
  // Basic info
  id: number;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  isDeleted: boolean;

  // Security fields
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  accessFailedCount: number;

  // Relations
  userDetail: UserDetail;
  advertiser?: AdvertiserApiResponse;
  conversations: ConversationApiResponse[];
};

export type UserDetail = {
  id: number;
  dateOfBirth: Date;
  gender: string;
  avatarURL: string;
  address: string;
  applicationUserId: number;
  fullName: string;
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
  clickId: string;
  isClosed: boolean;
  ipAddress: string;
  isValid: boolean;
  deviceType: string;
  conversions: Conversion[];
  browser: string;
  referrerURL: string;
  timestamp: Date;
  campaignParticipationId: number | null;
  campaignParticipation: CampaignParticipationApiResponse | null;
};

export type Conversion = {
  id: number;
  clickId: string;
  revenue: number;
  orderId: string;
  timestamp: Date;
};

export type CampaignParticipationApiResponse = {
  id: number;
  status: string;
  shortLink: string;
  createAt: Date;
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
  user: ApplicationUserApiResponse;
};

export type LoginApiResponse = {
  token: string;
  refreshToken: string;
};
export interface IUserDetail {
  id: number;
  dateOfBirth: string;
  gender: string;
  avatarURL: string;
  address: string;
  applicationUserId: number;
}

export interface IApplicationUser {
  fullName: string;
  role: string;
  isDeleted: boolean;
  email: string;
  userDetail?: IUserDetail;
}

export interface IFeedbacker {
  id: number;
  userId: number;
  applicationUser?: IApplicationUser;
}

export interface IFeedback {
  id: number;
  description: string;
  starRate: number;
  timestamp: string; // "2025-03-24T06:06:20.2711005"
  campaignId: number;
  feedbackerId: number;
  feedbacker?: IFeedbacker;
}
export type CreateCampaignPayload = {
  name: string;
  description: string;
  originURL: string;
  budget: number;
  startDate: string;
  endDate: string; // Date object or string in ISO format
  typePay: string;
  typeCampaign: string;
  commission: number;
  percents: number;
  image: string;
};

export type IFeedbackAPIResponse = {
  statusCode: string; // "OK"
  isSuccess: boolean; // true / false
  message: string; // "Get data success"
  result: IFeedback[]; // Mảng feedback
};
export type TrafficItem = {
  id: number;
  ipAddress: string;
  isValid: boolean;
  revenue: number;
  deviceType: string;
  orderId: string;
  browser: string;
  referrerURL: string;
  timestamp: string;
};

export enum ChatTab {
  All = 'all',
  Advertiser = 'advertiser',
  Publisher = 'publisher'
}

export interface CourseResponse {
  id: number;
  title: string;
  createAt: string;
  updateAt: string;
  createById: number;
  avgRate: number;
  price: number;
  lessonLearned: string;
  content: string;
  description: string;
}

export interface Wallet {
  id: number;
  balance: number;
  userId: number;
}

export interface Transaction {
  id: number;
  amount: number;
  paymentDate: Date;
  balance: number;
  transactionType: TransactionType;
  walletId: number;
}

export enum TransactionType {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  Pay = 'Pay',
  Received = 'Received'
}

export interface CreateTransactionAPI {
  amount: number;
  transactionType: TransactionType;
}

export interface CreateCourseFormData {
  title: string;
  price: number;
  lessonLearned: string;
  description: string;
  content: string;
}

export interface BaseResponse {
  isSuccess: boolean;
  message: string;
}

export interface UploadImageResponse {
  publicId: string;
  url: string;
}

export type PublisherInCampaignApiResponse = {
  id: number;
  campaignId: number;
  publisherId: number;
  status: string; // 'Participated', 'Pending', etc.
  createdAt: string;
  totalCampaigns: number;
  dailyTraffic: number;
  publisher: {
    id: number;
    userId: number;
    applicationUser: {
      fullName: string;
      role: string;
      isDeleted: boolean;
      email: string;
    };
  };
};

export type RequestCampaignType = {
  id: number;
  name: string;
  createdAt: Date;
  endAt: Date;
  advertiser: string;
  status: string;
};

export interface ICreateTrafficPayload {
  deviceType: string;
  orderId: string;
  browser: string;
  referrerURL: string;
  timestamp: Date;
  campaignId: number;
  publisherId: number;
}

export interface ClickResponse {
  clickId: string;
  url: string;
}

export type LoginRequest = {
  userNameOrEmail: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  role: Role;
  companyName: string;
  introductionWebsite: string;
  staffSize?: number;
  industry: Industry;
};

export type RegisterPublisherRequest = {
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  role: Role;
};

export type RegisterAdvertiserRequest = {
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  role: Role;
  companyName: string;
  introductionWebsite: string;
  staffSize: string;
  industry: Industry | string;
};

export enum Industry {
  FoodAndBeverage = 'FoodAndBeverage',
  Tourism = 'Tourism',
  Education = 'Education',
  Other = 'Other'
}

export type ForgotPasswordRequest = {
  email: string;
};

export type LogoutRequest = {
  refreshToken: string;
};

export type ResetpasswordRequest = {
  email: string;
  newPassword: string;
  confirmedNewPassword: string;
  token: string;
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
  confirmedNewPassword: string;
};

export type LoginGoogleRequest = {
  idToken: string;
};

export interface Publisher {
  id: number;
  code: string;
  name: string;
  phone: string;
  userName: string;
  email: string;
  status: string;
  isBlocked: boolean;
}

// Advertiser Management Interfaces
export interface Advertiser {
  id: number;
  code: number;
  name: string;
  phone: string;
  userName: string;
  email: string;
  company: string;
  business: string;
  status: string;
  isBlocked: boolean;
}

// Modal Props Interfaces
export interface PublisherDetailModalProps {
  open: boolean;
  onClose: () => void;
  publisherId: number | null;
}

export interface AdvertiserDetailModalProps {
  open: boolean;
  onClose: () => void;
  advertiserId: number | null;
}

// Forum/Post related types - Thêm vào cuối file types/index.ts

export interface ForumUserDetail {
  id: number;
  dateOfBirth: string;
  gender: string;
  avatarURL: string;
  address: string;
  applicationUserId: number;
  fullName?: string;
  user?: ApplicationUserApiResponse;
}

export interface ForumAuthor {
  id: number;
  fullName: string;
  role: string;
  isDeleted: boolean;
  email: string;
  userDetail: ForumUserDetail;
}

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  topic: string;
  createdAt: string;
  view: number;
  feedbackNumber: number;
  author: ForumAuthor;
}

export interface ForumApiResponse {
  statusCode: string;
  isSuccess: boolean;
  message: string;
  result: ForumPost[]; // Đây phải là array, không phải single object
}

export interface CreateForumPostPayload {
  title: string;
  content: string;
  topic: string;
}
