import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MessageApiResponse, MessageType } from '@/types';

const SUB_URL = `api/Messages`;

export const useSendMessage = () => {
  return useMutation({
    mutationKey: ['send-message'],
    mutationFn: async (model: {
      conversationId: number;
      text?: string;
      type: MessageType;
      file?: File;
    }) => {
      const formData = new FormData();
      formData.append('ConversationId', model.conversationId.toString());
      formData.append('Type', model.type.toString());

      if (model.text) {
        formData.append('Text', model.text);
      }

      if (model.file) {
        formData.append('File', model.file);
      }

      return await BaseRequest.Post<MessageApiResponse>(
        `/${SUB_URL}`,
        formData
      );
    }
  });
};

export const useGetMessagesByConversationId = (conversationId?: number) => {
  return useQuery({
    queryKey: ['get-messages-by-conversation-id', conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      return await BaseRequest.Get<MessageApiResponse[]>(
        `/${SUB_URL}/${conversationId}`
      );
    }
  });
};

export const useMaskAsRead = () => {
  return useMutation({
    mutationKey: ['mask-as-read'],
    mutationFn: async (model: { conversationId: number }) => {
      return await BaseRequest.Post(`/${SUB_URL}`, model);
    }
  });
};
