import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input } from '../components/UI';
import { MessageCircle, Send, AlertCircle, Heart, Phone, Globe, Clock, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  crisisDetected?: boolean;
}

interface CrisisResource {
  name: string;
  type: string;
  contact: { phone?: string; website?: string };
  availability: { is24_7: boolean };
}

export const AICompanion: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: `Hi ${user?.name || 'there'}! I'm Serene, your AI mental health companion. I'm here to listen, support you, and help you navigate your mental health journey. How are you feeling today?`,
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [crisisResources, setCrisisResources] = useState<CrisisResource[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/v1/ai-companion/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, sessionId })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.data.response,
          timestamp: new Date(),
          crisisDetected: data.data.crisisDetected
        };

        setMessages(prev => [...prev, assistantMessage]);
        setSessionId(data.data.sessionId);

        if (data.data.crisisDetected && data.data.resources) {
          setCrisisResources(data.data.resources);
          setShowCrisisResources(true);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm here to listen. Could you tell me more about what's on your mind?",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-emerald-500" size={28} />
            AI Companion
          </h1>
          <p className="text-gray-500">24/7 emotional support and guidance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Shield size={16} className="mr-2" />
            Privacy
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowCrisisResources(true)}>
            <Phone size={16} className="mr-2" />
            Crisis Resources
          </Button>
        </div>
      </div>

      {/* Crisis Alert Banner */}
      {showCrisisResources && (
        <Card className="bg-red-50 border-red-200 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 mb-2">Immediate Support Available</h3>
              <p className="text-sm text-red-800 mb-3">
                If you're in crisis or having thoughts of hurting yourself, please reach out immediately:
              </p>
              <div className="space-y-2">
                {crisisResources.length > 0 ? crisisResources.slice(0, 3).map((resource, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{resource.name}</p>
                        <p className="text-sm text-gray-600">
                          {resource.contact.phone || resource.contact.website}
                          {resource.availability.is24_7 && (
                            <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">24/7</span>
                          )}
                        </p>
                      </div>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Call Now
                      </Button>
                    </div>
                  </div>
                )) : (
                  <>
                    <div className="bg-white p-3 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">National Suicide Prevention Lifeline</p>
                          <p className="text-sm text-gray-600">
                            988 or 1-800-273-8255
                            <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">24/7</span>
                          </p>
                        </div>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Call Now
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Crisis Text Line</p>
                          <p className="text-sm text-gray-600">
                            Text HOME to 741741
                            <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">24/7</span>
                          </p>
                        </div>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Text Now
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-red-700"
                onClick={() => setShowCrisisResources(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="flex flex-col h-[600px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {message.role === 'user' ? user?.name.charAt(0) || 'U' : <Sparkles size={16} />}
                </div>
                <div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 px-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
              rows={2}
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="self-end px-4"
            >
              <Send size={18} />
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Shield size={12} />
            Your conversations are private and encrypted. This is not a replacement for professional therapy.
          </p>
        </div>
      </Card>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <Heart className="text-purple-600 mb-2" size={24} />
          <h3 className="font-bold text-gray-900 mb-1">Empathetic Support</h3>
          <p className="text-sm text-gray-600">I'm here to listen without judgment, 24/7</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
          <Clock className="text-blue-600 mb-2" size={24} />
          <h3 className="font-bold text-gray-900 mb-1">Available Anytime</h3>
          <p className="text-sm text-gray-600">Immediate support whenever you need it</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <Shield className="text-emerald-600 mb-2" size={24} />
          <h3 className="font-bold text-gray-900 mb-1">Safe & Private</h3>
          <p className="text-sm text-gray-600">Your conversations are completely confidential</p>
        </Card>
      </div>
    </div>
  );
};

export default AICompanion;
