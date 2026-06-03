'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Send, ArrowLeft, MoreVertical, CheckCheck, AlertCircle, MessageSquare, Trash2, ShieldAlert } from 'lucide-react';
import { sendMessage, deleteMessage } from '@/lib/actions/messaging';
import Link from 'next/link';
import { formatDetailedDate } from '@/lib/utils/date';
import { pusherClient } from '@/lib/pusher-client';
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
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 ${pending ? 'bg-slate-100 text-slate-400 border border-slate-200' : 'bg-[#1d1b41] text-brand-accent hover:bg-brand-primary-hover shadow-[#1d1b41]/20'
            }`}
        >
            <Send className="w-4 h-4 ml-0.5" />
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
        <div className="flex flex-col h-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/messages"
                        className="md:hidden p-2 -ml-2 text-slate-400 hover:text-[#1d1b41] hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="relative group">
                        <div className="w-11 h-11 rounded-xl bg-[#1d1b41]/5 flex items-center justify-center text-[#1d1b41] font-black text-sm border border-[#1d1b41]/10 shadow-sm transition-transform duration-300">
                            {recipientInitials}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                    </div>
                    <div>
                        <h2 className="font-black text-[#1d1b41] leading-none text-base tracking-tight uppercase">{recipientName}</h2>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Online Now</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-[#1d1b41] hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50 custom-scrollbar relative">
                {hasError && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/90 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-rose-100 flex flex-col items-center text-center max-w-sm">
                            <ShieldAlert className="w-12 h-12 text-rose-500 mb-4" />
                            <h3 className="text-[#1d1b41] font-black text-xl mb-2 tracking-tight uppercase">Access Denied</h3>
                            <p className="text-slate-500 text-xs font-medium mb-6">You don&apos;t have permission to view this conversation.</p>
                            <Link href="/dashboard/messages" className="w-full py-3.5 bg-[#1d1b41] text-brand-accent font-black uppercase tracking-[0.15em] text-[11px] rounded-xl shadow-lg shadow-[#1d1b41]/20">Back to Inbox</Link>
                        </div>
                    </div>
                )}
                
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm mb-4">
                            <MessageSquare className="w-8 h-8 text-[#1d1b41]/40" />
                        </div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Start the conversation</p>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        {messages.map((msg, idx) => {
                            const isMe = msg.senderId === currentUserId;
                            const isTemp = msg.id.startsWith('temp-');
                            const prevMsg = messages[idx - 1];
                            const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId;
                            const nextMsg = messages[idx + 1];
                            const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;

                            const roundingClass = isMe
                                ? `${isFirstInGroup ? 'rounded-tr-sm' : ''} ${isLastInGroup ? 'rounded-br-2xl' : 'rounded-br-md'}`
                                : `${isFirstInGroup ? 'rounded-tl-sm' : ''} ${isLastInGroup ? 'rounded-bl-2xl' : 'rounded-bl-md'}`;

                            return (
                                <div key={msg.id} className={`group flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isFirstInGroup ? 'mt-5' : 'mt-1'}`}>
                                    <div className={`relative flex items-end gap-2 max-w-[85%] md:max-w-[70%]`}>
                                        {isMe && !isTemp && (
                                            <button 
                                                onClick={() => handleDeleteMessage(msg.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition-all order-first"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        
                                        <div className={`px-5 py-3.5 text-sm shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 ${isMe
                                            ? `bg-[#1d1b41] text-white rounded-2xl ${roundingClass} ${isTemp ? 'opacity-70' : ''}`
                                            : `bg-white text-slate-800 rounded-2xl border border-slate-100 ${roundingClass}`
                                            }`}>
                                            <p className="leading-relaxed whitespace-pre-wrap break-words text-[13px]">{msg.content}</p>
                                            <div className={`mt-1.5 flex items-center justify-end gap-1.5 ${isMe ? 'text-white/40' : 'text-slate-400'}`} suppressHydrationWarning>
                                                <span className="text-[8px] font-black uppercase tracking-widest">
                                                    {isTemp ? 'Sending…' : formatDetailedDate(msg.createdAt)}
                                                </span>
                                                {isMe && !isTemp && (
                                                    <CheckCheck className="w-3.5 h-3.5 text-brand-accent" />
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
            <div className="p-4 bg-white border-t border-slate-100">
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="flex gap-3 items-end w-full"
                >
                    <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-[#1d1b41]/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#1d1b41]/5 transition-all p-1.5 flex items-end">
                        <textarea
                            ref={textareaRef}
                            name="content"
                            rows={1}
                            placeholder="Write a message..."
                            className="flex-1 p-3 bg-transparent focus:outline-none text-sm resize-none custom-scrollbar font-medium placeholder:text-slate-400"
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
                        <div className="pb-0.5 pr-0.5">
                            <SubmitButton pending={isPending} />
                        </div>
                    </div>
                </form>
                <div className="flex items-center justify-center gap-6 mt-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500 border border-slate-200 shadow-sm">⏎</div>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Send</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="px-1.5 h-4 rounded bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500 border border-slate-200 shadow-sm">SHIFT + ⏎</div>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">New Line</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
