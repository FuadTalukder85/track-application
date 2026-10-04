"use client";

import React from "react";
import { ApplicationStats } from "@/types/job";
import {
  Layers,
  Send,
  Users,
  Award,
  XCircle,
  Briefcase,
  Globe2,
} from "lucide-react";

interface StatsCardsProps {
  stats: ApplicationStats | null;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  selectedStatus,
  onSelectStatus,
}) => {
  const total = stats?.total || 0;
  const appliedCount = (stats?.statusCounts?.Applied || 0) + (stats?.statusCounts?.Wishlist || 0);
  const interviewCount =
    (stats?.statusCounts?.Interview || 0) +
    (stats?.statusCounts?.Screening || 0) +
    (stats?.statusCounts?.["Technical Assessment"] || 0);
  const offerCount = stats?.statusCounts?.Offer || 0;
  const rejectedCount = stats?.statusCounts?.Rejected || 0;

  const cards = [
    {
      id: "all",
      title: "Total Applied",
      value: total,
      icon: Layers,
      color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400",
      iconBg: "bg-blue-500/10 text-blue-400",
      filterValue: "all",
      subtext: "All applications",
    },
    {
      id: "applied",
      title: "In Pipeline",
      value: appliedCount,
      icon: Send,
      color: "from-cyan-500/20 to-sky-500/20 border-cyan-500/30 text-cyan-400",
      iconBg: "bg-cyan-500/10 text-cyan-400",
      filterValue: "Applied",
      subtext: "Applied & Wishlist",
    },
    {
      id: "interview",
      title: "Interviews & Tech",
      value: interviewCount,
      icon: Users,
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
      iconBg: "bg-amber-500/10 text-amber-400",
      filterValue: "Interview",
      subtext: "Screening & Assessment",
    },
    {
      id: "offer",
      title: "Offers",
      value: offerCount,
      icon: Award,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
      iconBg: "bg-emerald-500/10 text-emerald-400",
      filterValue: "Offer",
      subtext: "Success rate: " + (total > 0 ? `${Math.round((offerCount / total) * 100)}%` : "0%"),
    },
    {
      id: "rejected",
      title: "Archived / Rejected",
      value: rejectedCount,
      icon: XCircle,
      color: "from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400",
      iconBg: "bg-rose-500/10 text-rose-400",
      filterValue: "Rejected",
      subtext: "Closed applications",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {cards.map((card) => {
        const isSelected = selectedStatus === card.filterValue;
        const Icon = card.icon;

        return (
          <button
            key={card.id}
            onClick={() => onSelectStatus(isSelected && card.filterValue !== 'all' ? 'all' : card.filterValue)}
            className={`text-left p-4 rounded-2xl glass-card transition-all duration-200 cursor-pointer ${
              isSelected
                ? `ring-2 ring-indigo-500 bg-slate-900/90 shadow-lg shadow-indigo-500/10`
                : `hover:border-slate-700 hover:bg-slate-900/60`
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {card.value}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 truncate">{card.subtext}</p>
          </button>
        );
      })}
    </div>
  );
};
