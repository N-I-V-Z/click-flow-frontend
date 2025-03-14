import BaseRequest from '@/config/axios.config';
import { useMutation } from '@tanstack/react-query';
import helpers from '@/helpers';
const SUB_URL = `api/Accounts`;
export const useLogin = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (model: {
      userNameOrEmail: string;
      password: string;
    }) => {
      console.log(model);
      return await BaseRequest.Post(`/${SUB_URL}/authen`, model);
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (model: unknown) => {
      return await BaseRequest.Post(`/${SUB_URL}/sign-up`, model);
    }
  });
};

export const useLogout = () => {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async (model: { refreshToken: string | undefined }) => {
      return await BaseRequest.Post(`/${SUB_URL}/sign-out`, model);
    }
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: ['reset-password'],
    mutationFn: async (model: {
      email: string;
      newPassword: string;
      confirmedNewPassword: string;
    }) => {
      return await BaseRequest.Post(`/${SUB_URL}/reset-password`, model);
    }
  });
};

export const useRegisterAdvertiser = () => {
  return useMutation({
    mutationKey: ['register-advetiser'],
    mutationFn: async (model: {
      companyName: string;
      introductionWebsite: string;
      industry: string;
      staffSize: number;
      fullName: string;
      email: string;
      phoneNumber: string;
    }) => {
      return await BaseRequest.Post(`/${SUB_URL}/register`, model);
    }
  });
};

export const useRegisterPublisher = () => {
  return useMutation({
    mutationKey: ['register-publisher'],
    mutationFn: async (model: {
      fullName: string;
      email: string;
      phoneNumber: 'user@example.com';
    }) => {
      return await BaseRequest.Post(`/${SUB_URL}/register`, model);
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
      return await BaseRequest.Post(`/${SUB_URL}/register`, model);
    }
  });
};

export const useRenewToken = () => {
  return useMutation({
    mutationKey: ['renewToken'],
    mutationFn: async () => {
      const refreshToken = helpers.cookie_get('RT');
      if (!refreshToken) throw new Error('No refresh token found');
      return await BaseRequest.Post('/api/Accounts/renew-token', {
        refreshToken
      });
    }
  });
};
