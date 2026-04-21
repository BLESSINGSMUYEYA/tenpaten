'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Send, ArrowLeft, MoreVertical, Phone, Video, CheckCheck, AlertCircle, MessageSquare, Trash2, ShieldAlert } from 'lucide-react';
import { sendMessage, deleteMessage } from '@/lib/actions/messaging';
import Link from 'next/link';
import { formatDetailedDate } from '@/lib/utils/date';
import { pusherClient } from '@/lib/pusher';
import { toast } from 'sonner';

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date | string;
    sender: {
        fullName: string | null;
        profilePhoto: string | null;
    };
}

function SubmitButton({ pending }: { pending: boolean }) {
    return (
        <button
            type="submit"
            disabled={pending}
            className={`p-3 rounded-2xl transition-all duration-300 shadow-lg active:scale-95 ${pending ? 'bg-gray-100 text-gray-400' : 'bg-[#d5a22d] text-white hover:bg-[#b89531] shadow-[#d5a22d]/20 hover:shadow-[#d5a22d]/30'
            }`}
        >
            <Send className="w-5 h-5" />
        </button>
    );
}

export default function ChatWindow({
    conversationId,
    initialMessages,
    currentUserId,
    recipientName
}: {
    conversationId: string,
    initialMessages: Message[],
    currentUserId: string,
    recipientName: string
}) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const formRef = useRef<HTMLFormElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [hasError, setHasError] = useState(false);
    const [isPending, startTransition] = useTransition();
    const committedIds = useRef<Set<string>>(new Set(initialMessages.map(m => m.id)));

    useEffect(() => {
        setMessages(initialMessages);
        committedIds.current = new Set(initialMessages.map(m => m.id));
        scrollToBottom('auto');
        setHasError(false);
    }, [conversationId, initialMessages]);

    const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages.length]);

    useEffect(() => {
        if (!conversationId || !pusherClient) return;

        const channel = pusherClient.subscribe(`conversation-${conversationId}`);

        channel.bind('new-message', (newMessage: Message) => {
            setMessages(prev => {
                if (prev.find(m => m.id === newMessage.id)) return prev;
                committedIds.current.add(newMessage.id);
                return [...prev, newMessage];
            });
        });

        return () => {
            pusherClient?.unsubscribe(`conversation-${conversationId}`);
        };
    }, [conversationId]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const content = textareaRef.current?.value?.trim() ?? '';
        if (!content) return;

        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: Message = {
            id: tempId,
            content,
            senderId: currentUserId,
            createdAt: new Date().toISOString(),
            sender: { fullName: 'You', profilePhoto: null },
        };
        setMessages(prev => [...prev, optimisticMsg]);

        if (textareaRef.current) {
            textareaRef.current.value = '';
            textareaRef.current.style.height = 'auto';
        }

        const formData = new FormData();
        formData.set('conversationId', conversationId);
        formData.set('content', content);

        startTransition(async () => {
            try {
                const result = await sendMessage(null, formData);
                if (result?.success && result.message) {
                    const realMessage = result.message;
                    committedIds.current.add(realMessage.id);
                    setMessages(prev =>
                        prev.map(m => (m.id === tempId ? realMessage : m))
                    );
                } else {
                    setMessages(prev => prev.filter(m => m.id !== tempId));
                    toast.error(result?.error || 'Failed to send message');
                }
            } catch (err) {
                setMessages(prev => prev.filter(m => m.id !== tempId));
                toast.error('Network error. Check your connection.');
            }
        });
    };

    const handleDeleteMessage = async (msgId: string) => {
        if (!confirm('Remove this message for you?')) return;
        
        const res = await deleteMessage(msgId);
        if (res.success) {
            setMessages(prev => prev.filter(m => m.id !== msgId));
            toast.success('Message deleted');
        } else {
            toast.error('Could not delete message');
        }
    };

    const recipientInitials = recipientName
        ?.split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'U';

    return (
        <div className="flex flex-col h-full bg-white rounded-[2.5rem] shadow-2xl shadow-[#1d1b41]/5 border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white/90 backdrop-blur-md flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/messages"
                        className="md:hidden p-2.5 -ml-2 text-gray-400 hover:text-[#1d1b41] hover:bg-[#1d1b41]/5 rounded-2xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="relative group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1d1b41] to-[#d5a22d] flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:rotate-3 transition-transform duration-300">
                            {recipientInitials}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-[3px] border-white rounded-full shadow-sm" />
                    </div>
                    <div>
                        <h2 className="font-black text-[#1d1b41] leading-none text-base md:text-lg tracking-tight uppercase">{recipientName}</h2>
                        <div className="flex items-center gap-2 mt-1.5 slice-in-from-left duration-500">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Available now</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-3 text-gray-400 hover:text-[#1d1b41] hover:bg-gray-50 rounded-2xl transition-all">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fc]/50 custom-scrollbar relative">
                {hasError && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/90 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-red-50 flex flex-col items-center text-center max-w-sm">
                            <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
                            <h3 className="text-gray-900 font-black text-xl mb-2">Access Denied</h3>
                            <p className="text-gray-500 text-sm mb-6">You don't have permission to view this conversation.</p>
                            <Link href="/dashboard/messages" className="w-full py-3 bg-[#1d1b41] text-white font-bold rounded-xl shadow-lg">Back to Messages</Link>
                        </div>
                    </div>
                )}
                
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                        <div className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center shadow-sm mb-4">
                            <MessageSquare className="w-8 h-8 text-[#1d1b41]" />
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Start the conversation</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {messages.map((msg, idx) => {
                            const isMe = msg.senderId === currentUserId;
                            const isTemp = msg.id.startsWith('temp-');
                            const prevMsg = messages[idx - 1];
                            const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId;
                            const nextMsg = messages[idx + 1];
                            const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;

                            const roundingClass = isMe
                                ? `${isFirstInGroup ? 'rounded-tr-none' : ''} ${isLastInGroup ? 'rounded-br-[1.5rem]' : 'rounded-br-md'}`
                                : `${isFirstInGroup ? 'rounded-tl-none' : ''} ${isLastInGroup ? 'rounded-bl-[1.5rem]' : 'rounded-bl-md'}`;

                            return (
                                <div key={msg.id} className={`group flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isFirstInGroup ? 'mt-6' : 'mt-1'}`}>
                                    <div className={`relative flex items-end gap-2 max-w-[85%] md:max-w-[70%]`}>
                                        {isMe && !isTemp && (
                                            <button 
                                                onClick={() => handleDeleteMessage(msg.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all order-first"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        
                                        <div className={`px-5 py-3.5 text-sm shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500 ${isMe
                                            ? `bg-gradient-to-br from-[#1d1b41] to-[#2a1b41] text-white rounded-[1.5rem] ${roundingClass} ${isTemp ? 'opacity-70' : ''}`
                                            : `bg-white text-gray-800 rounded-[1.5rem] border border-gray-100 shadow-sm ${roundingClass}`
                                            }`}>
                                            <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                                            <div className={`mt-1.5 flex items-center justify-end gap-1.5 ${isMe ? 'text-white/50' : 'text-gray-400'}`} suppressHydrationWarning>
                                                <span className="text-[8px] font-black uppercase tracking-tighter">
                                                    {isTemp ? 'Sending…' : formatDetailedDate(msg.createdAt)}
                                                </span>
                                                {isMe && !isTemp && (
                                                    <CheckCheck className="w-3 h-3 text-[#d5a22d]" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="flex gap-3 items-end max-w-4xl mx-auto"
                >
                    <div className="flex-1 bg-gray-50 rounded-[1.75rem] border border-transparent focus-within:border-[#d5a22d]/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#d5a22d]/5 transition-all p-1.5 flex items-end">
                        <textarea
                            ref={textareaRef}
                            name="content"
                            rows={1}
                            placeholder="Write a message..."
                            className="flex-1 p-3 bg-transparent focus:outline-none text-sm resize-none custom-scrollbar font-medium placeholder:text-gray-400"
                            onChange={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    formRef.current?.requestSubmit();
                                }
                            }}
                        />
                        <div className="pb-1 pr-1">
                            <SubmitButton pending={isPending} />
                        </div>
                    </div>
                </form>
                <div className="flex items-center justify-center gap-6 mt-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-500 border border-gray-200">⏎</div>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Send</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="px-1.5 h-4 rounded bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-500 border border-gray-200">SHIFT + ⏎</div>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">New Line</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShieldAlertIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
        </svg>
    );
}
