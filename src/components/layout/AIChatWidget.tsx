"use client";

import React, { useState, useRef, useEffect } from "react";
import { chatApi } from "@/lib/api";
import { Bot, Send, X, ChevronDown, Sparkles, RotateCcw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  parts: string;
  timestamp: Date;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      parts:
        "Hi! I'm **BookNest AI** 📚 — your personal library assistant. I can help you find books, understand membership plans, and guide you through our services. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      role: "user",
      parts: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Build history in the format the backend expects (excluding the latest user message)
      const history = messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        parts: m.parts,
      }));

      const resText = await chatApi.sendMessage(trimmed, history);
      const assistantText =
        typeof resText === "string" && resText.trim().length > 0
          ? resText
          : "I could not generate a response right now. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          parts: assistantText,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          parts:
            "Sorry, I'm having trouble connecting right now. Please try again in a moment. 🙏",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        parts:
          "Hi! I'm **BookNest AI** 📚 — your personal library assistant. I can help you find books, understand membership plans, and guide you through our services. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  };

  /** Minimally render markdown bold (**text**) */
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating toggle button */}
      {!isOpen && (
        <button
          id="ai-chat-toggle"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40 active:scale-95"
          aria-label="Open AI Chat"
        >
          <Sparkles className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-semibold">BookNest AI</span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl transition-all duration-300 ${
            isMinimized ? "h-14 w-72" : "h-[520px] w-[360px]"
          }`}
          style={{
            background: "linear-gradient(145deg, #1e1b4b, #0f172a)",
            border: "1px solid rgba(139,92,246,0.3)",
            boxShadow: "0 25px 50px -12px rgba(109,40,217,0.4)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between rounded-t-2xl px-4 py-3"
            style={{
              background: "linear-gradient(90deg, #7c3aed, #4f46e5)",
            }}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">BookNest AI</p>
                {!isMinimized && (
                  <p className="text-xs text-violet-200">Always here to help</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!isMinimized && (
                <button
                  onClick={resetChat}
                  className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  title="Reset conversation"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsMinimized((v) => !v)}
                className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${isMinimized ? "rotate-180" : ""}`}
                />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4 scrollbar-thin">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-tr-sm bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
                          : "rounded-tl-sm bg-white/10 text-slate-100"
                      }`}
                    >
                      {renderText(msg.parts)}
                      <p
                        className={`mt-1 text-[10px] ${
                          msg.role === "user"
                            ? "text-violet-200"
                            : "text-slate-400"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3">
                      <div className="flex gap-1">
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-violet-400"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-violet-400"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-violet-400"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 px-3 pb-2">
                  {[
                    "Find a book",
                    "Membership plans",
                    "How to borrow?",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full border border-violet-500/40 bg-white/5 px-3 py-1 text-xs text-violet-300 transition-colors hover:bg-violet-600/20 hover:text-white"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Input area */}
              <div className="flex items-center gap-2 rounded-b-2xl border-t border-white/10 bg-white/5 px-3 py-3">
                <input
                  ref={inputRef}
                  id="ai-chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 outline-none disabled:opacity-50"
                  autoComplete="off"
                />
                <button
                  id="ai-chat-send"
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
