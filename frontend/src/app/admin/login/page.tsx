"use client";

import React, { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, Key, ShieldAlert, AlertTriangle } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import Providers from "@/components/Providers";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login, isLoading } = useAdminAuth(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await login(username, password);
    } catch (err) {
      console.error(err);
      setErrorMsg("INVALID_CREDENTIALS: Log auth authorization rejected by system.");
    }
  };

  return (
    <Providers>
      <div className="relative min-h-screen text-white bg-slate-950 flex flex-col items-center justify-center p-6 select-none font-mono">
        <ParticleBackground />

        {/* Login Form Panel */}
        <Card className="max-w-md w-full glass-panel border-primary/30 rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl">
          <div className="bg-primary/10 border-b border-primary/20 px-6 py-3 -mx-8 -mt-8 rounded-t-2xl flex items-center gap-2 mb-6">
            <Terminal className="w-5 h-5 text-secondary animate-pulse" />
            <div>
              <span className="text-xs font-bold text-white tracking-widest block font-display">ARCHI_CORE.CMS</span>
              <span className="text-[9px] text-gray-400">ADMINISTRATOR GATEWAY</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="user" className="text-xs font-mono text-gray-400">IDENTIFIER</label>
              <input
                id="user"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-input text-white border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors"
                placeholder="Enter username"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="pass" className="text-xs font-mono text-gray-400">SECURE PASSWORD</label>
              <input
                id="pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-input text-white border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors"
                placeholder="Enter password"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-[10px] flex items-start gap-2 leading-relaxed">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              <Key className="w-4 h-4" />
              {isLoading ? "Authenticating..." : "Establish Connection"}
            </Button>

          </form>
        </Card>
      </div>
    </Providers>
  );
}
