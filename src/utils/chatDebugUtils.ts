// Chat Debug Utilities
export const chatDebugUtils = {
  // Log Pusher events
  logPusherEvent: (eventType: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.log(`[PUSHER] ${eventType}:`, data);
    }
  },

  // Log message sending
  logMessageSend: (type: 'text' | 'image' | 'file', conversationId: number) => {
    if (import.meta.env.DEV) {
      console.log(
        `[CHAT] Sending ${type} message to conversation ${conversationId}`
      );
    }
  },

  // Log message received
  logMessageReceived: (conversationId: number, messageType?: string) => {
    if (import.meta.env.DEV) {
      console.log(
        `[CHAT] Message received from conversation ${conversationId}, type: ${messageType}`
      );
    }
  },

  // Check Pusher connection status
  checkPusherConnection: (pusher: unknown) => {
    if (import.meta.env.DEV && pusher && typeof pusher === 'object') {
      const pusherObj = pusher as {
        connection: { state: string; socket_id: string };
      };
      const state = pusherObj.connection?.state;
      const socketId = pusherObj.connection?.socket_id;
      console.log(
        `[PUSHER] Connection state: ${state}, Socket ID: ${socketId}`
      );
      return { state, socketId };
    }
    return null;
  },

  // List active channels
  listActiveChannels: (pusher: unknown) => {
    if (import.meta.env.DEV && pusher && typeof pusher === 'object') {
      const pusherObj = pusher as {
        channels: { channels: Record<string, unknown> };
      };
      const channels = Object.keys(pusherObj.channels?.channels || {});
      console.log('[PUSHER] Active channels:', channels);
      return channels;
    }
    return [];
  }
};
