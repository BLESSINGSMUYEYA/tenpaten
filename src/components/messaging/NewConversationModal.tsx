'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, UserPlus, X, Mail, GraduationCap, Building } from 'lucide-react';
import { getContactableUsers, getOrCreateConversation } from '@/lib/actions/messaging';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';

interface Contact {
    id: string;
    fullName: string | null;
    email: string | null;
    profilePhoto: string | null;
    role: string;
}

export default function NewConversationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [loading, setLoading] = useState(true);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [initiating, setInitiating] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            getContactableUsers().then(users => {
                setContacts(users as Contact[]);
                setLoading(false);
            });
        }
    }, [isOpen]);

    const fuse = useMemo(() => {
        return new Fuse(contacts, {
            keys: ['fullName', 'email'],
            threshold: 0.3,
        });
    }, [contacts]);

    const filteredContacts = useMemo(() => {
        if (!searchQuery) return contacts;
        return fuse.search(searchQuery).map(result => result.item);
    }, [searchQuery, contacts, fuse]);

    const handleStartChat = async (recipientId: string) => {
        setInitiating(recipientId);
        try {
            const { conversationId } = await getOrCreateConversation(recipientId);
            router.push(`/dashboard/messages?id=${conversationId}`);
            onClose();
        } catch (error) {
            console.error('Failed to start conversation:', error);
        } finally {
            setInitiating(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1d1b41]/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 bg-linear-to-br from-[#1d1b41] to-[#2a1b41] text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-brand-accent" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg tracking-tight uppercase">New Message</h3>
                            <p className="text-[10px] text-white/60 font-medium tracking-widest uppercase">Select a contact to begin</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-xl transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 border-b border-gray-100">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all placeholder:text-gray-400 font-medium"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Contacts List */}
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-3">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading contacts...</p>
                        </div>
                    ) : filteredContacts.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-gray-400 font-medium px-10">No authorized contacts found. Try searching for a different name.</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredContacts.map((contact) => (
                                <button
                                    key={contact.id}
                                    onClick={() => handleStartChat(contact.id)}
                                    disabled={initiating === contact.id}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all group text-left relative"
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#1d1b41]/5 to-[#1d1b41]/10 flex items-center justify-center text-[#1d1b41] font-black text-lg group-hover:scale-105 transition-transform">
                                            {contact.profilePhoto ? (
                                                <img src={contact.profilePhoto} alt="" className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                contact.fullName?.[0].toUpperCase() || 'U'
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-900 truncate tracking-tight">{contact.fullName}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Mail className="w-3 h-3 text-gray-400" />
                                            <p className="text-[11px] text-gray-500 font-medium truncate">{contact.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black tracking-widest uppercase ${
                                            contact.role === 'SCHOOL_ADMIN' ? 'bg-blue-50 text-blue-600' :
                                            contact.role === 'PROSPECT' ? 'bg-amber-50 text-amber-600' :
                                            'bg-purple-50 text-purple-600'
                                        }`}>
                                            {contact.role === 'SCHOOL_ADMIN' ? 'University Unit' : contact.role}
                                        </span>
                                        {initiating === contact.id && (
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-brand-accent rounded-full animate-spin" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Tip */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-brand-accent" />
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">
                        <span className="font-bold text-gray-900">Pro-tip:</span> You can only message university staff for programs you have active applications for.
                    </p>
                </div>
            </div>
        </div>
    );
}
