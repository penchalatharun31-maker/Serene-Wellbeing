import React, { useState } from 'react';
import { CONVERSATIONS } from '../data';
import { Card, Button } from '../components/UI';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';

const Messages: React.FC = () => {
    const [selectedId, setSelectedId] = useState(CONVERSATIONS[0].id);
    const selectedConversation = CONVERSATIONS.find(c => c.id === selectedId);
    const [messageInput, setMessageInput] = useState('');

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;

        // In a real app, send via Socket.io
        // socketService.sendMessage({ to: selectedId, content: messageInput });
        console.log('Sending message:', messageInput, 'to', selectedId);

        // Clear input
        setMessageInput('');
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
                        {CONVERSATIONS.map(conv => (
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
                        <div className="flex justify-center">
                            <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full">Today</span>
                        </div>
                        <div className="flex justify-end">
                            <div className="bg-emerald-500 text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-md">
                                <p className="text-sm">Hi! I have a question about our upcoming session.</p>
                                <span className="text-[10px] text-emerald-100 block text-right mt-1">10:28 AM</span>
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-tl-none max-w-md">
                                <p className="text-sm">{selectedConversation?.lastMessage}</p>
                                <span className="text-[10px] text-gray-400 block text-right mt-1">10:30 AM</span>
                            </div>
                        </div>
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
