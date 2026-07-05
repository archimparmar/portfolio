"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi, BlogPost } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Terminal } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import Providers from "@/components/Providers";

export default function BlogPostDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: dbPost, isLoading } = useQuery<BlogPost>({
    queryKey: ["blog-post", slug],
    queryFn: () => portfolioApi.getBlogPostBySlug(slug),
    enabled: !!slug,
  });

  const defaultPost: BlogPost = {
    id: 1,
    title: "Developing Enterprise RAG Systems with FastAPI & FAISS",
    slug: "developing-enterprise-rag-systems",
    content: `
Retrieval-Augmented Generation (RAG) has become the gold standard for deploying Large Language Models in corporate settings where data accuracy is paramount. By linking pre-trained LLMs to an external, validated vector database, we can drastically reduce model hallucinations and enforce structural information retrieval boundaries.

### Core RAG Pipeline Architecture
A standard enterprise RAG system is comprised of three key phases:

1. **Document Ingestion and Parsing**:
   Extracting text payload from unstructured file sources (PDFs, Docx, HTML). In Python, this is commonly done using specialized libraries like PyPDF2, pdfplumber, or direct docx parsers.

2. **Text Chunking and Embeddings**:
   Since models have context size ceilings and to avoid losing local contextual focus, text is split into chunks (e.g., 500 characters with 50-character overlap). These chunks are processed by embedding models (like OpenAI's text-embedding-ada or Gemini's embeddings) to output a 1536/768 dimensional vector representing semantic meaning.

3. **Vector Vector Database Indexing**:
   The vectors are stored in index structures like FAISS, Pinecone, or pgvector. FAISS (Facebook AI Similarity Search) is extremely fast for local clustering and nearest-neighbor vector checks.

### Integrating FastAPI for API queries
FastAPI's asynchronous handlers make it the perfect wrapper for heavy model lookups. An endpoint accepts query queries, embeds them, runs similarity queries in the vector db, extracts matching chunks, formats them into a prompt system directive, and forwards them to Gemini API for final response generation.
    `,
    excerpt: "Learn how to build a production-ready Retrieval-Augmented Generation chatbot using Python, FastAPI, and FAISS.",
    cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    tags: ["RAG Systems", "FastAPI", "FAISS", "Generative AI"],
    published_at: new Date().toISOString(),
    is_draft: false,
  };

  const post = dbPost || defaultPost;

  return (
    <Providers>
      <div className="relative min-h-screen text-white bg-slate-950 px-6 py-24 select-none">
        <ParticleBackground />

        <div className="max-w-3xl mx-auto relative z-10 space-y-8">
          
          {/* Header navigation */}
          <div className="flex items-center justify-between">
            <Link href="/blog">
              <Button variant="ghost" className="text-gray-300 hover:text-white flex items-center gap-1.5 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                All Journal Entries
              </Button>
            </Link>

            <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
              <Terminal className="w-4 h-4 text-primary" />
              <span>ENTRY_VIEWER.SH</span>
            </div>
          </div>

          {/* Article Info */}
          <article className="space-y-6">
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {post.tags && post.tags.map((tag, idx) => (
                  <Badge key={idx} className="bg-accent/20 text-secondary border-secondary/20 font-mono text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight text-white">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.published_at).toLocaleDateString()}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  8 min read
                </span>
              </div>
            </div>

            {post.cover_image && (
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-border/80">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Markdown content parser (rendered dynamically) */}
            <div className="prose prose-invert max-w-none text-gray-300 space-y-6 leading-relaxed font-sans text-sm sm:text-base pt-6 border-t border-border/50">
              {post.content.split("\n\n").map((para, idx) => {
                if (para.startsWith("###")) {
                  return (
                    <h3 key={idx} className="text-xl font-bold text-white font-display pt-4">
                      {para.replace("###", "").trim()}
                    </h3>
                  );
                }
                if (para.trim().startsWith("1.") || para.trim().startsWith("-")) {
                  return (
                    <div key={idx} className="pl-6 font-mono text-xs text-gray-200 border-l border-primary/20 space-y-2 py-2">
                      {para.split("\n").map((line, lidx) => (
                        <p key={lidx}>{line}</p>
                      ))}
                    </div>
                  );
                }
                return <p key={idx}>{para.trim()}</p>;
              })}
            </div>

          </article>

        </div>
      </div>
    </Providers>
  );
}
