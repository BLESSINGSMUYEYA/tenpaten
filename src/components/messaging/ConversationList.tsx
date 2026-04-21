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
            {/* Header / New Message */}
            <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-[#1d1b41] tracking-tight uppercase">Messages</h2>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Inbox ({conversations.filter(c => c.isUnread).length} Unread)</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-10 h-10 rounded-xl bg-[#d5a22d] text-white flex items-center justify-center shadow-lg shadow-[#d5a22d]/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#d5a22d] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#d5a22d]/5 focus:border-[#d5a22d] focus:bg-white transition-all placeholder:text-gray-400 font-medium"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pt-4">
                {filteredConversations.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 rounded-[2rem] bg-gray-100 flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium">
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
                                className={`group flex items-center gap-4 p-4 mx-4 my-1.5 rounded-[1.75rem] transition-all duration-300 relative ${isActive
                                    ? 'bg-[#1d1b41] text-white shadow-xl shadow-[#1d1b41]/20 scale-[1.02] z-10'
                                    : conv.isUnread ? 'bg-white shadow-sm border border-blue-50' : 'hover:bg-white hover:shadow-sm text-gray-700'
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm transition-transform group-hover:rotate-3 ${isActive
                                        ? 'bg-white/10 text-white'
                                        : 'bg-gradient-to-br from-[#1d1b41]/5 to-[#1d1b41]/10 text-[#1d1b41]'
                                        }`}>
                                        {conv.otherUser.profilePhoto ? (
                                            <img
                                                src={conv.otherUser.profilePhoto}
                                                alt=""
                                                className="w-full h-full object-cover rounded-2xl"
                                            />
                                        ) : (
                                            initials
                                        )}
                                    </div>
                                    {conv.isUnread && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#d5a22d] border-2 border-white rounded-full flex items-center justify-center animate-bounce shadow-sm z-20">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <h4 className={`text-sm truncate pr-2 tracking-tight ${isActive ? 'text-white' : conv.isUnread ? 'font-black text-gray-900' : 'font-bold text-gray-700'
                                                }`}>
                                                {conv.otherUser.fullName || 'User'}
                                            </h4>
                                            {!isActive && (
                                                <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-tighter ${
                                                    conv.otherUser.role === 'SCHOOL_ADMIN' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {conv.otherUser.role === 'SCHOOL_ADMIN' ? 'School' : 'Student'}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest flex-shrink-0 ${isActive ? 'text-white/60' : conv.isUnread ? 'text-[#d5a22d]' : 'text-gray-400'
                                            }`} suppressHydrationWarning>
                                            {formatMessageDate(conv.updatedAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className={`text-[11px] truncate leading-none ${isActive ? 'text-white/70' : conv.isUnread ? 'font-bold text-[#1d1b41]' : 'text-gray-500 font-medium'
                                            }`}>
                                            {conv.lastMessage?.content || 'Started a conversation'}
                                        </p>
                                        
                                        {/* Actions */}
                                        <button 
                                            onClick={(e) => handleDelete(conv.id, e)}
                                            className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all ${
                                                isActive ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
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
