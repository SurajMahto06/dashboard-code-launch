"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/dashboard/auth-provider";
import { FileText, Check, X, ExternalLink, Plus, BookOpen, User as UserIcon, Calendar, Clock, Upload, GitBranch, Download, Trash2 } from "lucide-react";
import { Assignment, mockAssignmentsDB, mockUsersDB, mockCourses } from "@/data/mock-dashboard";

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState<'review' | 'assign'>('review');

  // Form State for Mentor Assigning
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDesc, setAssignmentDesc] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Form State for Student Submitting
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem("mockAssignmentsDB");
    const allAssignments: Assignment[] = saved ? JSON.parse(saved) : mockAssignmentsDB;
    setAssignments(allAssignments);
    if (!saved) {
      localStorage.setItem("mockAssignmentsDB", JSON.stringify(mockAssignmentsDB));
    }
  }, [user]);

  if (!user) return null;

  // Derived Data
  const mentorMentees = mockUsersDB.filter(u => user.menteeIds?.includes(u.id));
  const courses = mockCourses;

  // Filter students based on selected course
  const availableStudents = selectedCourseId
    ? mentorMentees.filter(m => m.enrolledCourseIds?.includes(selectedCourseId))
    : [];

  const saveAssignments = (newAssignments: Assignment[]) => {
    setAssignments(newAssignments);
    localStorage.setItem("mockAssignmentsDB", JSON.stringify(newAssignments));
  };

  // Student Actions
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingId) return;

    if (!repoUrl || !selectedFile) return; // Require both

    const updated = assignments.map(a =>
      a.id === submittingId
        ? {
          ...a,
          status: 'submitted' as const,
          repoUrl: repoUrl,
          fileName: selectedFile.name,
          submittedAt: new Date().toISOString()
        }
        : a
    );
    saveAssignments(updated);
    setSubmittingId(null);
    setRepoUrl("");
    setSelectedFile(null);
  };

  // Mentor Actions
  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId || !assignmentTitle) return;

    const newAssignment: Assignment = {
      id: `ass-${Date.now()}`,
      studentId: selectedStudentId,
      mentorId: user.id,
      courseId: selectedCourseId,
      title: assignmentTitle,
      description: assignmentDesc,
      status: 'pending_submission',
      assignedAt: new Date().toISOString(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // Default 7 days
    };

    saveAssignments([newAssignment, ...assignments]);
    setSelectedStudentId("");
    setSelectedCourseId("");
    setAssignmentTitle("");
    setAssignmentDesc("");
    setDueDate("");
    setActiveTab('review');
  };

  const handleReview = (id: string, action: 'approved' | 'rejected') => {
    const updated = assignments.map(a =>
      a.id === id ? { ...a, status: action } : a
    );
    saveAssignments(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      const updated = assignments.filter(a => a.id !== id);
      saveAssignments(updated);
    }
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_submission': return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">Pending</span>;
      case 'submitted': return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400">Needs Review</span>;
      case 'approved': return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">Approved</span>;
      case 'rejected': return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-700 dark:text-rose-400">Rejected</span>;
      default: return null;
    }
  };

  // Render Student View
  if (user.role === "student") {
    const myAssignments = assignments.filter(a => a.studentId === user.id);

    return (
      <div className="w-full pb-12 ">
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-cyan-400" />
            My Assignments
          </h1>
          <p className="text-sm text-zinc-400">Complete and submit your assigned project work.</p>
        </div>

        <div className="grid gap-6">
          {myAssignments.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-400">
              No assignments yet.
            </div>
          ) : (
            myAssignments.map((assignment) => (
              <div key={assignment.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                {assignment.status === 'pending_submission' && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
                )}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-lg font-bold text-white">{assignment.title}</h2>
                      {getStatusBadge(assignment.status)}
                    </div>

                    {/* Short Description */}
                    <div className="bg-zinc-950/50 rounded-xl p-4 mb-5 border border-zinc-800/50">
                      <div className="overflow-hidden relative">
                        <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                          {assignment.description.length > 150
                            ? assignment.description.slice(0, 150) + " "
                            : assignment.description}
                        </p>
                      </div>
                      <button
                        onClick={() => setViewDetailsId(assignment.id)}
                        className="text-cyan-400 text-xs font-medium hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                      >
                        Show more
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs font-medium text-zinc-500">
                      <span className="flex items-center"><BookOpen className="w-3.5 h-3.5 mr-1" /> {mockCourses.find(c => c.id === assignment.courseId)?.title}</span>
                      {assignment.dueDate && (
                        <span className="flex items-center text-rose-400/80"><Calendar className="w-3.5 h-3.5 mr-1" /> Due Date: {formatDate(assignment.dueDate)}</span>
                      )}
                      <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> Assigned: {formatTimeAgo(assignment.assignedAt)}</span>
                      {assignment.submittedAt && (
                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-cyan-400/70" /> Submitted: {formatTimeAgo(assignment.submittedAt)}</span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    {assignment.repoUrl && (
                      <a href={assignment.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors">
                        View Code <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    )}
                    {assignment.status === 'pending_submission' && (
                      <button
                        onClick={() => setSubmittingId(assignment.id)}
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-cyan-400 hover:bg-cyan-500 text-zinc-950 font-bold text-sm font-medium rounded-lg transition-colors"
                      >
                        Submit Project
                      </button>
                    )}
                  </div>
                </div>

                {/* Submission Form Modal / Dropdown */}
                {submittingId === assignment.id && (
                  <form onSubmit={handleStudentSubmit} className="mt-6 p-6 bg-zinc-950 border border-zinc-800 rounded-xl animate-in fade-in slide-in-from-top-2 shadow-inner">
                    <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
                      <div>
                        <h3 className="text-base font-semibold text-white mb-1">Submit Final Project</h3>
                        <p className="text-xs text-zinc-400">Please provide both your GitHub repository link and a compiled ZIP file.</p>
                      </div>
                      <button type="button" onClick={() => setSubmittingId(null)} className="p-1 text-zinc-500 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-5">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-2 flex items-center">
                          <GitBranch className="w-3.5 h-3.5 mr-1.5" /> GitHub Repository Link
                        </label>
                        <input
                          type="url"
                          placeholder="https://github.com/your-username/repo"
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-2 flex items-center">
                          <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Project ZIP
                        </label>
                        <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-zinc-700 border-dashed rounded-lg cursor-pointer bg-zinc-900 hover:bg-zinc-800 hover:border-cyan-500 transition-all">
                          <div className="flex items-center justify-center px-4">
                            <span className="text-sm text-zinc-300 font-medium truncate max-w-[250px]">{selectedFile ? selectedFile.name : "Click to select a .zip file"}</span>
                          </div>
                          <input type="file" accept=".zip,.rar,.tar.gz" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} required />
                        </label>
                      </div>

                      <div className="pt-2 border-t border-zinc-800/50 mt-2">
                        <button type="submit" disabled={!repoUrl || !selectedFile} className="w-full px-6 py-3 bg-cyan-400 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-400 text-zinc-950 font-bold text-sm font-medium rounded-lg transition-colors flex justify-center items-center cursor-pointer">
                          Confirm Submission
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            ))
          )}
        </div>

        {/* Full Details Modal */}
        {viewDetailsId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-50/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => setViewDetailsId(null)}
            />
            <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-cyan-400" />
                  Project Details
                </h2>
                <button
                  onClick={() => setViewDetailsId(null)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {assignments.find(a => a.id === viewDetailsId)?.description}
                </p>
              </div>
              <div className="p-4 border-t border-zinc-800 shrink-0 flex justify-end bg-zinc-900/50 rounded-b-2xl">
                <button
                  onClick={() => setViewDetailsId(null)}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Mentor View
  const mentorAssignments = assignments.filter(a => a.mentorId === user.id);

  return (
    <div className="w-full pb-12 ">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-cyan-400" />
            Assignment Management
          </h1>
          <p className="text-sm text-zinc-400">Assign tasks and review student project submissions.</p>
        </div>

        {/* Tabs */}
        <div className="inline-flex bg-zinc-900 p-1 border border-zinc-800 rounded-lg">
          <button
            onClick={() => setActiveTab('review')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'review' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
          >
            Review Submissions
          </button>
          <button
            onClick={() => setActiveTab('assign')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center ${activeTab === 'assign' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
          >
            <Plus className="w-4 h-4 mr-1" /> New Assignment
          </button>
        </div>
      </div>

      {activeTab === 'assign' ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl max-w-2xl">
          <h2 className="text-lg font-bold text-white mb-6 border-b border-zinc-800 pb-4">Assign New Project</h2>
          <form onSubmit={handleAssign} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Select Course Scope</label>
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setSelectedStudentId(""); // Reset student when course changes
                }}
                required
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none"
              >
                <option value="">-- Choose Course First --</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Select Student</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                required
                disabled={!selectedCourseId}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{selectedCourseId ? (availableStudents.length > 0 ? "-- Choose Mentee --" : "No mentees enrolled in this course") : "-- Select a course above --"}</option>
                {availableStudents.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Assignment Title</label>
              <input
                type="text"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                required
                placeholder="e.g. Build a React Shopping Cart"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description / Requirements</label>
              <textarea
                value={assignmentDesc}
                onChange={(e) => setAssignmentDesc(e.target.value)}
                required
                rows={10}
                placeholder="Provide comprehensive assignment details, technical requirements, and acceptance criteria here..."
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-y custom-scrollbar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Due Date (Optional)</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-cyan-400 hover:bg-cyan-500 text-zinc-950 font-bold text-sm font-medium rounded-lg transition-colors cursor-pointer">
                Assign to Student
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm text-zinc-400 min-w-[800px]">
              <thead className="text-xs text-zinc-500 uppercase bg-zinc-950 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Assignment Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {mentorAssignments.map((assignment) => {
                  const studentName = mockUsersDB.find(u => u.id === assignment.studentId)?.name || 'Unknown';
                  const courseName = mockCourses.find(c => c.id === assignment.courseId)?.title || 'Unknown';

                  return (
                    <tr key={assignment.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="font-medium text-white flex items-center">
                          <UserIcon className="w-4 h-4 mr-2 text-zinc-500" />
                          {studentName}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-white font-medium mb-1">{assignment.title}</div>
                        <div className="text-xs text-zinc-500 flex flex-wrap items-center gap-3 mt-1">
                          <span className="flex items-center"><BookOpen className="w-3 h-3 mr-1" /> {courseName}</span>
                          {assignment.dueDate && (
                            <span className="flex items-center text-rose-400/80"><Calendar className="w-3 h-3 mr-1" /> Due {formatDate(assignment.dueDate)}</span>
                          )}
                          <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Assigned {formatTimeAgo(assignment.assignedAt)}</span>
                          {assignment.submittedAt && (
                            <span className="flex items-center"><Check className="w-3 h-3 mr-1 text-cyan-400/70" /> Submitted {formatTimeAgo(assignment.submittedAt)}</span>
                          )}
                        </div>

                        {/* Submission Artifacts Moved Here for Better UX */}
                        {(assignment.repoUrl || assignment.fileName) && (
                          <div className="mt-4 flex flex-wrap items-center gap-4 p-3 bg-zinc-950/80 rounded-lg border border-zinc-800/50 w-fit">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Submitted Work:</span>
                            {assignment.repoUrl && (
                              <a href={assignment.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-xs font-medium transition-colors">
                                <GitBranch className="w-3.5 h-3.5 mr-1.5" /> GitHub Repository
                              </a>
                            )}
                            {assignment.fileName && (
                              <a href="#" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-xs font-medium transition-colors">
                                <Download className="w-3.5 h-3.5 mr-1.5" /> {assignment.fileName}
                              </a>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(assignment.status)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {assignment.status === 'submitted' && (
                            <>
                              <div className="w-px h-4 bg-zinc-700 mx-1"></div>
                              <button
                                onClick={() => handleReview(assignment.id, 'approved')}
                                className="text-emerald-500 hover:text-emerald-400 p-1.5 transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 rounded-md border border-emerald-500/20" title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReview(assignment.id, 'rejected')}
                                className="text-rose-500 hover:text-rose-400 p-1.5 transition-colors bg-rose-500/10 hover:bg-rose-500/20 rounded-md border border-rose-500/20" title="Reject / Request Changes"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <div className="w-px h-4 bg-zinc-700 mx-1"></div>
                          <button
                            onClick={() => handleDelete(assignment.id)}
                            className="text-zinc-500 hover:text-rose-500 p-1.5 transition-colors hover:bg-rose-500/10 rounded-md"
                            title="Delete Assignment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {mentorAssignments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                      No assignments found. Use the 'New Assignment' tab to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
