import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowUpRight,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { CompanySettings } from '../types/index.ts';

interface AIAssistantModalProps {
  settings: CompanySettings;
  onNavigate: (page: string) => void;
  onRequestService?: (category?: string, item?: string) => void;
}

interface Message {
  role: 'assistant' | 'user';
  text: string;
  time?: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  settings,
  onNavigate,
  onRequestService,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Hello and welcome to Hogtech Int’l Ventures! I'm your AI guide for our digital printing, document services, computer training, and business technology solutions in Calabar. How can I help you today?`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const suggestedQuestions = [
    'What printing services do you offer in Calabar?',
    'How do I register for computer training?',
    'Can Hogtech format my CV or research project?',
    'Where is your physical office located?',
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input.trim();
    if (!textToSend || loading) return;

    const userMessage: Message = {
      role: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || "I'm here to assist with Hogtech services. Would you like to connect directly on WhatsApp?";

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `We are ready to assist you! For immediate orders, custom quotes, or enquiries, please chat with our Calabar office directly on WhatsApp or call ${settings.phone}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getWaHandoffUrl = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.text || 'Website enquiry';
    const msg = `Hello Hogtech Int’l Ventures. I was speaking with your website assistant regarding: "${lastUserMsg}". I would like to speak directly with a team member.`;
    return `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {!isOpen && (
          <div className="bg-slate-900/95 border border-slate-700 text-white text-xs px-3 py-1.5 rounded-full shadow-lg hidden sm:flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Need advice or a quote? Ask Hogtech AI</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center gap-2.5 px-4 py-3 rounded-full shadow-xl transition-all duration-300 ${
            isOpen
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-semibold hover:shadow-cyan-500/25 active:scale-95'
          }`}
          aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        >
          {isOpen ? (
            <>
              <X className="w-5 h-5" />
              <span className="text-sm font-medium">Close Chat</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
              <span className="text-sm">Hogtech Assistant</span>
            </>
          )}
        </button>
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] max-h-[80vh] h-[580px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-slate-900/90 border-b border-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                  Hogtech Assistant
                  <span className="text-[10px] font-mono text-teal-400 bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-800">
                    Official
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Verified answers on Hogtech services</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-teal-900/40 border border-teal-700/50 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-teal-500 text-slate-950 font-medium ml-auto rounded-tr-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                  {msg.time && (
                    <div
                      className={`text-[9px] mt-1 ${
                        msg.role === 'user' ? 'text-teal-950/70 text-right' : 'text-slate-500'
                      }`}
                    >
                      {msg.time}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-400">
                <div className="w-6 h-6 rounded-md bg-teal-900/40 border border-teal-700/50 flex items-center justify-center text-teal-400 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Starter Questions (if few messages) */}
          {messages.length <= 2 && (
            <div className="p-3 bg-slate-900/60 border-t border-slate-800/80">
              <p className="text-[11px] text-slate-400 font-medium mb-1.5">Suggested Questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedQuestions.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sq)}
                    className="text-[11px] text-slate-300 bg-slate-800/90 hover:bg-teal-950/60 hover:text-teal-300 hover:border-teal-700/60 border border-slate-700/80 px-2.5 py-1 rounded-md text-left transition-colors"
                  >
                    {sq}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Direct WhatsApp Handoff Strip */}
          <div className="px-3 py-2 bg-teal-950/40 border-t border-teal-900/40 flex items-center justify-between text-[11px]">
            <span className="text-teal-300 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-teal-400" />
              Prefer direct human chat?
            </span>
            <a
              href={getWaHandoffUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-300 font-semibold hover:text-white flex items-center gap-0.5 underline decoration-teal-600"
            >
              Handoff to WhatsApp <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about printing, training, location, typing..."
              className="flex-1 bg-slate-900 text-slate-200 placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-teal-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 rounded-lg transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
