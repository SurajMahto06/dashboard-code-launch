"use client";

import { use, useState } from "react";
import { mockCourses, mockTopics, mockModules, CourseModule, Topic } from "@/data/mock-dashboard";
import { useAuth } from "@/components/dashboard/auth-provider";
import { ShieldAlert, ArrowLeft, Plus, UploadCloud, Video, HelpCircle, MessageSquare, Trash2, Save, CheckCircle2, Edit, FolderPlus, GripVertical, FileText, BookOpen } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CourseEditorPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();

  const course = mockCourses.find(c => c.id === resolvedParams.courseId);

  const [modules, setModules] = useState<CourseModule[]>(mockModules.filter(m => m.courseId === resolvedParams.courseId).sort((a, b) => a.order - b.order));
  const [topics, setTopics] = useState<Topic[]>(mockTopics.filter(t => t.courseId === resolvedParams.courseId));

  // Module Creation State
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  // Topic Editor State
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [cheatsheetFile, setCheatsheetFile] = useState<File | null>(null);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);

  // MCQ State
  const [mcqs, setMcqs] = useState([{ question: "", options: ["", "", "", ""], correctIndex: 0 }]);

  // Interview Q State
  const [interviewQs, setInterviewQs] = useState([{ question: "", hints: "" }]);

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-lg md:text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-zinc-400">You must be an administrator to edit courses.</p>
      </div>
    );
  }

  if (!course) return <div className="text-white p-8">Course not found.</div>;

  const handleSaveModule = () => {
    if (!newModuleTitle.trim()) return;
    const newModule: CourseModule = {
      id: `mod-${Date.now()}`,
      courseId: course.id,
      title: newModuleTitle,
      order: modules.length + 1
    };
    setModules([...modules, newModule]);
    setNewModuleTitle("");
    setIsAddingModule(false);
  };

  const handleSaveTopic = () => {
    if (!activeModuleId) return;

    const newTopic: Topic = {
      id: editingTopicId || `topic-${Date.now()}`,
      courseId: course.id,
      moduleId: activeModuleId,
      title: title || "Untitled Topic",
      description: description || "No description provided.",
      video: {
        id: `vid-${Date.now()}`,
        title: videoFile ? videoFile.name : "Uploaded Video",
        duration: "10:00", // Mock duration
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      mcqs: mcqs.filter(m => m.question).map((m, i) => ({
        id: `q-${Date.now()}-${i}`,
        question: m.question,
        options: m.options.map((opt, j) => ({ id: `o${j}`, text: opt || `Option ${j + 1}` })),
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
      setTopics(topics.map(t => t.id === editingTopicId ? newTopic : t));
    } else {
      setTopics([...topics, newTopic]);
    }

    setIsAddingTopic(false);
    setEditingTopicId(null);
    setActiveModuleId(null);
    // Reset form
    setTitle(""); setDescription(""); setVideoFile(null);
    setMcqs([{ question: "", options: ["", "", "", ""], correctIndex: 0 }]);
    setInterviewQs([{ question: "", hints: "" }]);
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopicId(topic.id);
    setActiveModuleId(topic.moduleId);
    setTitle(topic.title);
    setDescription(topic.description);

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

    setIsAddingTopic(true);
  };

  const openNewTopicEditor = (moduleId: string) => {
    setTitle(""); setDescription(""); setVideoFile(null); setEditingTopicId(null);
    setMcqs([{ question: "", options: ["", "", "", ""], correctIndex: 0 }]);
    setInterviewQs([{ question: "", hints: "" }]);
    setActiveModuleId(moduleId);
    setIsAddingTopic(true);
  };

  if (isAddingTopic) {
    const parentModule = modules.find(m => m.id === activeModuleId);
    return (
      <div className="w-full pb-12  animate-in fade-in">
        <button onClick={() => setIsAddingTopic(false)} className="inline-flex items-center text-[13px] text-zinc-400 hover:text-cyan-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Curriculum
        </button>
        <div className="mb-6">
          <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-1 block">Adding to: {parentModule?.title}</span>
          <h1 className="text-lg md:text-2xl font-bold tracking-tight text-white flex items-center">
            {editingTopicId ? "Edit Topic" : "Create New Topic"}
          </h1>
        </div>

        <Card className="p-4 sm:p-6 sm:p-8 space-y-12">
          {/* 1. Basic Info */}
          <section>
            <h2 className="text-base font-bold text-white mb-6 -800 pb-2">1. Topic Details</h2>
            <div className="grid gap-6">
              <div>
                <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">Topic Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g. Intro to Next.js" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">Description</label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="What will students learn in this topic?" />
              </div>
            </div>
          </section>

          {/* 2. Video Upload */}
          <section>
            <h2 className="text-base font-bold text-white mb-6 -800 pb-2 flex items-center">
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
                  <p className="text-zinc-500 text-[13px] mt-1">Ready for upload</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="w-12 h-12 text-zinc-500 group-hover:text-cyan-400 transition-colors mb-3" />
                  <p className="text-zinc-300 font-medium mb-1">Click or drag video to upload</p>
                  <p className="text-zinc-500 text-[13px]">MP4, WebM up to 2GB</p>
                </div>
              )}
            </div>
          </section>

          {/* 3. MCQs */}
          <section>
            <div className="flex items-center justify-between -800 pb-2 mb-6">
              <h2 className="text-base font-bold text-white flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-cyan-400" />
                3. Multiple Choice Questions
              </h2>
              <button onClick={() => setMcqs([...mcqs, { question: "", options: ["", "", "", ""], correctIndex: 0 }])} className="text-[13px] text-cyan-400 hover:text-cyan-300 flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Question
              </button>
            </div>

            <div className="space-y-6">
              {mcqs.map((mcq, qIdx) => (
                <div key={qIdx} className="bg-zinc-950 border border-zinc-800 p-4 sm:p-6 rounded-xl relative">
                  {mcqs.length > 1 && (
                    <button onClick={() => setMcqs(mcqs.filter((_, i) => i !== qIdx))} className="absolute top-4 right-4 text-zinc-500 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="mb-4 pr-8">
                    <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">Question {qIdx + 1}</label>
                    <Input
                      value={mcq.question}
                      onChange={e => { const newMcqs = [...mcqs]; newMcqs[qIdx].question = e.target.value; setMcqs(newMcqs); }}
                      type="text" placeholder="e.g. What is the Virtual DOM?"
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
                        <Input
                          value={opt}
                          onChange={e => { const newMcqs = [...mcqs]; newMcqs[qIdx].options[oIdx] = e.target.value; setMcqs(newMcqs); }}
                          type="text" placeholder={`Option ${oIdx + 1}`} className="flex-1"
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
            <div className="flex items-center justify-between -800 pb-2 mb-6">
              <h2 className="text-base font-bold text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-cyan-400" />
                4. Interview Questions
              </h2>
              <button onClick={() => setInterviewQs([...interviewQs, { question: "", hints: "" }])} className="text-[13px] text-cyan-400 hover:text-cyan-300 flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Question
              </button>
            </div>

            <div className="space-y-4">
              {interviewQs.map((iq, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex gap-4 items-start relative">
                  <div className="flex-1 space-y-3 pr-8">
                    <Input
                      value={iq.question}
                      onChange={e => { const newIQs = [...interviewQs]; newIQs[i].question = e.target.value; setInterviewQs(newIQs); }}
                      type="text" placeholder="Interview Question (e.g. Explain Context API vs Redux)"
                    />
                    <Input
                      value={iq.hints}
                      onChange={e => { const newIQs = [...interviewQs]; newIQs[i].hints = e.target.value; setInterviewQs(newIQs); }}
                      type="text" placeholder="Hints (comma separated)"
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

          {/* 5. Attachments */}
          <section>
            <div className="flex items-center justify-between  pb-2 mb-6">
              <h2 className="text-base font-bold text-white flex items-center">
                <FileText className="w-5 h-5 mr-2 text-cyan-400" />
                5. Attachments & Cheatsheets
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="border-2 border-dashed border-zinc-700 hover:border-cyan-500 bg-zinc-950 rounded-xl p-8 text-center transition-colors relative group">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {pdfFile ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                    <p className="text-white font-medium text-[13px] truncate w-full px-4">{pdfFile.name}</p>
                    <p className="text-zinc-500 text-[11px] mt-1">PDF attached</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FileText className="w-10 h-10 text-zinc-500 group-hover:text-cyan-400 transition-colors mb-2" />
                    <p className="text-zinc-300 font-medium text-[13px] mb-1">Upload PDF Note</p>
                    <p className="text-zinc-500 text-[11px]">.pdf format</p>
                  </div>
                )}
              </div>

              <div className="border-2 border-dashed border-zinc-700 hover:border-cyan-500 bg-zinc-950 rounded-xl p-8 text-center transition-colors relative group">
                <input
                  type="file"
                  accept=".pdf,.md,.txt"
                  onChange={(e) => setCheatsheetFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {cheatsheetFile ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                    <p className="text-white font-medium text-[13px] truncate w-full px-4">{cheatsheetFile.name}</p>
                    <p className="text-zinc-500 text-[11px] mt-1">Cheatsheet attached</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <BookOpen className="w-10 h-10 text-zinc-500 group-hover:text-cyan-400 transition-colors mb-2" />
                    <p className="text-zinc-300 font-medium text-[13px] mb-1">Upload Cheatsheet</p>
                    <p className="text-zinc-500 text-[11px]">.pdf, .md, .txt</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-6 ">
            <button onClick={() => setIsAddingTopic(false)} className="px-4 py-2 text-[13px] bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors">
              Cancel
            </button>
            <button onClick={handleSaveTopic} className="inline-flex items-center justify-center px-4 py-2 text-[13px] bg-cyan-400 hover:bg-cyan-500 text-zinc-950 font-bold font-medium rounded-lg transition-colors shadow-[0_0_20px_rgba(8,145,178,0.3)] cursor-pointer">
              <Save className="w-4 h-4 mr-2" />
              {editingTopicId ? "Update Topic" : "Save Topic"}
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full pb-12  animate-in fade-in">
      <Link href="/courses" className="inline-flex items-center text-[13px] text-zinc-400 hover:text-cyan-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Course Overview
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-2xl font-bold tracking-tight text-white mb-2 flex items-center">
            {course.title}
          </h1>
          <p className="text-zinc-400">Curriculum Builder</p>
        </div>
        <button
          onClick={() => setIsAddingModule(true)}
          className="flex items-center px-4 py-2.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
        >
          <FolderPlus className="w-5 h-5 mr-2 text-cyan-400" />
          Add New Module
        </button>
      </div>

      {isAddingModule && (
        <div className="bg-zinc-900 border border-cyan-900/50 rounded-xl p-4 sm:p-6 mb-8 shadow-lg">
          <h3 className="text-sm font-semibold text-white mb-4">Create New Module</h3>
          <div className="flex gap-4">
            <Input
              autoFocus
              value={newModuleTitle}
              onChange={e => setNewModuleTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveModule()}
              placeholder="e.g. Module 3: State Management"
              className="flex-1"
            />
            <button onClick={() => setIsAddingModule(false)} className="px-4 py-2 text-zinc-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSaveModule} className="px-6 py-2 bg-cyan-400 hover:bg-cyan-500 text-zinc-950 font-bold font-medium rounded-lg transition-colors cursor-pointer">Save</button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {modules.length > 0 ? modules.map((module, mIdx) => {
          const moduleTopics = topics.filter(t => t.moduleId === module.id);
          return (
            <div key={module.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-zinc-950/50 p-4 sm:p-5 flex items-center justify-between -800">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-zinc-600 cursor-grab" />
                  <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">Module {mIdx + 1}</span>
                    <h2 className="text-base font-bold text-white">{module.title}</h2>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setModules(modules.filter(m => m.id !== module.id))} className="p-2 text-zinc-500 hover:text-red-400 transition-colors" title="Delete Module">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-3 bg-zinc-900">
                {moduleTopics.length > 0 ? moduleTopics.map((topic, tIdx) => (
                  <div key={topic.id} className="group bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex items-center justify-between hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center font-medium text-[13px]">
                        {tIdx + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-cyan-400 transition-colors">{topic.title}</h3>
                        <div className="flex gap-3 mt-1 text-xs text-zinc-500">
                          <span className="flex items-center"><Video className="w-3.5 h-3.5 mr-1" /> {topic.video.duration}</span>
                          {topic.mcqs.length > 0 && <span className="flex items-center"><HelpCircle className="w-3.5 h-3.5 mr-1" /> {topic.mcqs.length} MCQs</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditTopic(topic)} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors" title="Edit Topic">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setTopics(topics.filter(t => t.id !== topic.id))} className="p-2 bg-zinc-800 hover:bg-red-900 hover:text-red-300 text-zinc-400 rounded-lg transition-colors" title="Delete Topic">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center p-4 sm:p-6 text-[13px] text-zinc-500 italic border border-dashed border-zinc-800 rounded-lg">
                    No topics in this module. Click "Add Topic" to create one.
                  </div>
                )}

                <button
                  onClick={() => openNewTopicEditor(module.id)}
                  className="w-full mt-3 flex items-center justify-center p-3 border border-dashed border-zinc-700 hover:border-cyan-800 hover:bg-cyan-950/20 text-zinc-400 hover:text-cyan-400 rounded-lg transition-colors text-[13px] font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Topic to {module.title.split(":")[0]}
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="p-16 text-center border-2 border-dashed border-zinc-800 rounded-xl">
            <FolderPlus className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-white mb-2">Your curriculum is empty</h3>
            <p className="text-zinc-500 mb-6">Start by creating your first module to organize your course content.</p>
            <button
              onClick={() => setIsAddingModule(true)}
              className="inline-flex items-center px-4 py-2 bg-cyan-400 hover:bg-cyan-500 text-zinc-950 font-bold font-medium rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Module
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
