"use client";

import { useAuth } from "@/components/dashboard/auth-provider";
import { FileText, ShieldAlert, Check, X, ExternalLink } from "lucide-react";

const mockAssignments = [
  { id: "ass-1", studentName: "Alex Developer", title: "React Context Implementation", course: "Elite Full-Stack Development", submittedAt: "2 hours ago", status: "pending", repoUrl: "https://github.com/example/repo" },
  { id: "ass-2", studentName: "Alex Developer", title: "Node.js REST API", course: "Elite Full-Stack Development", submittedAt: "1 day ago", status: "reviewed", repoUrl: "https://github.com/example/repo2" }
];

export default function AssignmentsPage() {
  const { user } = useAuth();

  if (user?.role !== "mentor") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-zinc-400">You must be a mentor to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <FileText className="w-8 h-8 mr-3 text-cyan-400" />
          Assignment Review
        </h1>
        <p className="text-zinc-400">Grade and provide feedback on student project submissions.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="text-xs text-zinc-500 uppercase bg-zinc-950 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Assignment</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockAssignments.map((assignment) => (
              <tr key={assignment.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{assignment.studentName}</td>
                <td className="px-6 py-4">
                  <div className="text-white font-medium">{assignment.title}</div>
                  <div className="text-xs text-zinc-500">{assignment.course}</div>
                </td>
                <td className="px-6 py-4">{assignment.submittedAt}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    assignment.status === 'pending' ? 'bg-yellow-950 text-yellow-400' : 'bg-green-950 text-green-400'
                  }`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <a href={assignment.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-zinc-400 hover:text-cyan-400 p-2 transition-colors" title="View Code">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {assignment.status === 'pending' && (
                    <>
                      <button className="text-green-500 hover:text-green-400 p-2 transition-colors bg-green-950/30 rounded-md" title="Approve">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-400 p-2 transition-colors bg-red-950/30 rounded-md" title="Reject/Request Changes">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
