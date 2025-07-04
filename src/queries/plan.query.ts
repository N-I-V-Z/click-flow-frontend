import BaseRequest from '@/config/axios.config';
import {
  PagingResponse,
  PlanAssign,
  PlanRequest,
  Plans,
  UserPlan
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

const SUB_URL = `api/Plans`;
const SUB_URL_UPGRADE_PLAN = 'api/UserPlans';

/**
 * Hook gọi API lấy danh sách Campaigns theo status
 */
export const useGetPlan = (
  isActive: boolean,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-plan', isActive, pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get<PagingResponse<Plans>>(
        `${SUB_URL}?IsActive=${isActive}&PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useCreatePlan = () => {
  return useMutation({
    mutationKey: ['create-plan'],
    mutationFn: async (model: PlanRequest) => {
      return await BaseRequest.Post<Plans>(`/${SUB_URL}`, model);
    }
  });
};

export const useUpdatePlan = () => {
  return useMutation({
    mutationFn: async (payload: Plans) => {
      return await BaseRequest.Put<Plans>(`${SUB_URL}/${payload.id}`, payload);
    }
  });
};

export const useDeletePlan = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      return await BaseRequest.Delete<boolean>(`${SUB_URL}/${id}`);
    }
  });
};

export const useAssignPlan = () => {
  return useMutation({
    mutationKey: ['assign-plan'],
    mutationFn: async (payload: PlanAssign) => {
      return await BaseRequest.Post<UserPlan>(
        `/${SUB_URL_UPGRADE_PLAN}/assign`,
        payload
      );
    }
  });
};

export const useGetCurrentPlan = () => {
  return useQuery({
    queryKey: ['get-current-plan'],
    queryFn: async () => {
      return await BaseRequest.Get<UserPlan>(`${SUB_URL_UPGRADE_PLAN}/current`);
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useGetPlanById = (id: number) => {
  return useQuery({
    queryKey: ['get-plan-by-id', id],
    queryFn: async () => {
      return await BaseRequest.Get<Plans>(`${SUB_URL}/${id}`);
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};
