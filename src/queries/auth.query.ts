import BaseRequest from '@/config/axios.config';
import {
  BaseResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginApiResponse,
  LogoutRequest,
  RegisterRequest,
  ResetpasswordRequest,
  RegisterPublisherRequest,
  ApplicationUserApiResponse,
  RegisterAdvertiserRequest,
  LoginRequest
} from '@/types';
import { useMutation } from '@tanstack/react-query';

const SUB_URL = `/api/Accounts`;
export const useLogin = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (model: LoginRequest) => {
      return await BaseRequest.Post<LoginApiResponse>(
        `${SUB_URL}/authen`,
        model
      );
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (model: RegisterRequest) => {
      return await BaseRequest.Post<ApplicationUserApiResponse>(
        `${SUB_URL}/`,
        model
      );
    }
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationKey: ['forgotPassword'],
    mutationFn: async (model: ForgotPasswordRequest) => {
      return await BaseRequest.Post<BaseResponse>(
        `${SUB_URL}/forgot-password`,
        model
      );
    }
  });
};
export const useLogout = () => {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async (model: LogoutRequest) => {
      return await BaseRequest.Post<BaseResponse>(`${SUB_URL}/sign-out`, model);
    }
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: ['reset-password'],
    mutationFn: async (model: ResetpasswordRequest) => {
      return await BaseRequest.Post(`${SUB_URL}/reset-password`, model);
    }
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationKey: ['change-password'],
    mutationFn: async (model: ChangePasswordRequest) => {
      return await BaseRequest.Post<BaseResponse>(
        `${SUB_URL}/change-password`,
        model
      );
    }
  });
};

export const useRegisterPublisher = () => {
  return useMutation({
    mutationKey: ['register-publisher'],
    mutationFn: async (model: RegisterPublisherRequest) => {
      return await BaseRequest.Post<ApplicationUserApiResponse>(
        `${SUB_URL}/sign-up`,
        model
      );
    }
  });
};

export const useRegisterAdvertiser = () => {
  return useMutation({
    mutationKey: ['register-advertiser'],
    mutationFn: async (model: RegisterAdvertiserRequest) => {
      return await BaseRequest.Post<ApplicationUserApiResponse>(
        `${SUB_URL}/sign-up`,
        model
      );
    }
  });
};
