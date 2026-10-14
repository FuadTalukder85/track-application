"use client";

import React, { useState, useEffect } from "react";
import {
  ApplicationStatus,
  JobApplication,
  JobApplicationFormData,
  JobType,
  WorkMode,
} from "@/types/job";
import {
  X,
  Building2,
  Briefcase,
  MapPin,
  Globe,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle2,
  Link as LinkIcon,
  Tag,
  Sparkles,
  ClipboardPaste,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { parseJobDescription } from "@/lib/jobParser";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: JobApplicationFormData) => Promise<void>;
  initialData?: JobApplication | null;
  prefillData?: Partial<JobApplicationFormData> | null;
  isSubmitting: boolean;
}

const defaultFormData: JobApplicationFormData = {
  companyName: "",
  jobTitle: "",
  jobDescription: "",
  jobRequirements: "",
  jobLocation: "",
  jobType: "Full-time",
  workMode: "Remote",
  jobPostingUrl: "",
  applicationDate: new Date().toISOString().split("T")[0],
  salaryRange: "",
  expectedSalary: null,
  currentSalary: null,
  offeredSalary: null,
  salaryCurrency: "USD",
  applicationStatus: "Applied",
  notes: "",
};

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  prefillData,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<JobApplicationFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rawPasteText, setRawPasteText] = useState("");
  const [isAiBoxExpanded, setIsAiBoxExpanded] = useState(true);
  const [autoFillSuccess, setAutoFillSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || "",
        jobTitle: initialData.jobTitle || "",
        jobDescription: initialData.jobDescription || "",
        jobRequirements: initialData.jobRequirements || "",
        jobLocation: initialData.jobLocation || "",
        jobType: initialData.jobType || "Full-time",
        workMode: initialData.workMode || "Remote",
        jobPostingUrl: initialData.jobPostingUrl || "",
        applicationDate: initialData.applicationDate
          ? new Date(initialData.applicationDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        salaryRange: initialData.salaryRange || "",
        expectedSalary: initialData.expectedSalary ?? null,
        currentSalary: initialData.currentSalary ?? null,
        offeredSalary: initialData.offeredSalary ?? null,
        salaryCurrency: initialData.salaryCurrency || "USD",
        applicationStatus: initialData.applicationStatus || "Applied",
        notes: initialData.notes || "",
      });
      setIsAiBoxExpanded(false);
    } else if (prefillData) {
      setFormData({
        ...defaultFormData,
        ...prefillData,
        applicationDate: prefillData.applicationDate || new Date().toISOString().split("T")[0],
      });
      setIsAiBoxExpanded(true);
      if (prefillData.companyName || prefillData.jobTitle) {
        setAutoFillSuccess(`Auto-filled: ${[prefillData.companyName, prefillData.jobTitle].filter(Boolean).join(" - ")}`);
      }
    } else {
      setFormData({
        ...defaultFormData,
        applicationDate: new Date().toISOString().split("T")[0],
      });
      setIsAiBoxExpanded(true);
    }
    setErrors({});
  }, [initialData, prefillData, isOpen]);

  const handleAutoFill = () => {
    if (!rawPasteText.trim()) return;
    const parsed = parseJobDescription(rawPasteText);
    setFormData((prev) => ({
      ...prev,
      companyName: parsed.companyName || prev.companyName,
      jobTitle: parsed.jobTitle || prev.jobTitle,
      jobLocation: parsed.jobLocation || prev.jobLocation,
      jobType: (parsed.jobType as JobType) || prev.jobType,
      workMode: (parsed.workMode as WorkMode) || prev.workMode,
      jobPostingUrl: parsed.jobPostingUrl || prev.jobPostingUrl,
      salaryRange: parsed.salaryRange || prev.salaryRange,
      expectedSalary: parsed.expectedSalary ?? prev.expectedSalary,
      salaryCurrency: parsed.salaryCurrency || prev.salaryCurrency,
      jobDescription: parsed.jobDescription || prev.jobDescription,
      jobRequirements: parsed.jobRequirements || prev.jobRequirements,
    }));

    const filledList = [
      parsed.companyName && "Company",
      parsed.jobTitle && "Title",
      parsed.jobLocation && "Location",
      parsed.salaryRange && "Salary",
      parsed.jobRequirements && "Requirements",
    ].filter(Boolean);

    setAutoFillSuccess(
      filledList.length > 0
        ? `Successfully auto-filled: ${filledList.join(", ")}!`
        : "Text analyzed and form updated!"
    );
    setTimeout(() => setAutoFillSuccess(null), 6000);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setRawPasteText(text);
      }
    } catch {
      // Clipboard access denied
    }
  };

  const handleSampleAutoFill = () => {
    const sample = `Company: Stripe\nRole: Senior Frontend Engineer\nLocation: San Francisco, CA (Remote)\nJob Type: Full-time\nWork Mode: Remote\nSalary: $150,000 - $180,000 USD\nURL: https://stripe.com/jobs/senior-frontend\n\nAbout the job:\nBuilding world-class developer dashboard experiences using React and Next.js.\n\nRequirements:\n- 5+ years of experience with React & TypeScript\n- Strong experience in modern CSS and Web performance`;
    setRawPasteText(sample);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const isEdit = !!initialData;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEdit ? "Edit Application" : "Log New Job Application"}
              </h2>
              <p className="text-xs text-slate-400">
                {isEdit
                  ? "Update application details, stage, and salary"
                  : "Track a new job opportunity and save specifics"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI Quick Auto-fill from Job Details */}
          {!isEdit && (
            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900/60 p-4 shadow-lg shadow-indigo-950/20 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Smart Auto-Fill from Job Details</span>
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-semibold tracking-wider uppercase">
                        AI Assist
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Paste a job description or email to auto-fill Company, Title, Location, Salary & Requirements
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAiBoxExpanded(!isAiBoxExpanded)}
                  className="px-2.5 py-1 text-xs text-indigo-300 hover:text-white rounded-lg hover:bg-indigo-900/40 border border-indigo-500/20 flex items-center gap-1 transition cursor-pointer"
                >
                  {isAiBoxExpanded ? (
                    <>
                      <span>Collapse</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Paste & Auto-Fill</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {isAiBoxExpanded && (
                <div className="mt-3.5 pt-3 border-t border-indigo-500/20 space-y-2.5 animate-fadeIn">
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={rawPasteText}
                      onChange={(e) => setRawPasteText(e.target.value)}
                      placeholder="Paste full job posting text here (from LinkedIn, Indeed, Glassdoor, or email)..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-indigo-500/30 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 resize-none font-sans"
                    />
                  </div>

                  {autoFillSuccess && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs animate-fadeIn">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{autoFillSuccess}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAutoFill}
                        disabled={!rawPasteText.trim()}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 disabled:opacity-40 text-white font-medium text-xs shadow-md shadow-indigo-600/30 transition hover:scale-[1.02] cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Auto-Fill Form</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePasteClipboard}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs transition border border-slate-700 cursor-pointer"
                      >
                        <ClipboardPaste className="w-3 h-3 text-cyan-400" />
                        <span>Paste Clipboard</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSampleAutoFill}
                        className="text-[11px] text-indigo-300 hover:text-indigo-200 underline underline-offset-2 cursor-pointer"
                      >
                        Try Sample Job
                      </button>
                      {rawPasteText && (
                        <button
                          type="button"
                          onClick={() => {
                            setRawPasteText("");
                            setAutoFillSuccess(null);
                          }}
                          className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 1: Company & Role */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Company & Role Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Company Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Stripe, Meta"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className={`w-full px-3.5 py-2 rounded-xl glass-input text-sm ${
                    errors.companyName ? "border-rose-500 ring-1 ring-rose-500" : ""
                  }`}
                />
                {errors.companyName && (
                  <p className="mt-1 text-xs text-rose-400">{errors.companyName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Job Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  className={`w-full px-3.5 py-2 rounded-xl glass-input text-sm ${
                    errors.jobTitle ? "border-rose-500 ring-1 ring-rose-500" : ""
                  }`}
                />
                {errors.jobTitle && (
                  <p className="mt-1 text-xs text-rose-400">{errors.jobTitle}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Job Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. New York / Remote"
                    value={formData.jobLocation}
                    onChange={(e) =>
                      setFormData({ ...formData, jobLocation: e.target.value })
                    }
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Job Type
                </label>
                <select
                  value={formData.jobType}
                  onChange={(e) =>
                    setFormData({ ...formData, jobType: e.target.value as JobType })
                  }
                  className="w-full px-3.5 py-2 rounded-xl glass-input bg-slate-900 text-sm cursor-pointer"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Work Mode
                </label>
                <select
                  value={formData.workMode}
                  onChange={(e) =>
                    setFormData({ ...formData, workMode: e.target.value as WorkMode })
                  }
                  className="w-full px-3.5 py-2 rounded-xl glass-input bg-slate-900 text-sm cursor-pointer"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Application Pipeline & Posting */}
          <div className="space-y-4 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Pipeline Status & Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Application Status
                </label>
                <select
                  value={formData.applicationStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applicationStatus: e.target.value as ApplicationStatus,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl glass-input bg-slate-900 text-sm font-medium cursor-pointer"
                >
                  <option value="Wishlist">Wishlist</option>
                  <option value="Applied">Applied</option>
                  <option value="Screening">Screening</option>
                  <option value="Interview">Interview</option>
                  <option value="Technical Assessment">Technical Assessment</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Application Date
                </label>
                <input
                  type="date"
                  value={formData.applicationDate}
                  onChange={(e) =>
                    setFormData({ ...formData, applicationDate: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-sm cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Job Posting URL
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://company.com/careers/..."
                    value={formData.jobPostingUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, jobPostingUrl: e.target.value })
                    }
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Salary & Compensation */}
          <div className="space-y-4 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Salary & Compensation
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Currency
                </label>
                <select
                  value={formData.salaryCurrency}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryCurrency: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl glass-input bg-slate-900 text-sm cursor-pointer"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="BDT">BDT (৳)</option>
                  <option value="SGD">SGD (S$)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Salary Range
                </label>
                <input
                  type="text"
                  placeholder="e.g. $120k - $150k"
                  value={formData.salaryRange}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryRange: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Expected Salary
                </label>
                <input
                  type="number"
                  placeholder="e.g. 130000"
                  value={formData.expectedSalary ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expectedSalary: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Offered Salary
                </label>
                <input
                  type="number"
                  placeholder="e.g. 140000"
                  value={formData.offeredSalary ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      offeredSalary: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Current Salary (Optional reference)
              </label>
              <input
                type="number"
                placeholder="e.g. 100000"
                value={formData.currentSalary ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentSalary: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          {/* Section 4: Description, Requirements & Notes */}
          <div className="space-y-4 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Description, Requirements & Notes
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Job Description
              </label>
              <textarea
                rows={2}
                placeholder="Overview of the position, team, mission..."
                value={formData.jobDescription}
                onChange={(e) =>
                  setFormData({ ...formData, jobDescription: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Job Requirements
              </label>
              <textarea
                rows={2}
                placeholder="Key tech stack, years of experience, certifications..."
                value={formData.jobRequirements}
                onChange={(e) =>
                  setFormData({ ...formData, jobRequirements: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Personal Notes / Follow-ups
              </label>
              <textarea
                rows={2}
                placeholder="Interview rounds, recruiter contact, referral person, follow-up dates..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? "Saving..." : isEdit ? "Update Application" : "Save Application"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
