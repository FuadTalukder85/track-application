"use client";

import React from "react";
import { Briefcase, Plus, Sparkles, TrendingUp } from "lucide-react";

interface NavbarProps {
  onOpenAddModal: () => void;
  totalApplications: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  totalApplications,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/25">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  CareerTrack
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Job Application Tracker
              </p>
            </div>
          </div>

          {/* Quick Stats & Action */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Applications Logged:</span>
              <span className="font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded text-xs">
                {totalApplications}
              </span>
            </div>

            <button
              id="add-application-btn"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Application</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
