"use client";

import { useState, useEffect } from "react";
import { mockMentorshipQA, mockCourses, MentorshipQA, QAReply } from "@/data/mock-dashboard";
import { useAuth } from "@/components/dashboard/auth-provider";
import { MessageSquarePlus, Send, UserCircle2, ShieldCheck, CheckCircle2, BookOpen, ChevronDown, ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QAPortal() {
  const { user } = useAuth();
  // Clear local storage logic could be added here, but we will just handle mapping gracefully.
  const [qaList, setQaList] = useState<MentorshipQA[]>(mockMentorshipQA);
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionImages, setNewQuestionImages] = useState<string[]>([]);

  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyImages, setReplyImages] = useState<Record<string, string[]>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    mockMentorshipQA.forEach((qa, idx) => {
      if (idx === 0) initial[qa.id] = true; // Open the first discussion by default
    });
    return initial;
  });

  const toggleAccordion = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (base64s: string[]) => void) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const promises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const base64s = await Promise.all(promises);
    callback(base64s);
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() && newQuestionImages.length === 0) return;

    const newEntry: MentorshipQA = {
      id: `qa-${Date.now()}`,
      studentName: user?.name || "Student",
      courseId: "course-fullstack", // Mock
      question: newQuestion,
      imageUrls: newQuestionImages.length > 0 ? newQuestionImages : undefined,
      replies: [],
      status: "pending",
      date: new Date().toISOString().split("T")[0]
    };

    setQaList([newEntry, ...qaList]);
    setNewQuestion("");
    setNewQuestionImages([]);
    setExpandedIds(prev => ({ ...prev, [newEntry.id]: true })); // Auto-open new questions
  };

  const handleReply = (qaId: string) => {
    const replyContent = replyText[qaId] || "";
    const replyImgs = replyImages[qaId];
    if ((!replyContent.trim() && (!replyImgs || replyImgs.length === 0)) || !user) return;

    const timestamp = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

    const newReply: QAReply = {
      id: `rep-${Date.now()}`,
      authorName: user.name,
      authorRole: user.role as "student" | "mentor" | "admin",
      content: replyContent,
      imageUrls: replyImgs && replyImgs.length > 0 ? replyImgs : undefined,
      date: timestamp
    };

    setQaList(prevList =>
      prevList.map(qa => {
        if (qa.id === qaId) {
          // Normalize old data structure if needed
          const existingReplies = qa.replies || [];
          return {
            ...qa,
            replies: [...existingReplies, newReply],
            status: user.role === 'mentor' ? "answered" : qa.status
          };
        }
        return qa;
      })
    );

    // Clear reply box and images
    setReplyText(prev => ({ ...prev, [qaId]: "" }));
    setReplyImages(prev => ({ ...prev, [qaId]: [] }));
  };

  return (
    <div className="w-full pb-12 ">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-6">Mentorship Q&A</h1>
        <p className="text-zinc-400">
          {user?.role === "student" ? "Ask questions and get direct answers from your elite mentors." : "Review and answer questions from your assigned mentees."}
        </p>
      </div>

      {user?.role === "student" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-10 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <MessageSquarePlus className="w-5 h-5 mr-2 text-cyan-400" />
            Ask a new question
          </h2>
          <form onSubmit={handleAskQuestion}>
            {newQuestionImages.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-3">
                {newQuestionImages.map((img, idx) => (
                  <div key={idx} className="relative inline-block">
                    <img src={img} alt="Attachment Preview" className="h-20 w-20 rounded-lg border border-zinc-700 object-cover" />
                    <button
                      onClick={() => setNewQuestionImages(prev => prev.filter((_, i) => i !== idx))}
                      type="button"
                      className="absolute -top-2 -right-2 bg-zinc-800 text-zinc-400 hover:text-white p-1 rounded-full border border-zinc-700 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Describe your doubt in detail. Mention the topic or code snippet if relevant..."
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all custom-scrollbar"
            />
            <div className="flex justify-between items-center mt-3 pt-3">
              <label className="cursor-pointer px-4 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:text-cyan-400 hover:bg-cyan-400/30 transition-all flex items-center gap-2 text-sm font-medium" title="Attach screenshots">
                <ImageIcon className="w-4 h-4" />
                <span>Attach Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, (base64s) => setNewQuestionImages(prev => [...prev, ...base64s]))}
                />
              </label>
              <button
                type="submit"
                disabled={!newQuestion.trim() && newQuestionImages.length === 0}
                className="px-6 py-2 text-sm font-semibold rounded-lg bg-cyan-400 text-zinc-950 font-bold hover:bg-cyan-500 transition-colors inline-flex items-center disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Question
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white mb-4">Recent Discussions</h2>

        {qaList.map((qa) => {
          const course = mockCourses.find(c => c.id === qa.courseId);

          return (
            <div key={qa.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all duration-200">
              <div
                className="p-6 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                onClick={() => toggleAccordion(qa.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0">
                      <UserCircle2 className="w-10 h-10 text-zinc-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-1 gap-2 sm:gap-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <span className="font-semibold text-white">{qa.studentName}</span>
                          {course && (
                            <span className="flex items-center text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 bg-cyan-400/15 px-2 py-0.5 rounded whitespace-nowrap">
                              <BookOpen className="w-3 h-3 mr-1 shrink-0 text-cyan-700 dark:text-cyan-400" />
                              <span className="truncate max-w-[150px] sm:max-w-none">{course.title}</span>
                            </span>
                          )}
                          {!expandedIds[qa.id] && qa.replies.length > 0 && (
                            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                              {qa.replies.length} {qa.replies.length === 1 ? 'Reply' : 'Replies'}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-zinc-500 shrink-0">{qa.date}</span>
                      </div>
                      <p className={`text-zinc-300 ${!expandedIds[qa.id] ? 'line-clamp-2' : ''}`}>{qa.question}</p>
                      {qa.imageUrls && qa.imageUrls.length > 0 && (
                        <div className={`mt-3 flex flex-wrap gap-2 ${!expandedIds[qa.id] ? 'hidden' : ''}`}>
                          {qa.imageUrls.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Attached screenshot ${idx + 1}`}
                              className="h-20 w-20 rounded-lg border border-zinc-800 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => setSelectedImage(img)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 pt-2 text-zinc-500">
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedIds[qa.id] ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {expandedIds[qa.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    {/* Threaded Replies */}
                    {(qa.replies || []).map((reply, index) => {
                      const isMentor = reply.authorRole === 'mentor' || reply.authorRole === 'admin';
                      return (
                        <div key={reply.id} className="bg-zinc-950 border-t border-zinc-800 p-4 sm:p-6 pl-12 sm:pl-20 relative">
                          {/* Connecting Line (except for the last item if it's the only one) */}
                          <div className="absolute left-5 sm:left-8 top-0 bottom-0 w-px bg-zinc-800" />

                          <div className="flex items-start gap-3 sm:gap-4 relative">
                            <div className={`flex-shrink-0 absolute -left-9 sm:-left-16 bg-zinc-950 p-1 rounded-full ${isMentor ? 'text-cyan-500' : 'text-zinc-500'}`}>
                              {isMentor ? <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" /> : <UserCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center">
                                  <span className={`font-semibold mr-2 ${isMentor ? 'text-cyan-400' : 'text-zinc-300'}`}>
                                    {reply.authorName}
                                  </span>
                                  {isMentor && <CheckCircle2 className="w-4 h-4 text-cyan-500 mr-2" />}
                                </div>
                                <span className="text-xs text-zinc-500 shrink-0">{reply.date}</span>
                              </div>
                              <p className="text-zinc-400 whitespace-pre-wrap">{reply.content}</p>
                              {reply.imageUrls && reply.imageUrls.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {reply.imageUrls.map((img, idx) => (
                                    <img
                                      key={idx}
                                      src={img}
                                      alt={`Attached screenshot ${idx + 1}`}
                                      className="h-20 w-20 rounded-lg border border-zinc-800 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={() => setSelectedImage(img)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Reply Input Box (Available to both Mentor and Student) */}
                    <div className={`bg-zinc-950 p-4 sm:p-6 ${(qa.replies && qa.replies.length > 0) ? 'pt-0 pl-12 sm:pl-20 relative' : 'border-t border-zinc-800'}`}>
                      {(qa.replies && qa.replies.length > 0) && <div className="absolute left-5 sm:left-8 top-0 bottom-0 w-px bg-zinc-800" />}
                      <div className={`flex items-start gap-3 sm:gap-4 ${(qa.replies && qa.replies.length > 0) ? 'relative' : ''}`}>
                        {!(qa.replies && qa.replies.length > 0) && (
                          <div className="flex-shrink-0">
                            {user?.role === 'mentor' ? <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-500" /> : <UserCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-500" />}
                          </div>
                        )}
                        <div className="flex-1">
                          {replyImages[qa.id] && replyImages[qa.id].length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-3">
                              {replyImages[qa.id].map((img, idx) => (
                                <div key={idx} className="relative inline-block">
                                  <img src={img} alt="Attachment Preview" className="h-16 w-16 rounded-lg border border-zinc-800 object-cover" />
                                  <button
                                    onClick={() => setReplyImages(p => ({ ...p, [qa.id]: p[qa.id].filter((_, i) => i !== idx) }))}
                                    type="button"
                                    className="absolute -top-2 -right-2 bg-zinc-800 text-zinc-400 hover:text-white p-1 rounded-full border border-zinc-700 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <textarea
                            value={replyText[qa.id] || ""}
                            onChange={(e) => setReplyText({ ...replyText, [qa.id]: e.target.value })}
                            placeholder={(qa.replies && qa.replies.length > 0) ? "Write a reply..." : (user?.role === 'mentor' ? "Type your reply to the student here..." : "Add more context to your question...")}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-300 focus:outline-none focus:border-cyan-500 transition-all min-h-[80px] mb-3 text-sm custom-scrollbar"
                          />
                          <div className="flex justify-between items-center">
                            {user?.role === "student" && !(qa.replies && qa.replies.length > 0) ? (
                              <p className="text-xs text-zinc-500 italic flex items-center">
                                Waiting for mentor reply...
                              </p>
                            ) : <div></div>}

                            <div className="flex justify-between items-center w-full mt-2">
                              <label className="cursor-pointer px-4 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:text-cyan-400 hover:bg-cyan-400/30 transition-all flex items-center gap-2 text-sm font-medium" title="Attach screenshots">
                                <ImageIcon className="w-4 h-4" />
                                <span>Attach Images</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={(e) => handleImageUpload(e, (base64s) => setReplyImages(p => ({ ...p, [qa.id]: [...(p[qa.id] || []), ...base64s] })))}
                                />
                              </label>
                              <button
                                onClick={() => handleReply(qa.id)}
                                disabled={(!replyText[qa.id]?.trim() && (!replyImages[qa.id] || replyImages[qa.id].length === 0))}
                                className="px-6 py-2 text-sm font-semibold rounded-lg bg-cyan-400 text-zinc-950 font-bold hover:bg-cyan-500 transition-colors disabled:opacity-50"
                              >
                                Post Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 sm:top-8 sm:right-8 text-zinc-400 hover:text-white bg-zinc-900/80 rounded-full p-2 transition-colors z-[110] cursor-pointer"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Fullscreen Attachment"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
