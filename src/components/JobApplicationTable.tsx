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
} from "lucide-react";

interface JobApplicationTableProps {
  applications: JobApplication[];
  onView: (app: JobApplication) => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

export const JobApplicationTable: React.FC<JobApplicationTableProps> = ({
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
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-4 px-5">Company & Role</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Type / Mode</th>
              <th className="py-4 px-4">Location</th>
              <th className="py-4 px-4">Applied Date</th>
              <th className="py-4 px-4">Salary Info</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
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
                <tr
                  key={app._id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Company & Role */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-bold text-white text-sm shrink-0 border border-slate-700 shadow-sm">
                        {app.companyName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onView(app)}
                            className="font-semibold text-white hover:text-indigo-400 text-sm transition text-left truncate cursor-pointer"
                          >
                            {app.jobTitle}
                          </button>
                          {app.jobPostingUrl && (
                            <a
                              href={app.jobPostingUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="Open original job posting"
                              className="text-slate-500 hover:text-indigo-400 transition shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>{app.companyName}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-4 px-4">
                    <div className="relative inline-block">
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
                  </td>

                  {/* Type / Mode */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span
                        className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                          workModeCfg?.bg || "bg-slate-800"
                        } ${workModeCfg?.text || "text-slate-300"}`}
                      >
                        {app.workMode}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                          jobTypeCfg?.bg || "bg-slate-800"
                        } ${jobTypeCfg?.text || "text-slate-300"}`}
                      >
                        {app.jobType}
                      </span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-4 px-4">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[120px]">
                        {app.jobLocation || "Not specified"}
                      </span>
                    </span>
                  </td>

                  {/* Applied Date */}
                  <td className="py-4 px-4">
                    <span className="text-xs text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {formatDate(app.applicationDate)}
                    </span>
                  </td>

                  {/* Salary Info */}
                  <td className="py-4 px-4">
                    <div className="text-xs space-y-0.5">
                      {app.offeredSalary ? (
                        <span className="font-semibold text-emerald-400 block">
                          Offer: {formatCurrency(app.offeredSalary, app.salaryCurrency)}
                        </span>
                      ) : app.expectedSalary ? (
                        <span className="text-slate-300 block">
                          Exp: {formatCurrency(app.expectedSalary, app.salaryCurrency)}
                        </span>
                      ) : app.salaryRange ? (
                        <span className="text-slate-400 block truncate max-w-[130px]">
                          {app.salaryRange}
                        </span>
                      ) : (
                        <span className="text-slate-600 block">—</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onView(app)}
                        title="View Details"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(app)}
                        title="Edit Application"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(app)}
                        title="Delete Application"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
