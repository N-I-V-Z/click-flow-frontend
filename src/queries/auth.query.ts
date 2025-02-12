import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery } from '@tanstack/react-query';

const SUB_URL = `api/v1/Account`;

export const useLogin = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (model: any) => {
      return BaseRequest.Post(`/${SUB_URL}/login`, model);
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (model: any) => {
      return BaseRequest.Post(`/${SUB_URL}/register`, model);
    }
  });
};
