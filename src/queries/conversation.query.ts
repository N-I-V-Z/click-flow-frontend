import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery } from '@tanstack/react-query';
import helpers from '@/helpers';
import {
  ConversationApiResponse,
  ConversationListApiResponse,
  PagingResponse
} from '@/types';

const SUB_URL = `api/Conversations`;

export const useCreateConversation = () => {
  return useMutation({
    mutationKey: ['crete-conversation'],
    mutationFn: async (model: { targetUserId: number }) => {
      return await BaseRequest.Post<ConversationApiResponse>(
        `/${SUB_URL}`,
        model
      );
    }
  });
};

export const useGetOwnConversations = () => {
  return useQuery({
    queryKey: ['get-own-conversation'],
    queryFn: async () => {
      return await BaseRequest.Get<ConversationListApiResponse[]>(
        `/${SUB_URL}/own`
      );
    }
  });
};
