"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioApi, MediaAsset } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Copy, Check, File, Image, AlertCircle } from "lucide-react";

export default function MediaTab() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch Media Assets
  const { data: mediaList, isLoading } = useQuery<MediaAsset[]>({
    queryKey: ["media"],
    queryFn: portfolioApi.getMedia,
  });

  // Mutations
  const uploadMutation = useMutation({
    mutationFn: portfolioApi.uploadMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      setIsUploading(false);
    },
    onError: (err) => {
      console.error(err);
      setIsUploading(false);
      alert("Upload failed. Make sure server is online.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: portfolioApi.deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    uploadMutation.mutate(formData);
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    // Generate absolute path or keep relative based on deployment
    const fullUrl = `${window.location.origin.replace("3000", "8000")}${asset.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this media asset? Unused references will break.")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="border-b border-border/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Media Library</h1>
          <p className="text-gray-400 text-xs">Upload and manage local image, pdf, and document attachments.</p>
        </div>
        
        {/* Upload Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,application/pdf"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1.5 cursor-pointer rounded-xl py-5 shadow-lg shadow-primary/20"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading File..." : "Upload Asset"}
          </Button>
        </div>
      </div>

      {/* Grid Library List */}
      {isLoading ? (
        <div className="p-12 text-center text-gray-400 font-mono text-xs animate-pulse">
          Opening media storage files...
        </div>
      ) : !mediaList || mediaList.length === 0 ? (
        <Card className="glass-panel border-border border-dashed p-12 text-center text-gray-500 font-mono text-xs flex flex-col items-center justify-center gap-2">
          <AlertCircle className="w-6 h-6 text-gray-700" />
          <span>No media files uploaded yet. Drag or click Upload above.</span>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaList.map((asset) => {
            const isImage = asset.mime_type.startsWith("image/");
            // Form static URL referring to API backend
            const assetUrl = `${window.location.origin.replace("3000", "8000")}${asset.url}`;

            return (
              <Card
                key={asset.id}
                className="glass-panel border-border p-3 overflow-hidden flex flex-col justify-between group relative select-none hover:border-primary/20 transition-all duration-300 h-64"
              >
                
                {/* Preview Box */}
                <div className="flex-1 w-full bg-slate-950 border border-border/40 rounded-lg overflow-hidden flex items-center justify-center relative shadow-inner">
                  {isImage ? (
                    <img
                      src={assetUrl}
                      alt={asset.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <File className="w-8 h-8 text-primary" />
                      <span className="text-[10px] text-gray-400 font-mono tracking-wide">PDF DOCUMENT</span>
                    </div>
                  )}
                </div>

                {/* Details Footer */}
                <div className="mt-3 space-y-2">
                  <div className="text-[10px] font-mono text-white truncate max-w-full font-bold">
                    {asset.filename}
                  </div>
                  <div className="flex items-center justify-between text-[8px] font-mono text-gray-500">
                    <span>{(asset.size_bytes / 1024).toFixed(1)} KB</span>
                    <span>{new Date(asset.uploaded_at).toLocaleDateString()}</span>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2 border-t border-border/40 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleCopyUrl(asset)}
                      className="flex-1 bg-muted hover:bg-muted/70 text-gray-300 text-[10px] rounded-lg font-mono flex items-center justify-center gap-1 cursor-pointer py-1.5 h-8"
                    >
                      {copiedId === asset.id ? (
                        <>
                          <Check className="w-3 h-3 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(asset.id)}
                      className="text-gray-400 hover:text-red-400 rounded-lg border border-transparent py-1.5 h-8 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
}
