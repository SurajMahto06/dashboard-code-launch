"use client";

import { use, useState } from "react";
import { mockCourses, mockTopics } from "@/data/mock-dashboard";
import { useAuth } from "@/components/dashboard/auth-provider";
import { ShieldAlert, ArrowLeft, Plus, UploadCloud, Video, HelpCircle, MessageSquare, Trash2, Save, CheckCircle2, Edit } from "lucide-react";
import Link from "next/link";

export default function CourseEditorPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  
  const [topics, setTopics] = useState(mockTopics.filter(t => t.courseId === resolvedParams.courseId));
  
  // New Topic Form State
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [moduleName, setModuleName] = useState("Module 1: Getting Started");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  
  // MCQ State
  const [mcqs, setMcqs] = useState([{ question: "", options: ["", "", "", ""], correctIndex: 0 }]);
  
  // Interview Q State
  const [interviewQs, setInterviewQs] = useState([{ question: "", hints: "" }]);

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-zinc-400">You must be an administrator to edit courses.</p>
      </div>
    );
  }

  const course = mockCourses.find(c => c.id === resolvedParams.courseId);
  if (!course) return <div className="text-white p-8">Course not found.</div>;

  const handleSaveTopic = () => {
    const newTopic = {
      id: `topic-new-${Date.now()}`,
      courseId: course.id,
      title: title || "Untitled Topic",
      description: description || "No description provided.",
      module: moduleName,
      video: {
        id: `vid-${Date.now()}`,
        title: videoFile ? videoFile.name : "Uploaded Video",
        duration: "10:00", // Mock duration
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      mcqs: mcqs.filter(m => m.question).map((m, i) => ({
        id: `q-${Date.now()}-${i}`,
        question: m.question,
        options: m.options.map((opt, j) => ({ id: `o${j}`, text: opt || `Option ${j+1}` })),
        correctOptionId: `o${m.correctIndex}`,
        explanation: "Correct answer explanation."
      })),
      interviewQuestions: interviewQs.filter(iq => iq.question).map((iq, i) => ({
        id: `iq-${Date.now()}-${i}`,
        question: iq.question,
        hints: iq.hints.split(",").map(h => h.trim())
      }))
    };

    if (editingTopicId) {
      setTopics(topics.map(t => t.id === editingTopicId ? { ...newTopic, id: editingTopicId } : t));
    } else {
      setTopics([...topics, newTopic]);
    }
    
    setIsAdding(false);
    setEditingTopicId(null);
    // Reset form
    setTitle(""); setDescription(""); setVideoFile(null);
    setMcqs([{ question: "", options: ["", "", "", ""], correctIndex: 0 }]);
    setInterviewQs([{ question: "", hints: "" }]);
  };

  const handleEditTopic = (topic: any) => {
    setEditingTopicId(topic.id);
    setTitle(topic.title);
    setDescription(topic.description);
    setModuleName(topic.module);
    
    if (topic.mcqs && topic.mcqs.length > 0) {
      setMcqs(topic.mcqs.map((m: any) => ({
        question: m.question,
        options: m.options.map((o: any) => o.text),
        correctIndex: parseInt(m.correctOptionId.replace('o', '')) || 0
      })));
    } else {
      setMcqs([{ question: "", options: ["", "", "", ""], correctIndex: 0 }]);
    }

    if (topic.interviewQuestions && topic.interviewQuestions.length > 0) {
      setInterviewQs(topic.interviewQuestions.map((iq: any) => ({
        question: iq.question,
        hints: iq.hints.join(", ")
      })));
    } else {
      setInterviewQs([{ question: "", hints: "" }]);
    }
    
    setIsAdding(true);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 w-full">
      <Link href="/courses" className="inline-flex items-center text-sm text-zinc-400 hover:text-cyan-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Course Builder
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            {course.title}
          </h1>
          <p className="text-zinc-400">Curriculum Editor</p>
        </div>
        {!isAdding && (
          <button onClick={() => {
            setTitle(""); setDescription(""); setVideoFile(null); setEditingTopicId(null);
            setMcqs([{ question: "", options: ["", "", "", ""], correctIndex: 0 }]);
            setInterviewQs([{ question: "", hints: "" }]);
            setIsAdding(true);
          }} className="flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Add New Topic
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl space-y-12 animate-in fade-in slide-in-from-bottom-4">
          
          {/* 1. Basic Info */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-2">1. Topic Details</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Topic Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g. Intro to Next.js" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Module Assignment</label>
                <input value={moduleName} onChange={e => setModuleName(e.target.value)} type="text" placeholder="e.g. Module 1: Basics" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="What will students learn in this topic?" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" />
              </div>
            </div>
          </section>

          {/* 2. Video Upload */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-2 flex items-center">
              <Video className="w-5 h-5 mr-2 text-cyan-400" />
              2. Video Content
            </h2>
            <div className="border-2 border-dashed border-zinc-700 hover:border-cyan-500 bg-zinc-950 rounded-xl p-10 text-center transition-colors relative group">
              <input 
                type="file" 
                accept="video/mp4,video/x-m4v,video/*" 
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              {videoFile ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
                  <p className="text-white font-medium">{videoFile.name}</p>
                  <p className="text-zinc-500 text-sm mt-1">Ready for upload</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="w-12 h-12 text-zinc-500 group-hover:text-cyan-400 transition-colors mb-3" />
                  <p className="text-zinc-300 font-medium mb-1">Click or drag video to upload</p>
                  <p className="text-zinc-500 text-sm">MP4, WebM up to 2GB</p>
                </div>
              )}
            </div>
          </section>

          {/* 3. MCQs */}
          <section>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-cyan-400" />
                3. Multiple Choice Questions
              </h2>
              <button onClick={() => setMcqs([...mcqs, { question: "", options: ["", "", "", ""], correctIndex: 0 }])} className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Question
              </button>
            </div>
            
            <div className="space-y-6">
              {mcqs.map((mcq, qIdx) => (
                <div key={qIdx} className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl relative">
                  {mcqs.length > 1 && (
                    <button onClick={() => setMcqs(mcqs.filter((_, i) => i !== qIdx))} className="absolute top-4 right-4 text-zinc-500 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="mb-4 pr-8">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Question {qIdx + 1}</label>
                    <input 
                      value={mcq.question} 
                      onChange={e => { const newMcqs = [...mcqs]; newMcqs[qIdx].question = e.target.value; setMcqs(newMcqs); }}
                      type="text" placeholder="e.g. What is the Virtual DOM?" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white outline-none" 
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {mcq.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name={`correct-${qIdx}`} 
                          checked={mcq.correctIndex === oIdx}
                          onChange={() => { const newMcqs = [...mcqs]; newMcqs[qIdx].correctIndex = oIdx; setMcqs(newMcqs); }}
                          className="w-4 h-4 text-cyan-600 bg-zinc-800 border-zinc-700 focus:ring-cyan-600 focus:ring-2 cursor-pointer"
                        />
                        <input 
                          value={opt}
                          onChange={e => { const newMcqs = [...mcqs]; newMcqs[qIdx].options[oIdx] = e.target.value; setMcqs(newMcqs); }}
                          type="text" placeholder={`Option ${oIdx + 1}`} className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white outline-none" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Interview Questions */}
          <section>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-cyan-400" />
                4. Interview Questions
              </h2>
              <button onClick={() => setInterviewQs([...interviewQs, { question: "", hints: "" }])} className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Question
              </button>
            </div>
            
            <div className="space-y-4">
              {interviewQs.map((iq, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex gap-4 items-start relative">
                  <div className="flex-1 space-y-3 pr-8">
                    <input 
                      value={iq.question}
                      onChange={e => { const newIQs = [...interviewQs]; newIQs[i].question = e.target.value; setInterviewQs(newIQs); }}
                      type="text" placeholder="Interview Question (e.g. Explain Context API vs Redux)" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white outline-none" 
                    />
                    <input 
                      value={iq.hints}
                      onChange={e => { const newIQs = [...interviewQs]; newIQs[i].hints = e.target.value; setInterviewQs(newIQs); }}
                      type="text" placeholder="Hints (comma separated)" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-zinc-300 outline-none" 
                    />
                  </div>
                  {interviewQs.length > 1 && (
                    <button onClick={() => setInterviewQs(interviewQs.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-zinc-500 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end gap-4 pt-6 border-t border-zinc-800">
            <button onClick={() => { setIsAdding(false); setEditingTopicId(null); }} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors">
              Cancel
            </button>
            <button onClick={handleSaveTopic} className="flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-[0_0_20px_rgba(8,145,178,0.3)]">
              <Save className="w-5 h-5 mr-2" />
              {editingTopicId ? "Update Topic" : "Save Topic to Curriculum"}
            </button>
          </div>

        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-zinc-800 bg-zinc-950/50">
            <h2 className="text-xl font-bold text-white">Current Curriculum</h2>
          </div>
          <div className="divide-y divide-zinc-800">
            {topics.length > 0 ? topics.map((topic, i) => (
              <div key={topic.id} className="p-6 flex items-start justify-between hover:bg-zinc-800/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded uppercase tracking-wider">{topic.module}</span>
                    <span className="text-xs font-medium text-zinc-500">Topic {i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{topic.title}</h3>
                  <div className="flex gap-4 mt-3 text-sm text-zinc-400">
                    <span className="flex items-center"><Video className="w-4 h-4 mr-1.5" /> Video ({topic.video.duration})</span>
                    <span className="flex items-center"><HelpCircle className="w-4 h-4 mr-1.5" /> {topic.mcqs?.length || 0} MCQs</span>
                    <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-1.5" /> {topic.interviewQuestions?.length || 0} Interview Qs</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEditTopic(topic)} className="text-zinc-500 hover:text-cyan-400 transition-colors p-2" title="Edit Topic">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => setTopics(topics.filter(t => t.id !== topic.id))} className="text-zinc-500 hover:text-red-400 transition-colors p-2" title="Delete Topic">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-zinc-500">
                No topics added yet. Click "Add New Topic" to start building.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
