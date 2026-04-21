'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { askChatbot } from '@/lib/actions/ai';

interface Message {
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
    source?: string;
}

interface ChatbotContextType {
    isOpen: boolean;
    messages: Message[];
    isLoading: boolean;
    toggleChat: () => void;
    sendMessage: (content: string) => Promise<void>;
    clearChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            content: "Hello! I'm Tenpaten AI. How can I help you today?",
            timestamp: new Date(),
            source: 'System'
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const toggleChat = useCallback(() => setIsOpen(prev => !prev), []);

    const sendMessage = useCallback(async (content: string) => {
        const userMsg: Message = {
            role: 'user',
            content,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            // Prepare history for API (excluding current message)
            const history = messages.map(m => ({ 
                role: m.role, 
                content: m.content 
            }));

            const response = await askChatbot(content, history);
            
            setMessages(prev => [...prev, {
                role: 'model',
                content: response.content,
                timestamp: new Date(),
                source: response.source
            }]);
        } catch (error) {
            console.error('Chat error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    const clearChat = useCallback(() => {
        setMessages([
            {
                role: 'model',
                content: "Hello! I'm Tenpaten AI. How can I help you today?",
                timestamp: new Date(),
                source: 'System'
            }
        ]);
    }, []);

    return (
        <ChatbotContext.Provider value={{ isOpen, messages, isLoading, toggleChat, sendMessage, clearChat }}>
            {children}
        </ChatbotContext.Provider>
    );
}

export function useChatbot() {
    const context = useContext(ChatbotContext);
    if (!context) throw new Error('useChatbot must be used within a ChatbotProvider');
    return context;
}
