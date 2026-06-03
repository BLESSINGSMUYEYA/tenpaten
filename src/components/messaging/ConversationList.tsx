'use client';

import { useSearchParams } from 'next/navigation';
import { User, Search, MessageSquare, Plus, Trash2, Archive } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { formatMessageDate } from '@/lib/utils/date';
import Fuse from 'fuse.js';
import NewConversationModal from './NewConversationModal';
import { deleteConversation } from '@/lib/actions/messaging';
import { toast } from 'sonner';

interface Conversation {
    id: string;
    otherUser: {
        id?: string;
        fullName: string | null;
        email?: string | null;
        profilePhoto?: string | null;
        role?: string;
    };
    lastMessage: {
        content: string;
        createdAt: Date | string;
    } | null;
    updatedAt: Date | string;
    isUnread: boolean;
    [key: string]: any;
}

export default function ConversationList({ conversations: initialConversations }: { conversations: Conversation[] }) {
    const searchParams = useSearchParams();
    const selectedId = searchParams.get('id');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [conversations, setConversations] = useState(initialConversations);

    // Sync state with props
    useMemo(() => {
        setConversations(initialConversations);
    }, [initialConversations]);

    const fuse = useMemo(() => {
        return new Fuse(conversations, {
            keys: ['otherUser.fullName', 'lastMessage.content'],
            threshold: 0.35,
        });
    }, [conversations]);

    const filteredConversations = useMemo(() => {
        if (!searchQuery) return conversations;
        return fuse.search(searchQuery).map(result => result.item);
    }, [conversations, searchQuery, fuse]);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!confirm('Are you sure you want to archive this conversation?')) return;

        const res = await deleteConversation(id);
        if (res.success) {
            toast.success('Conversation archived');
            setConversations(prev => prev.filter(c => c.id !== id));
        } else {
            toast.error('Failed to archive conversation');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8f9fc]">
            {/* ── Navy & Gold Header ── */}
            <div className="px-6 py-5 bg-[#1d1b41] flex flex-col gap-4 shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-black text-white tracking-[0.15em] uppercase">Messages</h2>
                        <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] mt-0.5">
                            Inbox ({conversations.filter(c => c.isUnread).length} Unread)
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-9 h-9 rounded-xl bg-brand-accent text-[#1d1b41] flex items-center justify-center shadow-lg shadow-[#1d1b41]/20 hover:bg-[#b58825] active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 font-black" />
                    </button>
                </div>

                {/* Search Bar inside header */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-brand-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:bg-white/15 transition-all placeholder:text-white/30 text-white font-medium"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 pb-4 bg-white">
                {filteredConversations.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#1d1b41]/5 border border-[#1d1b41]/10 flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-[#1d1b41]/30" />
                        </div>
                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.1em]">
                            {searchQuery ? `No matches for "${searchQuery}"` : "No active conversations"}
                        </p>
                    </div>
                ) : (
                    filteredConversations.map((conv) => {
                        const isActive = selectedId === conv.id;
                        const initials = conv.otherUser.fullName
                            ?.split(' ')
                            .map(n => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase() || 'U';

                        return (
                            <Link
                                key={conv.id}
                                href={`/dashboard/messages?id=${conv.id}`}
                                className={`group flex items-center gap-4 px-5 py-3 mx-2 my-1 rounded-2xl transition-all duration-300 relative border border-transparent ${isActive
                                    ? 'bg-[#1d1b41] text-white shadow-lg shadow-[#1d1b41]/20 z-10'
                                    : conv.isUnread ? 'bg-amber-50/50 border-amber-100/50' : 'hover:bg-slate-50 hover:border-slate-100 text-[#1d1b41]'
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shadow-sm transition-transform group-hover:rotate-3 border ${isActive
                                        ? 'bg-white/10 text-white border-white/20'
                                        : 'bg-white text-[#1d1b41] border-[#1d1b41]/10'
                                        }`}>
                                        {conv.otherUser.profilePhoto ? (
                                            <img
                                                src={conv.otherUser.profilePhoto}
                                                alt=""
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        ) : (
                                            initials
                                        )}
                                    </div>
                                    {conv.isUnread && (
                                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-accent border-2 border-white rounded-full flex items-center justify-center shadow-sm z-20">
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <h4 className={`text-sm truncate pr-2 tracking-tight ${isActive ? 'text-white' : conv.isUnread ? 'font-black text-[#1d1b41]' : 'font-bold text-[#1d1b41]'
                                                }`}>
                                                {conv.otherUser.fullName || 'User'}
                                            </h4>
                                            {!isActive && (
                                                <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                                                    conv.otherUser.role === 'SCHOOL_ADMIN' ? 'bg-[#1d1b41]/5 text-[#1d1b41] border-[#1d1b41]/10' : 'bg-slate-50 text-slate-400 border-slate-100'
                                                }`}>
                                                    {conv.otherUser.role === 'SCHOOL_ADMIN' ? 'School' : 'Student'}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-[0.1em] flex-shrink-0 ${isActive ? 'text-white/60' : conv.isUnread ? 'text-brand-accent' : 'text-slate-400'
                                            }`} suppressHydrationWarning>
                                            {formatMessageDate(conv.updatedAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className={`text-[11px] truncate leading-snug ${isActive ? 'text-white/70' : conv.isUnread ? 'font-bold text-[#1d1b41]' : 'text-slate-500 font-medium'
                                            }`}>
                                            {conv.lastMessage?.content || 'Started a conversation'}
                                        </p>
                                        
                                        {/* Actions */}
                                        <button 
                                            onClick={(e) => handleDelete(conv.id, e)}
                                            className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all border ${
                                                isActive ? 'text-white/40 hover:text-white border-white/10 hover:bg-white/10' : 'text-slate-300 hover:text-rose-500 border-slate-100 hover:bg-rose-50 hover:border-rose-100'
                                            }`}
                                        >
                                            <Archive className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>

            <NewConversationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
}
