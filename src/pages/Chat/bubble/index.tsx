import { useEffect, useState } from 'react';
import { ChatUI } from './components/ChatUI';
import { useCreateConversation } from '@/queries/conversation.query';
import { ConversationApiResponse, MessageType } from '@/types';
import {
  useGetMessagesByConversationId,
  useSendMessage
} from '@/queries/message.query';
import Pusher from 'pusher-js';
import __helpers from '@/helpers';

const ChatBubble = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversationData, setConversationData] = useState<
    ConversationApiResponse | undefined
  >(undefined);
  const [isInitializing, setIsInitializing] = useState(false);

  const { mutateAsync: createConversation } = useCreateConversation();
  const { mutateAsync: sendMessage } = useSendMessage();
  const {
    data: chatMessages,
    refetch: refetchMessages,
    isLoading: isLoadingMessages
  } = useGetMessagesByConversationId(conversationData?.id);

  const adminId = 1;

  useEffect(() => {
    const initializeConversation = async () => {
      if (isInitializing || conversationData) return;

      setIsInitializing(true);
      try {
        const response = await createConversation({ targetUserId: adminId });
        setConversationData(response.result);
        await refetchMessages();
      } catch (error) {
        console.error('Error initializing conversation:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    if (isChatOpen) {
      initializeConversation();
    }
  }, [
    isChatOpen,
    conversationData,
    createConversation,
    refetchMessages,
    isInitializing
  ]);

  useEffect(() => {
    if (!conversationData?.id) return;

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY || '', {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      authEndpoint: `${import.meta.env.VITE_API_URL}/api/Pusher/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${__helpers.cookie_get('AT')}`
        }
      }
    });

    const channel = pusher.subscribe(
      `private-conversation-${conversationData.id}`
    );

    channel.bind('new-message', () => {
      refetchMessages();
    });

    channel.bind('messages-read', () => {
      refetchMessages();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [conversationData?.id, refetchMessages]);

  const handleSend = async (text: string) => {
    if (!conversationData || !text.trim()) return;

    try {
      await sendMessage({
        conversationId: conversationData.id,
        text: text,
        type: MessageType.Text,
        file: undefined
      });

      await refetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendFile = async (file: File) => {
    if (!conversationData) return;

    try {
      await sendMessage({
        conversationId: conversationData.id,
        type: file.type.startsWith('image/')
          ? MessageType.Image
          : MessageType.Voice,
        file: file
      });

      await refetchMessages();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleToggleChat = (isOpen: boolean) => {
    setIsChatOpen(isOpen);
    if (!isOpen) {
      setConversationData(undefined);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isChatOpen ? (
        <div className="flex h-[550px] w-[360px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
          <div className="h-full flex-1">
            <ChatUI
              conversationId={conversationData?.id?.toString() || ''}
              messages={chatMessages?.result}
              onSend={handleSend}
              onSendFile={handleSendFile}
              isOpen={true}
              onToggle={handleToggleChat}
              isLoading={isInitializing || isLoadingMessages}
            />
          </div>
        </div>
      ) : (
        <button
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
          onClick={() => setIsChatOpen(true)}
          aria-label="Open chat support"
        >
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatBubble;
