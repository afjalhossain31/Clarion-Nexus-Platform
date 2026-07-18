'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { MessageSquare, X, Send, Sparkles, Loader } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

export default function ChatWidget() {
  const { token, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([
    'What services do you offer?',
    'How do I request a custom project?',
    'What are your pricing plans?'
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Fetch chat history from database when opened
  useEffect(() => {
    if (!isAuthenticated || !token || !isOpen) return;

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await fetch(`${API_URL}/ai/chat/history`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const history = await res.json();
          if (history && history.length > 0) {
            setMessages(history);
            // Default chips if history already has messages
            setSuggestions([
              'Tell me about web development cost.',
              'How long does an SEO audit take?',
              'Explain your AI features.'
            ]);
          } else {
            // First time greeting
            setMessages([
              {
                role: 'assistant',
                content: 'Hello! I am NexusAI, your project consultant. I can guide you through our core services (Web Development, UI/UX, SEO, Marketing, AI), explain our deliverables, or help you generate project proposal drafts in the "/generate" portal.'
              }
            ]);
          }
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [isOpen, isAuthenticated, token]);

  if (!isAuthenticated) return null;

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    // Append user message local state
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: text })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.reply }
        ]);
        if (data.suggestedPrompts && data.suggestedPrompts.length > 0) {
          setSuggestions(data.suggestedPrompts);
        }
      } else {
        throw new Error('Chat failed');
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue processing that query. Please try again or verify backend connectivity.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage(inputValue);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Chat Window Panel */}
      {isOpen && (
        <div className="mb-4 h-[480px] w-[350px] sm:w-[380px] flex flex-col rounded-2xl border border-card-border bg-card-bg/95 shadow-2xl backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-brand-blue to-brand-purple px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-400 border border-white" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold">NexusAI Advisor</h3>
                <p className="text-[10px] text-white/80">Online & Ready to Help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Logs Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingHistory ? (
              <div className="flex h-full items-center justify-center text-app-fg/50 gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="text-xs">Loading logs...</span>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-tr from-brand-blue to-brand-purple text-white rounded-br-none shadow-md shadow-brand-blue/15'
                        : 'bg-card-border/50 text-app-fg rounded-bl-none border border-card-border/30'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              ))
            )}

            {/* AI Typing Indicator bubble */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-card-border/50 px-4 py-3 border border-card-border/30 flex gap-1 items-center">
                  <span className="h-2 w-2 rounded-full bg-brand-blue dot-bounce" />
                  <span className="h-2 w-2 rounded-full bg-brand-blue dot-bounce" />
                  <span className="h-2 w-2 rounded-full bg-brand-blue dot-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts list */}
          {!isTyping && suggestions.length > 0 && (
            <div className="px-4 py-2 border-t border-card-border/40 flex flex-wrap gap-1.5 bg-card-bg/40 max-h-24 overflow-y-auto">
              {suggestions.map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(p)}
                  className="text-[11px] font-medium text-brand-blue hover:text-brand-purple bg-brand-blue/5 hover:bg-brand-blue/10 border border-brand-blue/10 rounded-full px-2.5 py-1 transition-all duration-200 text-left cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Form Input Footer */}
          <div className="border-t border-card-border p-3 flex items-center gap-2 bg-card-bg">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about pricing, specs, stack..."
              disabled={isTyping}
              className="flex-1 rounded-xl border border-card-border bg-app-bg px-3 py-2 text-sm text-app-fg focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white shadow-md shadow-brand-blue/15 hover:shadow-brand-blue/25 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all duration-200"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple text-white shadow-xl shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all duration-250 border border-white/10 group cursor-pointer"
        aria-label="Toggle chat advisor"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
            </span>
          </div>
        )}
      </button>

    </div>
  );
}
