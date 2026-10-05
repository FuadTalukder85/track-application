import {
  ApplicationStats,
  ApplicationsResponse,
  JobApplication,
  JobApplicationFormData,
} from "@/types/job";
import { AuthResponse, AuthUser, LoginCredentials } from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("careertrack_auth_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface FetchApplicationsParams {
  search?: string;
  status?: string;
  jobType?: string;
  workMode?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const api = {
  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse["data"]> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Login failed. Please verify your email and password.");
    }

    return data.data;
  },

  async getMe(): Promise<AuthUser> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Failed to authenticate session");
    }

    return data.data.user;
  },

  // Applications
  async getApplications(
    params: FetchApplicationsParams = {}
  ): Promise<ApplicationsResponse> {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.status && params.status !== "all")
      query.append("status", params.status);
    if (params.jobType && params.jobType !== "all")
      query.append("jobType", params.jobType);
    if (params.workMode && params.workMode !== "all")
      query.append("workMode", params.workMode);
    if (params.sortBy) query.append("sortBy", params.sortBy);
    if (params.sortOrder) query.append("sortOrder", params.sortOrder);
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));

    const res = await fetch(`${API_BASE_URL}/applications?${query.toString()}`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch applications");
    }

    return res.json();
  },

  async getApplicationById(id: string): Promise<JobApplication> {
    const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch application");
    }

    const data = await res.json();
    return data.data;
  },

  async createApplication(
    formData: JobApplicationFormData
  ): Promise<JobApplication> {
    const res = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create application");
    }

    const data = await res.json();
    return data.data;
  },

  async updateApplication(
    id: string,
    formData: Partial<JobApplicationFormData>
  ): Promise<JobApplication> {
    const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update application");
    }

    const data = await res.json();
    return data.data;
  },

  async deleteApplication(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to delete application");
    }
  },

  async getStats(): Promise<ApplicationStats> {
    const res = await fetch(`${API_BASE_URL}/applications/stats`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch application stats");
    }

    const data = await res.json();
    return data.data;
  },
};
