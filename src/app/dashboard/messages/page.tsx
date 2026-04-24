import { getConversations, getMessages, markAsRead, getOrCreateConversation } from '@/lib/actions/messaging';
import { getCurrentUser } from '@/lib/auth-utils';
import { MessageSquare, MousePointer2 } from 'lucide-react';
import ConversationList from '@/components/messaging/ConversationList';
import ChatWindow from '@/components/messaging/ChatWindow';
import InfoBanner from '@/components/ui/InfoBanner';

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ id?: string, recipientId?: string }> }) {
    const user = await getCurrentUser();
    const conversations = await getConversations();
    const { id: queryId, recipientId } = await searchParams;

    let selectedId = queryId;

    if (!selectedId && recipientId) {
        try {
            const result = await getOrCreateConversation(recipientId);
            selectedId = result.conversationId;
        } catch (error) {
            console.error("Failed to auto-initiate conversation:", error);
        }
    }

    // Select first if none selected and list not empty (Desktop only behavior implicitly handled by layout)
    const activeId = selectedId || (conversations.length > 0 ? null : null); // Don't auto-select on mobile to keep list view

    let activeMessages: any[] = [];
    let recipientName = 'Select a conversation';

    if (selectedId) {
        activeMessages = await getMessages(selectedId);
        // Mark as read immediately when loading
        await markAsRead(selectedId);

        const activeConv = conversations.find(c => c.id === selectedId);
        if (activeConv) {
            recipientName = activeConv.otherUser.fullName || 'User';
        }
    }

    return (
        <div className="flex gap-4 md:gap-6 h-full relative overflow-hidden">
            {/* Sidebar List */}
            <div className={`w-full md:w-80 lg:w-96 bg-white rounded-[2rem] shadow-xl shadow-[#1d1b41]/5 border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 ${selectedId ? 'hidden md:flex' : 'flex'
                }`}>
                <ConversationList conversations={conversations} />
            </div>

            {/* Chat Area */}
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
                    <div className="h-full flex flex-col items-center justify-center bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-[#1d1b41]/5 p-12 text-center group relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(#d5a22d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />
                        <div className="relative z-10">
                            <div className="relative mb-8 flex justify-center">
                                <div className="w-28 h-28 rounded-[2.5rem] bg-[#1d1b41]/5 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                                    <MessageSquare className="w-12 h-12 text-[#1d1b41]/20" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-3xl bg-white shadow-2xl border border-[#1d1b41]/5 flex items-center justify-center transform group-hover:-translate-y-2 transition-all duration-500 delay-100">
                                    <MousePointer2 className="w-6 h-6 text-[#d5a22d]" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-[#1d1b41] mb-3 uppercase tracking-tighter leading-none">Your Conversations</h2>
                            <p className="text-gray-400 max-w-sm mx-auto leading-relaxed text-sm font-medium">
                                Select a chat from the sidebar to continue your discussion with university representatives.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-3">
                                <div className="px-5 py-2 bg-gray-50 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 shadow-sm">
                                    Secured Chat
                                </div>
                                <div className="px-5 py-2 bg-gray-50 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 shadow-sm">
                                    End-to-End
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
