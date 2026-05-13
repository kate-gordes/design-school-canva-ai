import { useState, useCallback } from 'react';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! How can I assist you today? If you'd like to try something out or need help with a project, just let me know!",
      timestamp: new Date(),
    },
  ]);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
  }, []);

  const addUserMessage = useCallback(
    (content: string) => {
      addMessage(content, 'user');
    },
    [addMessage],
  );

  const addAssistantMessage = useCallback(
    (content: string) => {
      addMessage(content, 'assistant');
    },
    [addMessage],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addMessage,
    addUserMessage,
    addAssistantMessage,
    clearMessages,
  };
}
