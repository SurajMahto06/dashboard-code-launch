"use client";

import { useAuth } from "@/components/dashboard/auth-provider";
import { Settings as SettingsIcon, ShieldAlert, Save, Bell, Globe, Lock } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

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
      <div className="mb-8">
        <h1 className="text-lg md:text-2xl font-bold tracking-tight text-white mb-6 flex items-center">
          <SettingsIcon className="w-8 h-8 mr-3 text-cyan-400" />
          Global Settings
        </h1>
        <p className="text-zinc-400">Manage platform-wide configuration and preferences.</p>
      </div>

      <div className="grid gap-8">
        {/* Section 1 */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-6  flex items-center gap-3">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Platform Details</h2>
          </div>
          <div className="p-4 sm:p-6 space-y-6">
            <div>
              <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">Platform Name</label>
              <input type="text" defaultValue="Elite Mentorship Portal" className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-[13px] text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">Support Email</label>
              <input type="email" defaultValue="support@elite.com" className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-[13px] text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" />
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-6  flex items-center gap-3">
            <Lock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Access Control</h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">Require Email Verification</p>
                <p className="text-[13px] text-zinc-500">New students must verify their email before accessing courses.</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-cyan-500 appearance-none cursor-pointer translate-x-6 transition-transform" />
                <div className="toggle-label block overflow-hidden h-6 rounded-full bg-cyan-500 cursor-pointer"></div>
              </div>
            </label>
            <hr className="border-zinc-800" />
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">Maintenance Mode</p>
                <p className="text-[13px] text-zinc-500">Disable login for non-admin users.</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-zinc-400 border-4 border-zinc-800 appearance-none cursor-pointer transition-transform" />
                <div className="toggle-label block overflow-hidden h-6 rounded-full bg-zinc-800 cursor-pointer"></div>
              </div>
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button className="inline-flex items-center justify-center px-4 py-2.5 bg-cyan-400 hover:bg-cyan-500 text-zinc-950 font-bold text-[13px] font-medium rounded-lg transition-colors cursor-pointer">
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
