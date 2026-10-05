"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ApplicationStats,
  ApplicationStatus,
  JobApplication,
  JobApplicationFormData,
} from "@/types/job";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { StatsCards } from "@/components/StatsCards";
import { FilterBar } from "@/components/FilterBar";
import { JobApplicationTable } from "@/components/JobApplicationTable";
import { JobApplicationCards } from "@/components/JobApplicationCards";
import { JobApplicationModal } from "@/components/JobApplicationModal";
import { JobDetailsModal } from "@/components/JobDetailsModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { LoginPage } from "@/components/LoginPage";
import { useAuth } from "@/context/AuthContext";
import {
  Briefcase,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Inbox,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // State
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [jobType, setJobType] = useState<string>("all");
  const [workMode, setWorkMode] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("applicationDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [viewingApplication, setViewingApplication] = useState<JobApplication | null>(null);
  const [deletingApplication, setDeletingApplication] = useState<JobApplication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError(null);
      const [appRes, statsRes] = await Promise.all([
        api.getApplications({
          search,
          status,
          jobType,
          workMode,
          sortBy,
          sortOrder,
        }),
        api.getStats().catch(() => null),
      ]);

      setApplications(appRes.data || []);
      if (statsRes) setStats(statsRes);
    } catch (err: any) {
      console.error("Failed to load applications:", err);
      setError(err.message || "Failed to connect to backend server. Make sure MongoDB and backend are running.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, search, status, jobType, workMode, sortBy, sortOrder]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // If checking auth state, show smooth loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Verifying session...</p>
      </div>
    );
  }

  // If not logged in, render the login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Form Submit Handler (Create or Edit)
  const handleSubmitApplication = async (formData: JobApplicationFormData) => {
    try {
      setIsSubmitting(true);
      if (editingApplication) {
        const updated = await api.updateApplication(editingApplication._id, formData);
        showNotification(`Application for "${updated.jobTitle}" at ${updated.companyName} updated!`);
      } else {
        const created = await api.createApplication(formData);
        showNotification(`Application for "${created.jobTitle}" at ${created.companyName} logged!`);
      }
      setIsAddModalOpen(false);
      setEditingApplication(null);
      await loadData();
    } catch (err: any) {
      showNotification(err.message || "Operation failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Inline Status Change Handler
  const handleQuickStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    try {
      await api.updateApplication(id, { applicationStatus: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, applicationStatus: newStatus } : app))
      );
      // Reload stats in background
      api.getStats().then((s) => s && setStats(s)).catch(() => {});
      showNotification(`Status updated to ${newStatus}`);
    } catch (err: any) {
      showNotification(err.message || "Failed to update status", "error");
    }
  };

  // Delete Handler
  const handleConfirmDelete = async () => {
    if (!deletingApplication) return;
    try {
      setIsDeleting(true);
      await api.deleteApplication(deletingApplication._id);
      showNotification(`Application for "${deletingApplication.jobTitle}" deleted.`);
      setDeletingApplication(null);
      if (viewingApplication?._id === deletingApplication._id) {
        setViewingApplication(null);
      }
      await loadData();
    } catch (err: any) {
      showNotification(err.message || "Failed to delete application", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setJobType("all");
    setWorkMode("all");
    setSortBy("applicationDate");
    setSortOrder("desc");
  };

  const hasActiveFilters =
    Boolean(search) ||
    status !== "all" ||
    jobType !== "all" ||
    workMode !== "all" ||
    sortBy !== "applicationDate" ||
    sortOrder !== "desc";

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Navbar */}
      <Navbar
        onOpenAddModal={() => {
          setEditingApplication(null);
          setIsAddModalOpen(true);
        }}
        totalApplications={stats?.total || applications.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Notification */}
        {notification && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium border animate-slideUp ${
              notification.type === "success"
                ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/30 backdrop-blur-md"
                : "bg-rose-950/90 text-rose-200 border-rose-500/30 backdrop-blur-md"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Application Tracker
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Organize, track salaries, and monitor status updates for all your job opportunities.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={loadData}
              disabled={loading}
              title="Refresh data"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <StatsCards
          stats={stats}
          selectedStatus={status}
          onSelectStatus={(st) => setStatus(st)}
        />

        {/* Filters & View Switches */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          jobType={jobType}
          onJobTypeChange={setJobType}
          workMode={workMode}
          onWorkModeChange={setWorkMode}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderToggle={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Backend Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-300 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-rose-200">Unable to load job applications</h4>
              <p className="text-xs text-rose-300/80 mt-1">{error}</p>
              <button
                onClick={loadData}
                className="mt-2 text-xs font-semibold text-rose-400 hover:text-rose-200 underline cursor-pointer"
              >
                Click here to retry
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        {loading && applications.length === 0 ? (
          <div className="py-24 text-center glass-card rounded-2xl border border-slate-800">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-medium">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 px-4 text-center glass-card rounded-2xl border border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {hasActiveFilters ? "No matching applications found" : "No job applications yet"}
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-5">
              {hasActiveFilters
                ? "Try clearing your filters or search query to view all applications."
                : "Start tracking your career opportunities by logging your first job application."}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
              >
                Clear All Filters
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingApplication(null);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Application</span>
              </button>
            )}
          </div>
        ) : viewMode === "table" ? (
          <JobApplicationTable
            applications={applications}
            onView={(app) => setViewingApplication(app)}
            onEdit={(app) => {
              setEditingApplication(app);
              setIsAddModalOpen(true);
            }}
            onDelete={(app) => setDeletingApplication(app)}
            onStatusChange={handleQuickStatusChange}
          />
        ) : (
          <JobApplicationCards
            applications={applications}
            onView={(app) => setViewingApplication(app)}
            onEdit={(app) => {
              setEditingApplication(app);
              setIsAddModalOpen(true);
            }}
            onDelete={(app) => setDeletingApplication(app)}
            onStatusChange={handleQuickStatusChange}
          />
        )}
      </main>

      {/* Add / Edit Modal */}
      <JobApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingApplication(null);
        }}
        onSubmit={handleSubmitApplication}
        initialData={editingApplication}
        isSubmitting={isSubmitting}
      />

      {/* Details Modal */}
      <JobDetailsModal
        application={viewingApplication}
        onClose={() => setViewingApplication(null)}
        onEdit={(app) => {
          setViewingApplication(null);
          setEditingApplication(app);
          setIsAddModalOpen(true);
        }}
        onDelete={(app) => {
          setViewingApplication(null);
          setDeletingApplication(app);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingApplication}
        application={deletingApplication}
        onClose={() => setDeletingApplication(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
