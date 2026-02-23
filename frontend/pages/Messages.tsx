import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/UI';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';
import apiClient from '../services/api';

interface ConversationItem {
    id: string;
    contactName: string;
    contactImage: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    messages: { id: string; sender: string; content: string; timestamp: string }[];
}

const Messages: React.FC = () => {
    const [conversations, setConversations] = useState<ConversationItem[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<any[]>([]);

    // Fetch real conversations from backend
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true);
                const { data } = await apiClient.get('/messages/conversations');
                if (data.success && data.conversations) {
                    const mapped = data.conversations.map((conv: any) => ({
                        id: conv.otherUserId || conv._id,
                        contactName: conv.otherUser?.name || 'Unknown',
                        contactImage: conv.otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.otherUser?.name || 'user'}`,
                        lastMessage: conv.lastMessage?.content || 'No messages yet',
                        timestamp: conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                        unread: conv.unreadCount || 0,
                        messages: [],
                    }));
                    setConversations(mapped);
                    if (mapped.length > 0 && !selectedId) {
                        setSelectedId(mapped[0].id);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch conversations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    // Fetch messages when a conversation is selected
    useEffect(() => {
        if (!selectedId) return;
        const fetchMessages = async () => {
            try {
                const { data } = await apiClient.get(`/messages/${selectedId}`);
                if (data.success && data.messages) {
                    setMessages(data.messages);
                    // Mark messages as read
                    apiClient.post('/messages/mark-read', { userId: selectedId }).catch(() => {});
                }
            } catch (err) {
                console.error('Failed to fetch messages:', err);
            }
        };
        fetchMessages();
    }, [selectedId]);

    const selectedConversation = conversations.find(c => c.id === selectedId);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedId) return;

        const content = messageInput;
        setMessageInput('');

        try {
            const { data } = await apiClient.post('/messages', {
                receiverId: selectedId,
                content,
            });

            if (data.success) {
                // Optimistically add message to UI
                setMessages(prev => [...prev, {
                    _id: data.message?._id || Date.now().toString(),
                    senderId: 'me',
                    content,
                    createdAt: new Date().toISOString(),
                }]);
            }
        } catch (err: any) {
            console.error('Failed to send message:', err);
            // Re-add input on failure
            setMessageInput(content);
        }
    };

    return (
        <div className="h-[calc(100vh-96px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex">

                {/* Sidebar List */}
                <div className="w-full md:w-80 border-r border-gray-200 flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">Messages</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loading && (
                            <div className="p-8 text-center text-gray-500 text-sm">Loading conversations...</div>
                        )}
                        {!loading && conversations.length === 0 && (
                            <div className="p-8 text-center text-gray-500 text-sm">No conversations yet</div>
                        )}
                        {conversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedId(conv.id)}
                                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === conv.id ? 'bg-emerald-50 border-l-4 border-emerald-500' : 'border-l-4 border-transparent'}`}
                            >
                                <img src={conv.contactImage} alt={conv.contactName} className="w-12 h-12 rounded-full object-cover" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-semibold text-gray-900 truncate">{conv.contactName}</h4>
                                        <span className="text-xs text-gray-400">{conv.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                                </div>
                                {conv.unread > 0 && (
                                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                                        {conv.unread}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="hidden md:flex flex-1 flex-col h-full">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-3">
                            <img src={selectedConversation?.contactImage} alt="" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <h3 className="font-bold text-gray-900">{selectedConversation?.contactName}</h3>
                                <span className="flex items-center text-xs text-emerald-600">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></span> Online
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><Phone size={20} /></button>
                            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><Video size={20} /></button>
                            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><MoreVertical size={20} /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 text-sm mt-12">No messages yet. Start the conversation!</div>
                        )}
                        {messages.map((msg: any, idx: number) => {
                            const isMe = msg.senderId === 'me' || msg.senderId?.toString() !== selectedId;
                            const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                            return (
                                <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`${isMe ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'} px-4 py-2 rounded-2xl max-w-md`}>
                                        <p className="text-sm">{msg.content}</p>
                                        <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-emerald-100' : 'text-gray-400'}`}>{time}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                            />
                            <Button
                                className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim()}
                            >
                                <Send size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
