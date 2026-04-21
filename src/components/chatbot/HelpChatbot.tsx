'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatbot } from './ChatbotContext';
import { MessageSquare, X, Send, Bot, User, HelpCircle, Sparkles, RefreshCcw, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HelpChatbot() {
    const { isOpen, messages, isLoading, toggleChat, sendMessage, clearChat } = useChatbot();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-5 bg-gradient-to-br from-[#1d1b41] to-[#2a1b41] text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center relative">
                                    <Bot className="w-5 h-5 text-[#d5a22d]" />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#1d1b41] rounded-full" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm tracking-tight uppercase">Tenpaten AI</h3>
                                    <p className="text-[10px] text-white/60 font-medium tracking-widest uppercase flex items-center gap-1">
                                        <Sparkles className="w-2 h-2 text-[#d5a22d]" /> Online Help
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={clearChat}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-all"
                                    title="Reset Conversation"
                                >
                                    <RefreshCcw className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={toggleChat}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fc]/50 custom-scrollbar"
                        >
                            {messages.map((msg, idx) => {
                                const isAI = msg.role === 'model';
                                return (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
                                    >
                                        <div className={`max-w-[85%] px-4 py-3 rounded-[1.5rem] text-sm shadow-sm ${
                                            isAI 
                                                ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' 
                                                : 'bg-gradient-to-br from-[#1d1b41] to-[#2a1b41] text-white rounded-tr-none'
                                        }`}>
                                            <p className="leading-relaxed">{msg.content}</p>
                                        </div>
                                        <span className="text-[8px] font-black text-gray-400 mt-1 uppercase tracking-widest px-1">
                                            {isAI ? 'Tenpaten Assistant' : 'You'}
                                        </span>
                                    </motion.div>
                                );
                            })}
                            {isLoading && (
                                <div className="flex items-start gap-2">
                                    <div className="bg-white px-4 py-3 rounded-[1.5rem] rounded-tl-none border border-gray-100 shadow-sm">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-[#d5a22d] rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-[#d5a22d] rounded-full animate-bounce delay-100" />
                                            <div className="w-1.5 h-1.5 bg-[#d5a22d] rounded-full animate-bounce delay-200" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <input 
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Need help with something?"
                                    className="flex-1 bg-gray-50 border border-transparent focus:border-[#d5a22d]/30 focus:bg-white focus:ring-4 focus:ring-[#d5a22d]/5 rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all placeholder:text-gray-400 font-medium"
                                />
                                <button 
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className={`p-3 rounded-2xl shadow-lg transition-all active:scale-95 ${
                                        !input.trim() || isLoading 
                                            ? 'bg-gray-100 text-gray-400' 
                                            : 'bg-[#d5a22d] text-white hover:bg-[#b89531] shadow-[#d5a22d]/20'
                                    }`}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                            <p className="text-[8px] text-gray-400 text-center mt-3 font-semibold uppercase tracking-widest">
                                Instant support powered by Gemini 2.0
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={toggleChat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
                    isOpen 
                        ? 'bg-white text-[#1d1b41] rotate-90 border border-gray-100' 
                        : 'bg-[#1d1b41] text-white'
                }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 text-[#d5a22d]" />}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#d5a22d] border-2 border-white rounded-full animate-bounce" />
                )}
            </motion.button>
        </div>
    );
}
