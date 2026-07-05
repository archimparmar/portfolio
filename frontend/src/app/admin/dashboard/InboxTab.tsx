"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioApi, ContactMessage } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, MailOpen, Trash2, Calendar, User, Eye, AlertCircle } from "lucide-react";

export default function InboxTab() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Fetch messages
  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["messages"],
    queryFn: portfolioApi.getMessages,
  });

  // Mutations
  const readMutation = useMutation({
    mutationFn: portfolioApi.markMessageAsRead,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      if (activeMessage && activeMessage.id === updated.id) {
        setActiveMessage(updated);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: portfolioApi.deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setActiveMessage(null);
      setDeleteConfirmId(null);
    },
  });

  const handleSelectMessage = (msg: ContactMessage) => {
    setActiveMessage(msg);
    if (!msg.is_read) {
      readMutation.mutate(msg.id);
    }
  };

  const filtered = messages?.filter((msg) => {
    const term = searchTerm.toLowerCase();
    return (
      msg.name.toLowerCase().includes(term) ||
      msg.email.toLowerCase().includes(term) ||
      msg.message.toLowerCase().includes(term)
    );
  }) || [];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="border-b border-border/80 pb-4">
        <h1 className="text-2xl font-bold text-white font-display">Contact Inbox</h1>
        <p className="text-gray-400 text-xs">Review incoming client inquiries and recruitment payloads.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-6 h-[70vh] items-stretch">
        
        {/* Left Column - List of Messages (Span 5) */}
        <div className="md:col-span-5 flex flex-col gap-4 overflow-hidden h-full">
          {/* Search */}
          <div className="flex items-center bg-input border border-border rounded-xl px-3 py-1.5 w-full">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by sender/content..."
              className="flex-1 bg-transparent text-white outline-none text-xs"
            />
          </div>

          {/* List Scroll */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400 font-mono text-xs animate-pulse">
                Accessing inbox records...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-mono text-xs flex flex-col items-center gap-1.5">
                <AlertCircle className="w-5 h-5 text-gray-600" />
                <span>Inbox is empty.</span>
              </div>
            ) : (
              filtered.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left relative overflow-hidden ${
                    activeMessage?.id === msg.id
                      ? "bg-accent/20 border-primary/50"
                      : msg.is_read
                      ? "glass-panel border-border hover:border-primary/20"
                      : "glass-panel border-secondary/40 shadow-sm shadow-secondary/5 hover:border-secondary/60"
                  }`}
                >
                  {/* Unread Indicator Bar */}
                  {!msg.is_read && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-secondary animate-pulse" />
                  )}

                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className={`text-xs font-bold font-display truncate max-w-[120px] ${
                      !msg.is_read ? "text-secondary font-extrabold" : "text-white"
                    }`}>
                      {msg.name}
                    </span>
                    <span className="text-[9px] font-mono text-gray-500 shrink-0">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 truncate font-mono">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Message Viewer (Span 7) */}
        <div className="md:col-span-7 h-full">
          {activeMessage ? (
            <Card className="glass-panel border-border p-6 h-full flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-6">
                {/* Meta details */}
                <div className="border-b border-border/60 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-display">{activeMessage.name}</h3>
                      <a href={`mailto:${activeMessage.email}`} className="text-xs text-secondary font-mono hover:underline">{activeMessage.email}</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(activeMessage.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Message Body Content */}
                <div className="bg-input/30 border border-border/50 rounded-xl p-4 min-h-[220px] text-xs font-mono text-gray-200 leading-relaxed overflow-y-auto max-h-[35vh]">
                  {activeMessage.message}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-auto">
                <a href={`mailto:${activeMessage.email}?subject=Re: Portfolio Inquiry`} className="inline-block">
                  <Button size="sm" className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 cursor-pointer">
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </Button>
                </a>

                {deleteConfirmId === activeMessage.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteMutation.mutate(activeMessage.id)}
                      className="text-red-500 hover:underline font-bold text-xs font-mono"
                    >
                      CONFIRM DELETE
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-gray-400 hover:underline text-xs font-mono"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteConfirmId(activeMessage.id)}
                    className="text-gray-400 hover:text-red-400 flex items-center gap-1.5 cursor-pointer rounded-xl border border-transparent"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Message
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card className="glass-panel border-border border-dashed p-6 h-full flex flex-col items-center justify-center text-center text-gray-500 font-mono text-xs">
              <Eye className="w-8 h-8 text-gray-700 mb-2 animate-bounce" />
              <span>Select a message payload from the list to display details.</span>
            </Card>
          )}
        </div>

      </div>

    </div>
  );
}
