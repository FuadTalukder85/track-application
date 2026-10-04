import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApplicationStatus, JobType, WorkMode } from "@/types/job";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatCurrency(
  amount?: number | null,
  currency: string = "USD"
): string {
  if (amount === undefined || amount === null || isNaN(amount)) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  Wishlist: {
    label: "Wishlist",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
    dot: "bg-slate-400",
  },
  Applied: {
    label: "Applied",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
  },
  Screening: {
    label: "Screening",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    dot: "bg-cyan-400",
  },
  Interview: {
    label: "Interview",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  "Technical Assessment": {
    label: "Tech Assessment",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    dot: "bg-purple-400",
  },
  Offer: {
    label: "Offer Received",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  Rejected: {
    label: "Rejected",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
    dot: "bg-rose-400",
  },
  Withdrawn: {
    label: "Withdrawn",
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    border: "border-zinc-500/20",
    dot: "bg-zinc-400",
  },
};

export const WORK_MODE_CONFIG: Record<
  WorkMode,
  { label: string; bg: string; text: string }
> = {
  Remote: {
    label: "Remote",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
  },
  Hybrid: {
    label: "Hybrid",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
  },
  "On-site": {
    label: "On-site",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
  },
};

export const JOB_TYPE_CONFIG: Record<
  JobType,
  { label: string; bg: string; text: string }
> = {
  "Full-time": {
    label: "Full-time",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
  },
  "Part-time": {
    label: "Part-time",
    bg: "bg-teal-500/10",
    text: "text-teal-400",
  },
  Contract: {
    label: "Contract",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
  },
  Internship: {
    label: "Internship",
    bg: "bg-pink-500/10",
    text: "text-pink-400",
  },
  Freelance: {
    label: "Freelance",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
  },
  Other: {
    label: "Other",
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
  },
};
