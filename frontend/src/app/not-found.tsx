"use client";

import React from "react";
import Link from "next/link";
import { Terminal, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleBackground from "@/components/ParticleBackground";
import Providers from "@/components/Providers";

export default function NotFound() {
  return (
    <Providers>
      <div className="relative min-h-screen text-white bg-slate-950 flex flex-col items-center justify-center p-6 select-none font-mono">
        <ParticleBackground />
        
        {/* Error panel */}
        <div className="max-w-md w-full glass-panel border-red-500/30 rounded-2xl p-6 relative z-10 shadow-2xl">
          <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 -mx-6 -mt-6 rounded-t-2xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-400">CRITICAL_SYSTEM_ERROR</span>
          </div>

          <div className="space-y-4 mt-6">
            <div className="text-4xl font-extrabold text-red-500 tracking-wider">404</div>
            <div className="text-sm text-gray-300">
              [LOG_ERR] The specified route descriptor could not be resolved by the App Router.
            </div>
            
            <div className="bg-slate-950/60 rounded-xl p-4 text-[11px] text-green-400 space-y-1 border border-border">
              <p>&gt; sys_verify_route --path current_url</p>
              <p className="text-red-400">&gt;&gt; ERROR: 0x0002_ROUTE_NOT_FOUND</p>
              <p>&gt; loading recovery protocols...</p>
            </div>

            <Link href="/" className="block">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                Initialize Main OS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Providers>
  );
}
