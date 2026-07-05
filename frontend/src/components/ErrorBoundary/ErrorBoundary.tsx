"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Uncaught error in ${this.props.sectionName || "ErrorBoundary"}:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="w-full h-48 border border-red-900/30 bg-red-950/20 rounded-xl flex flex-col items-center justify-center p-6 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <div>
            <h3 className="text-red-400 font-semibold text-sm">Failed to load {this.props.sectionName || "section"}</h3>
            <p className="text-red-500/70 font-mono text-[10px] mt-1">{this.state.error?.message}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
