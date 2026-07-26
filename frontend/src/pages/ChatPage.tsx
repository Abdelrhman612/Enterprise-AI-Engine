import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Hello! I am the Enterprise AI Engine. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageText = input.trim();
    setInput('');

    // 1. Add User Message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 2. Call Backend using Axios Instance
      const response = await api.post('/chat', { message: userMessageText });
      
      // 3. Add AI Response
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: response.data.response || 'No response field received.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error(err);
      
      // Extract error message from axios error object
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Failed to connect to the backend.';

      // Add a system error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: `⚠️ Error: ${errorMsg}. Make sure the Backend (port 4000) and AI Service (port 8000) are running.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl h-[85vh] bg-slate-800/35 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden mx-auto my-4">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-950/60 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-slate-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <h2 className="text-base font-bold text-slate-100">AI Chat Assistant</h2>
          </div>
        </div>
        <span className="text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
          Sprint 1
        </span>
      </header>

      {/* Message Area */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 shadow-md ${
              msg.sender === 'user' 
                ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white' 
                : 'bg-gradient-to-br from-sky-500 to-sky-600 text-white'
            }`}>
              {msg.sender === 'user' ? 'U' : 'AI'}
            </div>
            
            {/* Bubble */}
            <div className={`p-3.5 rounded-2xl shadow-sm relative ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-slate-700/50 text-slate-100 border border-slate-600/20 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <span className="block text-[9px] text-slate-400/80 mt-1 text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%] self-start">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-md">
              AI
            </div>
            <div className="p-3 px-4 bg-slate-700/50 border border-slate-600/20 rounded-2xl rounded-tl-none shadow-sm flex items-center justify-center">
              <div className="flex gap-1.5 py-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="flex p-4 bg-slate-950/40 border-t border-slate-800/80 gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Thinking..." : "Send a message..."}
          disabled={isLoading}
          className="flex-1 bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/20 transition disabled:opacity-50 placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800/50 disabled:text-slate-600 text-white px-5 rounded-xl flex items-center justify-center transition active:scale-95 disabled:scale-100 disabled:pointer-events-none font-semibold text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}
