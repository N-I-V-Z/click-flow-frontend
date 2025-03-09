import BaseRequest from '@/config/axios.config';
import { useMutation } from '@tanstack/react-query';

const SUB_URL = `api/v1/Account`;
const BUSINESS_SUB_URL = `api/v1/Business`; // Endpoint cho đăng ký doanh nghiệp

export const useLogin = () => {
  return useMutation({
    mutationKey: ['login'],
    // mutationFn: async (model: any) => {
    mutationFn: async (model: unknown) => {
      return BaseRequest.Post(`/${SUB_URL}/login`, model);
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: ['register'],
    // mutationFn: async (model: any) => {
    mutationFn: async (model: unknown) => {
      return BaseRequest.Post(`/${SUB_URL}/register`, model);
    }
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: ['reset-password'],
    mutationFn: async (model: { email: string; newPassword: string }) => {
      return BaseRequest.Post(`/${SUB_URL}/reset-password`, model);
    }
  });
};

export const useRegisterBusiness = () => {
  return useMutation({
    mutationKey: ['register-business'],
    mutationFn: async (model: {
      companyName: string;
      website: string;
      industry: string;
      companySize: string;
      fullName: string;
      contactEmail: string;
      contactPhone: string;
    }) => {
      return BaseRequest.Post(`/${BUSINESS_SUB_URL}/register`, model);
    }
  });
};

export const useRegisterUser = () => {
  return useMutation({
    mutationKey: ['register-user'],
    mutationFn: async (model: {
      firstName: string;
      lastName: string;
      contactEmail: string;
      contactPhone: string;
    }) => {
      return BaseRequest.Post(`/${SUB_URL}/register`, model);
    }
  });
};
