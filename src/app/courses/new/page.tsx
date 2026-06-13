"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/dashboard/auth-provider";
import { ShieldAlert, ArrowLeft, Image as ImageIcon, Save, CheckCircle2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { mockCourses } from "@/data/mock-dashboard";

export default function NewCoursePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-zinc-400">You must be an administrator to create courses.</p>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !thumbnailFile) return;

    setIsSaving(true);

    // Simulate API delay
    setTimeout(() => {
      const newCourse = {
        id: `course-${Date.now()}`,
        title,
        description,
        thumbnail: previewUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        totalTopics: 0,
        topics: []
      };

      // In a real app we'd push to backend. For the mock we just mutate the array directly for the demo
      mockCourses.push(newCourse);
      
      // Redirect to the edit page for this new course
      router.push(`/courses/${newCourse.id}/edit`);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 w-full">
      <Link href="/courses" className="inline-flex items-center text-sm text-zinc-400 hover:text-cyan-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Course Builder
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Create New Course
        </h1>
        <p className="text-zinc-400">Define the core details of your new elite learning program.</p>
      </div>

      <form onSubmit={handleCreateCourse} className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl space-y-8">
        
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Course Title</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            type="text" 
            placeholder="e.g. Advanced System Design" 
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            rows={4} 
            required
            placeholder="What will students learn in this course? Provide a compelling overview." 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center">
            <ImageIcon className="w-4 h-4 mr-2" />
            Course Thumbnail (Image Upload)
          </label>
          <div className="border-2 border-dashed border-zinc-700 hover:border-cyan-500 bg-zinc-950 rounded-xl p-6 text-center transition-colors relative group overflow-hidden">
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/webp" 
              onChange={handleImageUpload}
              required
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            />
            
            {previewUrl ? (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${previewUrl}')` }}>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                   <UploadCloud className="w-8 h-8 text-white mb-2" />
                   <p className="text-white font-medium text-sm">Click to change image</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6">
                <UploadCloud className="w-12 h-12 text-zinc-500 group-hover:text-cyan-400 transition-colors mb-3" />
                <p className="text-zinc-300 font-medium mb-1">Click or drag image to upload</p>
                <p className="text-zinc-500 text-sm">JPG, PNG, WebP up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800 flex justify-end">
          <button 
            type="submit" 
            disabled={isSaving || !title || !description}
            className="flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-[0_0_20px_rgba(8,145,178,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <span className="flex items-center">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                Creating...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="w-5 h-5 mr-2" />
                Create Course
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
