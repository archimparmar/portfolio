"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Maximize2, Minimize2, Trash2, Copy, Check, MessageSquare, Terminal } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioApi } from "@/services/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const renderInline = (text: string): React.ReactNode[] => {
  // Order matters: match **bold** before *italic*, then `code`, then [link](url)
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-extrabold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={index} className="italic text-slate-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={index} className="bg-slate-900 px-1.5 py-0.5 rounded font-mono text-[10px] text-pink-400 border border-white/5">
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:underline hover:text-cyan-300 font-semibold"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
};

const renderMarkdown = (content: string): React.ReactNode => {
  if (!content) return null;

  // Split out fenced code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  const allNodes: React.ReactNode[] = [];

  parts.forEach((part, partIdx) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const inner = part.slice(3, -3).trim().split("\n");
      const firstLine = inner[0] || "";
      const hasLang = /^[a-zA-Z0-9_+-]+$/.test(firstLine);
      const lang = hasLang ? firstLine : "";
      const code = (hasLang ? inner.slice(1) : inner).join("\n");

      allNodes.push(
        <div key={`code-${partIdx}`} className="my-2 rounded-lg border border-white/10 overflow-hidden font-mono text-[10px]">
          {lang && (
            <div className="bg-slate-950 px-3 py-1 border-b border-white/5 text-slate-400 text-[9px] flex justify-between items-center uppercase tracking-widest">
              <span>{lang}</span>
            </div>
          )}
          <pre className="p-3 bg-slate-900/60 overflow-x-auto text-slate-200">
            <code>{code}</code>
          </pre>
        </div>
      );
      return;
    }

    // Process non-code text line by line, grouping lists
    const lines = part.split("\n");
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // --- Horizontal rule ---
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
        allNodes.push(<hr key={`hr-${partIdx}-${i}`} className="border-white/10 my-2" />);
        i++;
        continue;
      }

      // --- h1 heading ---
      if (line.startsWith("# ")) {
        allNodes.push(
          <h2 key={`h1-${partIdx}-${i}`} className="text-white font-bold font-display mt-3 mb-1 text-sm">
            {renderInline(line.slice(2))}
          </h2>
        );
        i++;
        continue;
      }

      // --- h2 heading ---
      if (line.startsWith("## ")) {
        allNodes.push(
          <h3 key={`h2-${partIdx}-${i}`} className="text-white font-bold font-display mt-2 mb-1 text-xs">
            {renderInline(line.slice(3))}
          </h3>
        );
        i++;
        continue;
      }

      // --- h3 heading ---
      if (line.startsWith("### ")) {
        allNodes.push(
          <h4 key={`h3-${partIdx}-${i}`} className="text-white font-bold font-display mt-2 mb-1 text-xs">
            {renderInline(line.slice(4))}
          </h4>
        );
        i++;
        continue;
      }

      // --- Bullet list group ---
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const items: React.ReactNode[] = [];
        while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
          items.push(
            <li key={i} className="text-slate-300 py-0.5">
              {renderInline(lines[i].slice(2))}
            </li>
          );
          i++;
        }
        allNodes.push(
          <ul key={`ul-${partIdx}-${i}`} className="list-disc ml-5 space-y-0.5 my-1">
            {items}
          </ul>
        );
        continue;
      }

      // --- Numbered list group ---
      if (/^\d+\.\s/.test(line)) {
        const items: React.ReactNode[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          const match = lines[i].match(/^\d+\.\s(.*)/);
          items.push(
            <li key={i} className="text-slate-300 py-0.5">
              {renderInline(match ? match[1] : lines[i])}
            </li>
          );
          i++;
        }
        allNodes.push(
          <ol key={`ol-${partIdx}-${i}`} className="list-decimal ml-5 space-y-0.5 my-1">
            {items}
          </ol>
        );
        continue;
      }

      // --- Empty line spacer ---
      if (!line.trim()) {
        allNodes.push(<div key={`space-${partIdx}-${i}`} className="h-1.5" />);
        i++;
        continue;
      }

      // --- Regular paragraph ---
      allNodes.push(
        <p key={`p-${partIdx}-${i}`} className="mb-1 leading-relaxed text-slate-300 last:mb-0">
          {renderInline(line)}
        </p>
      );
      i++;
    }
  });

  return <div className="space-y-0.5">{allNodes}</div>;
};


export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am Archi's Personal AI Representative. Ask me anything about my projects, programming skills, internships, research paper, or certifications. I retrieve context dynamically from my database!",
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsGenerating(true);

    // Initial assistant reply structure (we'll stream content into it)
    const assistantIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      let accumulated = "";
      // Strip off the last empty assistant response for the history list
      const chatHistory = messages.map((m) => ({ role: m.role, content: m.content }));

      await portfolioApi.chatStream(
        text.trim(),
        chatHistory,
        (chunk) => {
          accumulated += chunk;
          setMessages((prev) => {
            const next = [...prev];
            if (next[assistantIndex]) {
              next[assistantIndex] = { role: "assistant", content: accumulated };
            }
            return next;
          });
        },
        (references) => {
          // References can be used here if needed for UI, but logging them as empty can seem like an error.
        }
      );
    } catch (err) {
      console.error("Stream failed:", err);
      setMessages((prev) => {
        const next = [...prev];
        if (next[assistantIndex]) {
          next[assistantIndex] = {
            role: "assistant",
            content: "Sorry, I encountered an issue connecting to the neural processor. Please make sure the backend is active or check my connection.",
          };
        }
        return next;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        content: "Session cleared. How else can I represent Archi Parmar's technical journey today?",
      },
    ]);
  };

  const presetQuestions = [
    "Tell me about Archi.",
    "Explain DocMind AI.",
    "Show Python projects.",
    "What are Archi's strongest skills?",
    "Why should I hire Archi?",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Floating Action Button (FAB) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white flex items-center justify-center cursor-pointer shadow-lg shadow-primary/20 relative"
              aria-label="Open AI Assistant"
            >
              <Bot className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Assistant window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`flex flex-col border border-primary/30 glass-panel shadow-2xl overflow-hidden transition-all duration-300 rounded-2xl relative ${
              isFullscreen
                ? "fixed inset-6 w-auto h-auto z-50"
                : "w-[330px] sm:w-[400px] h-[550px] mb-4"
            }`}
          >
            {/* Header */}
            <div className="bg-slate-950/70 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-border/80">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-secondary animate-pulse" />
                <div>
                  <div className="font-bold text-xs text-white tracking-widest font-mono">ARCHI_NEURAL.AGENT</div>
                  <div className="text-[9px] text-green-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                    <span>RAG_OS ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Window control triggers */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-gray-400 hover:text-white w-7 h-7 rounded-lg"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-red-400 w-7 h-7 rounded-lg"
                  title="Clear Conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white w-7 h-7 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/20">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`relative max-w-[85%] group flex flex-col gap-1.5`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed font-sans ${
                        msg.role === "user"
                          ? "bg-primary text-white rounded-tr-none shadow-md shadow-primary/10"
                          : "bg-input/60 text-slate-100 rounded-tl-none border border-border/80 backdrop-blur-md"
                      }`}
                    >
                      {/* Markdown Parsing */}
                      <div className="prose prose-invert max-w-none text-xs leading-relaxed">
                        {renderMarkdown(msg.content)}
                      </div>
                    </div>

                    {/* Copy button on hover for bot messages */}
                    {msg.role === "assistant" && msg.content && (
                      <button
                        onClick={() => handleCopy(msg.content, i)}
                        className="absolute -bottom-5 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] text-gray-500 hover:text-secondary flex items-center gap-1"
                      >
                        {copiedIndex === i ? (
                          <>
                            <Check className="w-3 h-3 text-green-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Generative Thinking Indicator */}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-input/60 border border-border/80 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Prompt Chips */}
            <div className="px-4 py-2 border-t border-border/40 bg-slate-950/45 flex flex-wrap gap-1.5 select-none shrink-0 overflow-x-auto max-h-[85px]">
              {presetQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  disabled={isGenerating}
                  className="px-2.5 py-1 rounded-full border border-white/5 bg-white/3 hover:bg-primary/10 hover:border-primary/30 text-[10px] text-slate-300 font-mono transition-all duration-200 cursor-pointer disabled:opacity-50 truncate max-w-[200px]"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Text Input Console */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-border/80 bg-slate-950/80 backdrop-blur-md flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about my AI/ML background..."
                disabled={isGenerating}
                className="flex-1 bg-input text-white border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary/50 disabled:opacity-50 font-sans"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isGenerating}
                className="bg-primary hover:bg-primary/95 text-white w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer shrink-0 disabled:opacity-50 shadow-md shadow-primary/15"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
