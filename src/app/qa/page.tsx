"use client";

import { useState } from "react";
import { mockMentorshipQA, mockCourses } from "@/data/mock-dashboard";
import { useAuth } from "@/components/dashboard/auth-provider";
import { MessageSquarePlus, Send, UserCircle2, ShieldCheck, CheckCircle2, BookOpen } from "lucide-react";

export default function QAPortal() {
  const { user } = useAuth();
  const [qaList, setQaList] = useState(mockMentorshipQA);
  const [newQuestion, setNewQuestion] = useState("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newEntry = {
      id: `qa-${Date.now()}`,
      studentName: user?.name || "Student",
      courseId: "course-fullstack", // Mock
      question: newQuestion,
      mentorReply: null,
      status: "pending",
      date: new Date().toISOString().split("T")[0]
    };

    setQaList([newEntry, ...qaList]);
    setNewQuestion("");
  };

  const handleMentorReply = (qaId: string) => {
    const reply = replyText[qaId];
    if (!reply || !reply.trim()) return;

    const timestamp = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    const formattedReply = `[${timestamp}]\n${reply}`;

    setQaList(prevList => 
      prevList.map(qa => 
        qa.id === qaId 
          ? { 
              ...qa, 
              mentorReply: qa.mentorReply ? `${qa.mentorReply}\n\n${formattedReply}` : formattedReply, 
              status: "answered" 
            } 
          : qa
      )
    );
    
    // Clear reply box
    setReplyText(prev => ({ ...prev, [qaId]: "" }));
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mentorship Q&A</h1>
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
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Describe your doubt in detail. Mention the topic or code snippet if relevant..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all min-h-[100px] mb-4"
            />
            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={!newQuestion.trim()}
                className="px-6 py-2 rounded-lg font-medium bg-cyan-600 text-white hover:bg-cyan-500 transition-colors inline-flex items-center disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Question
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Discussions</h2>
        
        {qaList.map((qa) => {
          const course = mockCourses.find(c => c.id === qa.courseId);
          
          return (
          <div key={qa.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <UserCircle2 className="w-10 h-10 text-zinc-500" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-1 gap-2 sm:gap-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-semibold text-white">{qa.studentName}</span>
                      {course && (
                        <span className="flex items-center text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/50 border border-cyan-900/50 px-2 py-0.5 rounded whitespace-nowrap">
                          <BookOpen className="w-3 h-3 mr-1 shrink-0" />
                          <span className="truncate max-w-[150px] sm:max-w-none">{course.title}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500 shrink-0">{qa.date}</span>
                  </div>
                  <p className="text-zinc-300 mb-4">{qa.question}</p>
                </div>
              </div>
            </div>

            {qa.mentorReply && (
              <div className="bg-zinc-950 border-t border-zinc-800 p-4 sm:p-6 pl-12 sm:pl-20 relative">
                <div className="absolute left-5 sm:left-8 top-0 bottom-0 w-px bg-zinc-800" />
                <div className="flex items-start gap-3 sm:gap-4 relative">
                  <div className="flex-shrink-0 absolute -left-9 sm:-left-16 bg-zinc-950 p-1">
                    <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="font-semibold text-cyan-400 mr-2">Mentor Reply</span>
                      <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                    </div>
                    <p className="text-zinc-400 whitespace-pre-wrap">{qa.mentorReply}</p>
                  </div>
                </div>
              </div>
            )}
            
            {user?.role === "mentor" && (
              <div className={`bg-zinc-950 p-4 sm:p-6 ${qa.mentorReply ? 'pt-0 pl-12 sm:pl-20 relative' : 'border-t border-zinc-800'}`}>
                {qa.mentorReply && <div className="absolute left-5 sm:left-8 top-0 bottom-0 w-px bg-zinc-800" />}
                <div className={`flex items-start gap-3 sm:gap-4 ${qa.mentorReply ? 'relative' : ''}`}>
                  {!qa.mentorReply && (
                    <div className="flex-shrink-0">
                      <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <textarea
                      value={replyText[qa.id] || ""}
                      onChange={(e) => setReplyText({ ...replyText, [qa.id]: e.target.value })}
                      placeholder={qa.mentorReply ? "Send another reply to add more context..." : "Type your reply to the student here..."}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-300 focus:outline-none focus:border-cyan-500 transition-all min-h-[80px] mb-3 text-sm"
                    />
                    <button 
                      onClick={() => handleMentorReply(qa.id)}
                      disabled={!replyText[qa.id]?.trim()}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-cyan-600 text-white hover:bg-cyan-500 transition-colors disabled:opacity-50"
                    >
                      {qa.mentorReply ? "Post Additional Reply" : "Post Reply"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {user?.role === "student" && !qa.mentorReply && (
              <div className="bg-zinc-950 border-t border-zinc-800 p-4 pl-12 sm:pl-20">
                <p className="text-sm text-zinc-500 italic flex items-center">
                  Waiting for mentor reply...
                </p>
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
