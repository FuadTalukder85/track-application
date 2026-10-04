"use client";

import React from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
} from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  jobType: string;
  onJobTypeChange: (value: string) => void;
  workMode: string;
  onWorkModeChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderToggle: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  jobType,
  onJobTypeChange,
  workMode,
  onWorkModeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  onResetFilters,
  hasActiveFilters,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="glass-card p-4 rounded-2xl mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-input"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search company, job title, location, notes, keywords..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-sm placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/50"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 self-end md:self-auto">
          <button
            onClick={() => onViewModeChange("table")}
            title="Table View"
            className={`p-2 rounded-lg text-xs font-medium transition-all ${
              viewMode === "table"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("cards")}
            title="Card View"
            className={`p-2 rounded-lg text-xs font-medium transition-all ${
              viewMode === "cards"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Select Filters Row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-slate-800/60">
        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Filters:</span>
        </div>

        {/* Status */}
        <select
          id="filter-status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg glass-input bg-slate-900 border border-slate-700/80 text-slate-200 cursor-pointer focus:border-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="Wishlist">Wishlist</option>
          <option value="Applied">Applied</option>
          <option value="Screening">Screening</option>
          <option value="Interview">Interview</option>
          <option value="Technical Assessment">Tech Assessment</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>

        {/* Job Type */}
        <select
          id="filter-job-type"
          value={jobType}
          onChange={(e) => onJobTypeChange(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg glass-input bg-slate-900 border border-slate-700/80 text-slate-200 cursor-pointer focus:border-indigo-500"
        >
          <option value="all">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="Freelance">Freelance</option>
          <option value="Other">Other</option>
        </select>

        {/* Work Mode */}
        <select
          id="filter-work-mode"
          value={workMode}
          onChange={(e) => onWorkModeChange(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg glass-input bg-slate-900 border border-slate-700/80 text-slate-200 cursor-pointer focus:border-indigo-500"
        >
          <option value="all">All Work Modes</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>

        {/* Sort By */}
        <div className="flex items-center gap-1 ml-auto">
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg glass-input bg-slate-900 border border-slate-700/80 text-slate-200 cursor-pointer focus:border-indigo-500"
          >
            <option value="applicationDate">Date Applied</option>
            <option value="companyName">Company</option>
            <option value="jobTitle">Job Title</option>
            <option value="expectedSalary">Expected Salary</option>
            <option value="updatedAt">Last Updated</option>
          </select>

          <button
            onClick={onSortOrderToggle}
            title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 transition"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
