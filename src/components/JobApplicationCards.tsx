"use client";

import React from "react";
import { ApplicationStatus, JobApplication } from "@/types/job";
import {
  STATUS_CONFIG,
  WORK_MODE_CONFIG,
  JOB_TYPE_CONFIG,
  formatDate,
  formatCurrency,
} from "@/lib/utils";
import {
  Building2,
  MapPin,
  ExternalLink,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  DollarSign,
} from "lucide-react";

interface JobApplicationCardsProps {
  applications: JobApplication[];
  onView: (app: JobApplication) => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

export const JobApplicationCards: React.FC<JobApplicationCardsProps> = ({
  applications,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (applications.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {applications.map((app) => {
        const statusCfg = STATUS_CONFIG[app.applicationStatus] || {
          label: app.applicationStatus,
          bg: "bg-slate-500/10",
          text: "text-slate-400",
          border: "border-slate-500/20",
          dot: "bg-slate-400",
        };
        const workModeCfg = WORK_MODE_CONFIG[app.workMode];
        const jobTypeCfg = JOB_TYPE_CONFIG[app.jobType];

        return (
          <div
            key={app._id}
            className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between group relative"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 font-bold text-indigo-400 flex items-center justify-center text-sm shadow-sm shrink-0">
                    {app.companyName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3
                      onClick={() => onView(app)}
                      className="font-bold text-white text-base hover:text-indigo-400 transition cursor-pointer line-clamp-1"
                    >
                      {app.jobTitle}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {app.companyName}
                    </p>
                  </div>
                </div>

                {app.jobPostingUrl && (
                  <a
                    href={app.jobPostingUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Open original job posting"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Badges & Meta */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="relative">
                  <select
                    value={app.applicationStatus}
                    onChange={(e) =>
                      onStatusChange(app._id, e.target.value as ApplicationStatus)
                    }
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border} bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer`}
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview">Interview</option>
                    <option value="Technical Assessment">Tech Assessment</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Withdrawn">Withdrawn</option>
                  </select>
                </div>

                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                    workModeCfg?.bg || "bg-slate-800"
                  } ${workModeCfg?.text || "text-slate-300"}`}
                >
                  {app.workMode}
                </span>

                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                    jobTypeCfg?.bg || "bg-slate-800"
                  } ${jobTypeCfg?.text || "text-slate-300"}`}
                >
                  {app.jobType}
                </span>
              </div>

              {/* Information Rows */}
              <div className="space-y-1.5 text-xs text-slate-400 mb-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                {app.jobLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{app.jobLocation}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Applied on {formatDate(app.applicationDate)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {app.offeredSalary ? (
                      <span className="text-emerald-400 font-semibold">
                        Offer: {formatCurrency(app.offeredSalary, app.salaryCurrency)}
                      </span>
                    ) : app.expectedSalary ? (
                      <span>
                        Exp: {formatCurrency(app.expectedSalary, app.salaryCurrency)}
                      </span>
                    ) : app.salaryRange ? (
                      <span>Range: {app.salaryRange}</span>
                    ) : (
                      <span>Salary not specified</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Notes excerpt if any */}
              {app.notes && (
                <p className="text-xs text-slate-400 italic line-clamp-2 mb-3 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800/40">
                  &ldquo;{app.notes}&rdquo;
                </p>
              )}
            </div>

            {/* Card Footer Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => onView(app)}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(app)}
                  title="Edit"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(app)}
                  title="Delete"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
