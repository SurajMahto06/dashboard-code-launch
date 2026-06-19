"use client";

import { useState } from "react";
import { useAuth } from "@/components/dashboard/auth-provider";
import { ShieldAlert, Award, CheckCircle } from "lucide-react";
import { mockCourses, mockUsersDB, mockCertificatesDB } from "@/data/mock-dashboard";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { generateCertificatePDF } from "@/lib/pdf";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const certificateSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  studentId: z.string().min(1, "Student is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  dateOfIssue: z.string().min(1, "Issue date is required"),
});

type CertificateValues = z.infer<typeof certificateSchema>;

export default function NewIssueCertificatePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [isIssuing, setIsIssuing] = useState(false);
  const [issuedId, setIssuedId] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const form = useForm<CertificateValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      courseId: "",
      studentId: "",
      startDate: "2026-03",
      endDate: "2026-06",
      dateOfIssue: new Date().toISOString().split('T')[0].substring(0, 7),
    },
  });

  const selectedCourseId = form.watch("courseId");

  const handleDownloadPDF = async () => {
    if (!issuedId) return;
    const student = mockUsersDB.find(u => u.id === form.getValues("studentId"));
    const course = mockCourses.find(c => c.id === form.getValues("courseId"));
    setIsGeneratingPdf(true);
    await generateCertificatePDF(
      {
        studentName: student?.name || "Unknown",
        courseTitle: course?.title || "Unknown",
        issueDate: form.getValues("dateOfIssue"),
        certificateId: issuedId,
      },
      `Certificate-${issuedId}.pdf`
    );
    setIsGeneratingPdf(false);
  };

  // Filter students based on selected course
  const availableStudents = mockUsersDB.filter(
    (u) => u.role === "student" && (!selectedCourseId || u.enrolledCourseIds?.includes(selectedCourseId))
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(e.target.name as keyof CertificateValues, e.target.value);
  };

  const onSubmit = (data: CertificateValues) => {
    setIsIssuing(true);

    setTimeout(() => {
      // Simulate backend ID generation and saving to DB
      const year = new Date().getFullYear();
      const student = mockUsersDB.find(u => u.id === data.studentId);

      let initials = "XX";
      if (student && student.name) {
        const parts = student.name.trim().split(" ");
        if (parts.length === 1) {
          initials = parts[0][0].toUpperCase();
        } else {
          initials = parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
        }
      }

      const existingCountThisYear = mockCertificatesDB.filter(c => c.certificateId?.includes(`CL-${year}`)).length;
      const sequence = String(existingCountThisYear + 1).padStart(3, '0');

      const autoId = `CL-${year}-${initials}${sequence}`;

      // Add to mock DB so it shows up in the table
      const newCert = {
        id: `cert-${Date.now()}`,
        studentId: data.studentId,
        courseId: data.courseId,
        certificateId: autoId,
        issueDate: data.dateOfIssue,
      };

      // In a real app we'd push to backend. For the mock we just mutate the array directly
      mockCertificatesDB.push(newCert);

      setIssuedId(autoId);
      setIsIssuing(false);
    }, 800);
  };

  const handleReset = () => {
    setIssuedId(null);
    form.reset({
      courseId: "",
      studentId: "",
      startDate: "2026-03",
      endDate: "2026-06",
      dateOfIssue: new Date().toISOString().split('T')[0].substring(0, 7),
    });
  };

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-lg md:text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-zinc-400">You must be an administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-12 ">
      <Link href="/issue-certificate" className="inline-flex items-center text-[13px] text-zinc-400 hover:text-cyan-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Certificates
      </Link>

      <div className="mb-8">
        <h1 className="text-lg md:text-2xl font-bold tracking-tight text-white mb-6">
          Issue Certificate
        </h1>
        <p className="text-zinc-400">Securely generate and issue verifiable credentials to students who have completed their tracks.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl max-w-4xl">
        {issuedId ? (
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center text-left mb-4 sm:mb-0">
              <CheckCircle className="w-12 h-12 text-emerald-400 mr-4 shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-white">Certificate Successfully Issued</h2>
                <p className="text-zinc-400 text-sm mt-1">Generated ID: <span className="font-mono text-cyan-400 font-bold ml-1">{issuedId}</span></p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/issue-certificate">
                <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[13px] font-medium rounded-lg transition-colors cursor-pointer border border-zinc-700">
                  View List
                </button>
              </Link>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[13px] font-medium rounded-lg transition-colors cursor-pointer border border-zinc-700"
              >
                Issue Another
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-zinc-950 text-[13px] font-bold rounded-lg transition-colors shadow-[0_0_10px_rgba(8,145,178,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isGeneratingPdf ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm sm:text-[15px] font-medium text-zinc-300 mb-2">Select Course / Track</label>
                <select
                  {...form.register("courseId")}
                  onChange={(e) => {
                    form.setValue("courseId", e.target.value);
                    form.setValue("studentId", ""); // Reset student on course change
                  }}
                  className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg text-[13px] text-white focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer ${form.formState.errors.courseId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:border-cyan-500 focus:ring-cyan-500'}`}
                >
                  <option value="" disabled>-- Select a completed course --</option>
                  {mockCourses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
                {form.formState.errors.courseId && <p className="text-xs text-red-500 mt-1">{form.formState.errors.courseId.message}</p>}
              </div>

              <div>
                <label className="block text-sm sm:text-[15px] font-medium text-zinc-300 mb-2">Select Student</label>
                <select
                  {...form.register("studentId")}
                  disabled={!selectedCourseId}
                  className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg text-[13px] text-white focus:outline-none focus:ring-1 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${form.formState.errors.studentId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:border-cyan-500 focus:ring-cyan-500'}`}
                >
                  <option value="" disabled>-- Select an eligible student --</option>
                  {availableStudents.map(student => (
                    <option key={student.id} value={student.id}>{student.name} ({student.email})</option>
                  ))}
                </select>
                {form.formState.errors.studentId && <p className="text-xs text-red-500 mt-1">{form.formState.errors.studentId.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm sm:text-[15px] font-medium text-zinc-300 mb-2">Start Month</label>
                  <input
                    type="month"
                    {...form.register("startDate")}
                    className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg text-[13px] text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all [color-scheme:dark] ${form.formState.errors.startDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:border-cyan-500 focus:ring-cyan-500'}`}
                  />
                  {form.formState.errors.startDate && <p className="text-xs text-red-500 mt-1">{form.formState.errors.startDate.message}</p>}
                </div>
                <div>
                  <label className="block text-sm sm:text-[15px] font-medium text-zinc-300 mb-2">End Month</label>
                  <input
                    type="month"
                    {...form.register("endDate")}
                    className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg text-[13px] text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all [color-scheme:dark] ${form.formState.errors.endDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:border-cyan-500 focus:ring-cyan-500'}`}
                  />
                  {form.formState.errors.endDate && <p className="text-xs text-red-500 mt-1">{form.formState.errors.endDate.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-[15px] font-medium text-zinc-300 mb-2">Month of Issue</label>
                <input
                  type="month"
                  {...form.register("dateOfIssue")}
                  className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg text-[13px] text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all [color-scheme:dark] ${form.formState.errors.dateOfIssue ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:border-cyan-500 focus:ring-cyan-500'}`}
                />
                {form.formState.errors.dateOfIssue && <p className="text-xs text-red-500 mt-1">{form.formState.errors.dateOfIssue.message}</p>}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 flex justify-end">
              <button
                type="submit"
                disabled={isIssuing}
                className="flex items-center px-6 py-2.5 text-[13px] bg-cyan-400 hover:bg-cyan-500 text-zinc-950 font-bold rounded-lg transition-colors shadow-[0_0_20px_rgba(8,145,178,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isIssuing ? (
                  <span className="flex items-center">
                    <div className="w-4 h-4 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin mr-2" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Issue Credential
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
