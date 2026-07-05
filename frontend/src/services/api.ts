import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto attach Authorization header if JWT token is stored in localStorage
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin-token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  preview_image_url?: string;
  github_url?: string;
  demo_url?: string;
  features?: string[];
  is_featured: boolean;
  display_order: number;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
  is_active: boolean;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  duration: string;
  description: string;
  logo_url?: string;
  display_order: number;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  duration: string;
  description?: string;
  display_order: number;
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  credential_url?: string;
  image_url?: string;
  date?: string;
  display_order: number;
}

export interface ResearchPaper {
  id: number;
  title: string;
  journal: string;
  doi?: string;
  publication_date: string;
  description?: string;
  url?: string;
  badge?: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon_name?: string;
  date?: string;
  display_order: number;
}

export interface SocialLink {
  id: number;
  name: string;
  url: string;
  icon_name?: string;
}

export interface TechnicalEvent {
  id: number;
  title: string;
  date: string;
  organizer?: string;
  role?: string;
  outcome?: string;
  display_order: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  tags?: string[];
  published_at: string;
  is_draft: boolean;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface MediaAsset {
  id: number;
  filename: string;
  url: string;
  size_bytes: number;
  mime_type: string;
  uploaded_at: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  message: string;
}

export const portfolioApi = {
  // --- Public Portfolio Reads ---
  getProjects: async () => {
    const res = await apiClient.get<Project[]>("/portfolio/projects");
    return res.data;
  },
  getSkills: async () => {
    const res = await apiClient.get<Skill[]>("/portfolio/skills");
    return res.data;
  },
  getExperiences: async () => {
    const res = await apiClient.get<Experience[]>("/portfolio/experiences");
    return res.data;
  },
  getEducation: async () => {
    const res = await apiClient.get<Education[]>("/portfolio/education");
    return res.data;
  },
  getCertifications: async () => {
    const res = await apiClient.get<Certification[]>("/portfolio/certifications");
    return res.data;
  },
  getResearchPapers: async () => {
    const res = await apiClient.get<ResearchPaper[]>("/portfolio/research-papers");
    return res.data;
  },
  getAchievements: async () => {
    const res = await apiClient.get<Achievement[]>("/portfolio/achievements");
    return res.data;
  },
  getSocialLinks: async () => {
    const res = await apiClient.get<SocialLink[]>("/portfolio/social-links");
    return res.data;
  },
  getTechnicalEvents: async () => {
    const res = await apiClient.get<TechnicalEvent[]>("/portfolio/technical-events");
    return res.data;
  },
  getSiteSettings: async () => {
    const res = await apiClient.get<Record<string, string>>("/portfolio/site-settings");
    return res.data;
  },
  submitContact: async (data: ContactMessageInput) => {
    const res = await apiClient.post("/contact/", data);
    return res.data;
  },
  getBlogPosts: async () => {
    const res = await apiClient.get<BlogPost[]>("/blog/posts");
    return res.data;
  },
  getBlogPostBySlug: async (slug: string) => {
    const res = await apiClient.get<BlogPost>(`/blog/posts/${slug}`);
    return res.data;
  },

  // --- Authentication ---
  adminLogin: async (params: URLSearchParams) => {
    const res = await apiClient.post<{ access_token: string; token_type: string }>(
      "/auth/login",
      params.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },

  // --- Admin CRUD Operations ---
  // Projects
  createProject: async (data: Omit<Project, "id">) => {
    const res = await apiClient.post<Project>("/admin/projects", data);
    return res.data;
  },
  updateProject: async (id: number, data: Partial<Project>) => {
    const res = await apiClient.put<Project>(`/admin/projects/${id}`, data);
    return res.data;
  },
  deleteProject: async (id: number) => {
    await apiClient.delete(`/admin/projects/${id}`);
  },

  // Skills
  createSkill: async (data: Omit<Skill, "id">) => {
    const res = await apiClient.post<Skill>("/admin/skills", data);
    return res.data;
  },
  updateSkill: async (id: number, data: Partial<Skill>) => {
    const res = await apiClient.put<Skill>(`/admin/skills/${id}`, data);
    return res.data;
  },
  deleteSkill: async (id: number) => {
    await apiClient.delete(`/admin/skills/${id}`);
  },

  // Experiences
  createExperience: async (data: Omit<Experience, "id">) => {
    const res = await apiClient.post<Experience>("/admin/experiences", data);
    return res.data;
  },
  updateExperience: async (id: number, data: Partial<Experience>) => {
    const res = await apiClient.put<Experience>(`/admin/experiences/${id}`, data);
    return res.data;
  },
  deleteExperience: async (id: number) => {
    await apiClient.delete(`/admin/experiences/${id}`);
  },

  // Education
  createEducation: async (data: Omit<Education, "id">) => {
    const res = await apiClient.post<Education>("/admin/education", data);
    return res.data;
  },
  updateEducation: async (id: number, data: Partial<Education>) => {
    const res = await apiClient.put<Education>(`/admin/education/${id}`, data);
    return res.data;
  },
  deleteEducation: async (id: number) => {
    await apiClient.delete(`/admin/education/${id}`);
  },

  // Certifications
  createCertification: async (data: Omit<Certification, "id">) => {
    const res = await apiClient.post<Certification>("/admin/certifications", data);
    return res.data;
  },
  updateCertification: async (id: number, data: Partial<Certification>) => {
    const res = await apiClient.put<Certification>(`/admin/certifications/${id}`, data);
    return res.data;
  },
  deleteCertification: async (id: number) => {
    await apiClient.delete(`/admin/certifications/${id}`);
  },

  // Research Papers
  createResearchPaper: async (data: Omit<ResearchPaper, "id">) => {
    const res = await apiClient.post<ResearchPaper>("/admin/research-papers", data);
    return res.data;
  },
  updateResearchPaper: async (id: number, data: Partial<ResearchPaper>) => {
    const res = await apiClient.put<ResearchPaper>(`/admin/research-papers/${id}`, data);
    return res.data;
  },
  deleteResearchPaper: async (id: number) => {
    await apiClient.delete(`/admin/research-papers/${id}`);
  },

  // Achievements
  createAchievement: async (data: Omit<Achievement, "id">) => {
    const res = await apiClient.post<Achievement>("/admin/achievements", data);
    return res.data;
  },
  updateAchievement: async (id: number, data: Partial<Achievement>) => {
    const res = await apiClient.put<Achievement>(`/admin/achievements/${id}`, data);
    return res.data;
  },
  deleteAchievement: async (id: number) => {
    await apiClient.delete(`/admin/achievements/${id}`);
  },

  // Technical Events
  createTechnicalEvent: async (data: Omit<TechnicalEvent, "id">) => {
    const res = await apiClient.post<TechnicalEvent>("/admin/technical-events", data);
    return res.data;
  },
  updateTechnicalEvent: async (id: number, data: Partial<TechnicalEvent>) => {
    const res = await apiClient.put<TechnicalEvent>(`/admin/technical-events/${id}`, data);
    return res.data;
  },
  deleteTechnicalEvent: async (id: number) => {
    await apiClient.delete(`/admin/technical-events/${id}`);
  },

  // Blog Posts Admin
  getAllBlogPostsAdmin: async () => {
    const res = await apiClient.get<BlogPost[]>("/admin/blog/posts");
    return res.data;
  },
  createBlogPost: async (data: Omit<BlogPost, "id" | "published_at">) => {
    const res = await apiClient.post<BlogPost>("/admin/blog/posts", data);
    return res.data;
  },
  updateBlogPost: async (id: number, data: Partial<BlogPost>) => {
    const res = await apiClient.put<BlogPost>(`/admin/blog/posts/${id}`, data);
    return res.data;
  },
  deleteBlogPost: async (id: number) => {
    await apiClient.delete(`/admin/blog/posts/${id}`);
  },

  // Contact Messages Admin
  getMessages: async () => {
    const res = await apiClient.get<ContactMessage[]>("/admin/contact-messages");
    return res.data;
  },
  markMessageAsRead: async (id: number) => {
    const res = await apiClient.put<ContactMessage>(`/admin/contact-messages/${id}/read`);
    return res.data;
  },
  deleteMessage: async (id: number) => {
    await apiClient.delete(`/admin/contact-messages/${id}`);
  },

  // Site Settings Admin
  updateSiteSetting: async (key: string, value: string) => {
    const res = await apiClient.put("/admin/site-settings", { key, value });
    return res.data;
  },

  // Media Asset Manager
  getMedia: async () => {
    const res = await apiClient.get<MediaAsset[]>("/admin/media");
    return res.data;
  },
  uploadMedia: async (formData: FormData) => {
    const res = await apiClient.post<MediaAsset>("/admin/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  deleteMedia: async (id: number) => {
    await apiClient.delete(`/admin/media/${id}`);
  },

  // --- AI Personal Representative Agent ---
  chatStream: async (
    message: string,
    history: Array<{ role: string; content: string }>,
    onChunk: (text: string) => void,
    onReferences?: (refs: any[]) => void
  ) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message, history }),
    });

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      // Keep last incomplete line
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const rawData = line.slice(6);
          if (rawData.trim() === "[DONE]") continue;

          try {
            const parsed = JSON.parse(rawData);
            if (parsed.references && onReferences) {
              onReferences(parsed.references);
              continue;
            }
          } catch (e) {
            // Not JSON — treat as text chunk
          }
          onChunk(rawData);
        }
      }
    }
  },
  rebuildAIContext: async () => {
    const res = await apiClient.post("/ai/context/rebuild");
    return res.data;
  },
  uploadResumeToAI: async (formData: FormData) => {
    const res = await apiClient.post("/ai/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
