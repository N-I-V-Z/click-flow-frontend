import BaseRequest from '@/config/axios.config';
import { BaseResponse } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import helpers from '@/helpers';

const SUB_URL = `/api/AIWebsite`;

// Interface cho response của Chat AI
export interface ChatAIResponse {
  statusCode: string;
  isSuccess: boolean;
  message: string;
  result: string;
}

// Interface cho request của Chat AI
export interface ChatAIRequest {
  question: string;
}

// Custom AI API call (không dùng BaseRequest vì format khác)
const callAIAPI = async (question: string): Promise<ChatAIResponse> => {
  const token = helpers.cookie_get('AT');
  const encodedQuestion = encodeURIComponent(question);

  const response = await axios.get<ChatAIResponse>(
    `${SUB_URL}/response?question=${encodedQuestion}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: '*/*'
      }
    }
  );

  return response.data;
};

// Hook để gửi câu hỏi tới Chat AI
export const useChatAI = () => {
  return useMutation({
    mutationKey: ['chat-ai'],
    mutationFn: async (question: string) => {
      return await callAIAPI(question);
    }
  });
};

// Hook để gửi câu hỏi với query (nếu muốn cache kết quả)
export const useChatAIQuery = (question: string, enabled = false) => {
  return useQuery({
    queryKey: ['chat-ai-query', question],
    queryFn: async () => {
      const encodedQuestion = encodeURIComponent(question);
      return await BaseRequest.Get<ChatAIResponse>(
        `${SUB_URL}/response?question=${encodedQuestion}`
      );
    },
    enabled: enabled && !!question, // Chỉ call API khi enabled = true và có question
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    gcTime: 10 * 60 * 1000 // Garbage collect sau 10 phút
  });
};

// Hook để lấy lịch sử chat (nếu có API)
export const useChatHistory = () => {
  return useQuery({
    queryKey: ['chat-history'],
    queryFn: async () => {
      // Implement khi có API lịch sử chat
      return await BaseRequest.Get<BaseResponse>(`${SUB_URL}/history`);
    },
    enabled: false // Tắt cho đến khi có API
  });
};
