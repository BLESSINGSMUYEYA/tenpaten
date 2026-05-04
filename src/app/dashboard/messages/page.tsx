import { getConversations, getMessages, markAsRead, getOrCreateConversation } from '@/lib/actions/messaging';
import { getCurrentUser } from '@/lib/auth-utils';
import { MessageSquare, MousePointer2, ShieldCheck } from 'lucide-react';
import ConversationList from '@/components/messaging/ConversationList';
import ChatWindow from '@/components/messaging/ChatWindow';
import InfoBanner from '@/components/ui/InfoBanner';

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ id?: string, recipientId?: string }> }) {
    // 1. Parallelize initial data fetching
    const [user, conversations, { id: queryId, recipientId }] = await Promise.all([
        getCurrentUser(),
        getConversations(),
        searchParams
    ]);

    let selectedId = queryId;

    // 2. Handle auto-initiation if recipientId is present
    if (!selectedId && recipientId) {
        try {
            const result = await getOrCreateConversation(recipientId);
            selectedId = result.conversationId;
        } catch (error) {
            console.error("Failed to auto-initiate conversation:", error);
        }
    }

    // Select first if none selected and list not empty (Desktop only behavior implicitly handled by layout)
    const activeId = selectedId || null; 

    let activeMessages: any[] = [];
    let recipientName = 'Select a conversation';

    if (selectedId) {
        // 3. Parallelize message fetching and side effects
        const [messages] = await Promise.all([
            getMessages(selectedId),
            markAsRead(selectedId)
        ]);
        
        activeMessages = messages;

        const activeConv = conversations.find(c => c.id === selectedId);
        if (activeConv) {
            recipientName = activeConv.otherUser.fullName || 'User';
        }
    }

    return (
        <div className="flex gap-4 md:gap-5 h-[calc(100vh-10rem)] min-h-[600px] relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ── Sidebar List ── */}
            <div className={`w-full md:w-80 lg:w-96 bg-white rounded-3xl shadow-xl shadow-[#1d1b41]/5 border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 ${selectedId ? 'hidden md:flex' : 'flex'
                }`}>
                <ConversationList conversations={conversations} />
            </div>

            {/* ── Chat Area ── */}
            <div className={`flex-1 min-w-0 h-full transition-all duration-300 ${!selectedId ? 'hidden md:block' : 'block'
                }`}>
                {selectedId ? (
                    <div className="flex flex-col h-full gap-4">
                        <InfoBanner 
                            type="info"
                            title="Secure Channel"
                            message="You are communicating directly with verified university admissions units. For your safety, do not share passwords or payment credentials in chat."
                        />
                        <ChatWindow
                            conversationId={selectedId}
                            initialMessages={activeMessages}
                            currentUserId={user.id}
                            recipientName={recipientName}
                        />
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-xl shadow-[#1d1b41]/5 p-12 text-center group relative overflow-hidden">
                        {/* Decorative background grid */}
                        <div className="absolute inset-0 bg-[radial-gradient(#1d1b41_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 rounded-3xl bg-[#1d1b41]/5 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border border-[#1d1b41]/10 shadow-sm">
                                    <MessageSquare className="w-10 h-10 text-[#1d1b41]" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-[#d5a22d] shadow-lg flex items-center justify-center transform group-hover:-translate-y-2 transition-all duration-500 delay-100 border-2 border-white">
                                    <MousePointer2 className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            
                            <h2 className="text-xl font-black text-[#1d1b41] mb-2 uppercase tracking-[0.1em]">Your Inbox</h2>
                            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed text-sm font-medium">
                                Select a conversation from the sidebar to continue your discussion.
                            </p>
                            
                            <div className="mt-8 flex items-center justify-center gap-3">
                                <div className="px-4 py-2 bg-emerald-50 rounded-xl text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5 shadow-sm">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Secured Chat
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
