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
      return await BaseRequest.Post(`/${SUB_URL}/authen`, model);
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (model: unknown) => {
      return await BaseRequest.Post(`/${SUB_URL}/`, model);
    }
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationKey: ['forgotPassword'],
    mutationFn: async (model: { email: string }) => {
      return await BaseRequest.Post(`/${SUB_URL}/forgot-password`, model);
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

{
  /* */
}
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

export const useChangePassword = () => {
  return useMutation({
    mutationKey: ['change-password'],
    mutationFn: async (model: {
      oldPassword: string;
      newPassword: string;
      confirmedNewPassword: string;
    }) => {
      return await BaseRequest.Post(`/${SUB_URL}/change-password`, model);
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

export const useRegisterPublisher = () => {
  return useMutation({
    mutationKey: ['register-publisher'],
    mutationFn: async (model: {
      userName: string;
      email: string;
      phoneNumber: string;
      password: string;
    }) => {
      return await BaseRequest.Post(`/${SUB_URL}/sign-up`, {
        userName: model.userName,
        email: model.email,
        phoneNumber: model.phoneNumber,
        password: model.password,
        confirmPassword: model.password,
        fullName: model.userName,
        role: 'Publisher',
        companyName: null,
        introductionWebsite: null,
        staffSize: null,
        industry: null
      });
    }
  });
};

export const useRegisterAdvertiser = () => {
  return useMutation({
    mutationKey: ['register-advertiser'],
    mutationFn: async (model: {
      userName: string;
      email: string;
      phoneNumber: string;
      password: string;
      companyName: string;
      introductionWebsite: string;
      staffSize: string;
      industry: string;
    }) => {
      return await BaseRequest.Post(`/${SUB_URL}/sign-up`, {
        userName: model.userName,
        email: model.email,
        phoneNumber: model.phoneNumber,
        password: model.password,
        confirmPassword: model.password,
        // Sử dụng userName làm fullName thay vì null
        fullName: model.userName,
        role: 'Advertiser',
        companyName: model.companyName,
        introductionWebsite: model.introductionWebsite,
        staffSize: model.staffSize,
        industry: model.industry
      });
    }
  });
};
