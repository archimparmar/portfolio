"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi, BlogPost } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Calendar, Clock, ChevronRight } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import Providers from "@/components/Providers";

export default function BlogListPage() {
  const { data: dbPosts } = useQuery<BlogPost[]>({
    queryKey: ["blog-posts"],
    queryFn: portfolioApi.getBlogPosts,
  });

  const defaultPosts: BlogPost[] = [
    {
      id: 1,
      title: "Developing Enterprise RAG Systems with FastAPI & FAISS",
      slug: "developing-enterprise-rag-systems",
      content: "Detailed analysis of RAG architectures...",
      excerpt: "Learn how to build a production-ready Retrieval-Augmented Generation chatbot using Python, FastAPI, and FAISS for semantic document searching.",
      cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
      tags: ["RAG Systems", "FastAPI", "FAISS", "Generative AI"],
      published_at: new Date().toISOString(),
      is_draft: false,
    },
    {
      id: 2,
      title: "Optimal Chunking Strategies in PDF Document Vector Indexing",
      slug: "optimal-chunking-strategies-vector-indexing",
      content: "Evaluating different chunking strategies...",
      excerpt: "Deep dive into hierarchical and overlapping text chunking models when splitting document text to improve embeddings quality and retrieval accuracy.",
      cover_image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
      tags: ["Vector DB", "Embeddings", "Data Science", "Python"],
      published_at: new Date().toISOString(),
      is_draft: false,
    },
  ];

  const posts = dbPosts && dbPosts.length > 0 ? dbPosts : defaultPosts;

  return (
    <Providers>
      <div className="relative min-h-screen text-white bg-slate-950 px-6 py-24 select-none">
        <ParticleBackground />

        <div className="max-w-4xl mx-auto relative z-10 space-y-12">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white flex items-center gap-1.5 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary glow-text" />
              <span className="font-bold font-display tracking-wider">ARCHI_LOGS.EXE</span>
            </div>
          </div>

          <div className="border-b border-border/80 pb-6">
            <h1 className="text-4xl font-extrabold font-display text-white mb-2">Technical Journal</h1>
            <p className="text-gray-400 text-sm">Deep dives on Generative AI, RAG architecture, and full-stack software development.</p>
          </div>

          {/* Posts Grid */}
          <div className="grid gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="glass-panel border-border p-6 hover:border-primary/20 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.published_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      5 min read
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white font-display mb-2 group-hover:text-secondary transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags && post.tags.map((tag, idx) => (
                      <Badge key={idx} className="bg-muted text-gray-400 font-mono text-[9px] px-2 py-0.5 border-border">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <span className="text-xs text-primary font-mono font-bold flex items-center gap-1 group-hover:text-secondary transition-colors">
                      Read Entry
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </Providers>
  );
}
