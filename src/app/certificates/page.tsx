"use client";

import { useAuth } from "@/components/dashboard/auth-provider";
import { ShieldCheck, Download, Award, ShieldAlert } from "lucide-react";

export default function CertificatesPage() {
  const { user } = useAuth();

  if (user?.role !== "student") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-zinc-400">You must be a student to view certificates.</p>
      </div>
    );
  }

  // Mock certificate logic based on completed topics
  const hasCertificate = user?.progressPercentage && user.progressPercentage > 40;

  return (
    <div className="w-full pb-12 ">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-6 flex items-center">
          <ShieldCheck className="w-8 h-8 mr-3 text-cyan-400" />
          My Certificates
        </h1>
        <p className="text-zinc-400">View and download your earned credentials.</p>
      </div>

      {hasCertificate ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 group">
            <div className="aspect-[1.4/1] bg-cyan-950/20 border border-cyan-900/50 rounded-lg flex items-center justify-center relative overflow-hidden mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent"></div>
              <Award className="w-24 h-24 text-cyan-400/50 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-x-0 bottom-8 text-center">
                <p className="text-cyan-400 font-serif text-sm tracking-widest uppercase">Elite Academy</p>
                <p className="text-white text-sm mt-2">Full-Stack Development</p>
              </div>
            </div>
            
            <h3 className="text-base font-semibold text-white mb-1">Elite Full-Stack Certification</h3>
            <p className="text-sm text-zinc-400 mb-4">Issued: June 2026</p>
            
            <button className="w-full flex items-center justify-center px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-16 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Award className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">No Certificates Yet</h2>
          <p className="text-zinc-400">Complete a course track to earn your first certification.</p>
        </div>
      )}
    </div>
  );
}
