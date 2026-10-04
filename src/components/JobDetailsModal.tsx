"use client";

import React from "react";
import { JobApplication } from "@/types/job";
import {
  STATUS_CONFIG,
  WORK_MODE_CONFIG,
  JOB_TYPE_CONFIG,
  formatDate,
  formatCurrency,
} from "@/lib/utils";
import {
  X,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  Edit3,
  Trash2,
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";

interface JobDetailsModalProps {
  application: JobApplication | null;
  onClose: () => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  application,
  onClose,
  onEdit,
  onDelete,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && application) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [application, onClose]);

  if (!application) return null;

  const statusCfg = STATUS_CONFIG[application.applicationStatus] || {
    label: application.applicationStatus,
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
    dot: "bg-slate-400",
  };

  const workModeCfg = WORK_MODE_CONFIG[application.workMode] || {
    label: application.workMode,
    bg: "bg-slate-800",
    text: "text-slate-300",
  };

  const jobTypeCfg = JOB_TYPE_CONFIG[application.jobType] || {
    label: application.jobType,
    bg: "bg-slate-800",
    text: "text-slate-300",
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden cursor-default"
      >
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
              >
                <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
              <span
                className={`px-2.5 py-0.5 text-xs font-medium rounded-md ${workModeCfg.bg} ${workModeCfg.text}`}
              >
                {workModeCfg.label}
              </span>
              <span
                className={`px-2.5 py-0.5 text-xs font-medium rounded-md ${jobTypeCfg.bg} ${jobTypeCfg.text}`}
              >
                {jobTypeCfg.label}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {application.jobTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mt-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <Building2 className="w-4 h-4 text-indigo-400" />
                {application.companyName}
              </span>
              {application.jobLocation && (
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {application.jobLocation}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">
                Application Date
              </span>
              <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {formatDate(application.applicationDate)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">
                Offered Salary
              </span>
              <span className="text-sm font-semibold text-emerald-400">
                {application.offeredSalary
                  ? formatCurrency(application.offeredSalary, application.salaryCurrency)
                  : "Pending"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">
                Expected Salary
              </span>
              <span className="text-sm font-semibold text-slate-200">
                {application.expectedSalary
                  ? formatCurrency(application.expectedSalary, application.salaryCurrency)
                  : "Not set"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">
                Salary Range
              </span>
              <span className="text-sm font-semibold text-slate-200 truncate block">
                {application.salaryRange || "—"}
              </span>
            </div>
          </div>

          {/* Posting URL */}
          {application.jobPostingUrl && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
              <div className="flex items-center gap-2 overflow-hidden mr-3">
                <ExternalLink className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs text-indigo-200 truncate font-mono">
                  {application.jobPostingUrl}
                </span>
              </div>
              <a
                href={application.jobPostingUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 px-3 py-1 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition inline-flex items-center gap-1"
              >
                Open Posting
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Job Description */}
          {application.jobDescription && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Job Description
              </h3>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {application.jobDescription}
              </div>
            </div>
          )}

          {/* Job Requirements */}
          {application.jobRequirements && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                Requirements & Qualifications
              </h3>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {application.jobRequirements}
              </div>
            </div>
          )}

          {/* Notes */}
          {application.notes && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Notes & Contacts
              </h3>
              <div className="p-4 rounded-xl bg-amber-950/15 border border-amber-500/20 text-sm text-amber-200/90 whitespace-pre-wrap leading-relaxed">
                {application.notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            onClick={() => onDelete(application)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg border border-rose-500/20 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(application)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Application
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
