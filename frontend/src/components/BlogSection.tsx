"use client";

import React from "react";
import Link from "next/link";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi, BlogPost } from "@/services/api";
import { motion } from "framer-motion";
import {
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/hooks/useScrollReveal";
import { EmptyState } from "./EmptyState";



export default function BlogSection() {
  const { data: dbPosts } = useQuery<BlogPost[]>({
    queryKey: ["blog-posts"],
    queryFn: portfolioApi.getBlogPosts,
  });



  const recentPosts = dbPosts ? dbPosts.slice(0, 2) : [];

  return (
    <section id="blog" className="py-28 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="section-title-badge">
            <BookOpen className="w-3.5 h-3.5" />
            Technical Journal
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent" />
        </motion.div>

        {!dbPosts ? (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[1, 2].map((i) => (
              <Card key={i} className="h-48 animate-pulse bg-gray-900/50" />
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <EmptyState icon={<BookOpen />} message="Check back later for new technical insights." />
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="glass-panel border-border p-6 h-full hover:border-primary/40 transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.published_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white font-display mb-3 group-hover:text-secondary transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                  </div>
                  
                  <div className="relative z-10 flex items-center text-primary text-xs font-mono font-bold group-hover:translate-x-2 transition-transform">
                    READ_ENTRY <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {dbPosts && dbPosts.length > 0 && (
          <div className="flex justify-center">
            <Link href="/blog">
              <Button variant="outline" className="border-primary/20 text-white hover:bg-primary/10 rounded-full px-8 py-6 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                View All Journal Entries
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
