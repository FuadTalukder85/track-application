export type JobType =
  | 'Full-time'
  | 'Part-time'
  | 'Contract'
  | 'Internship'
  | 'Freelance'
  | 'Other';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export type ApplicationStatus =
  | 'Wishlist'
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Technical Assessment'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface JobApplication {
  _id: string;
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  jobRequirements?: string;
  jobLocation?: string;
  jobType: JobType;
  workMode: WorkMode;
  jobPostingUrl?: string;
  applicationDate: string;
  salaryRange?: string;
  expectedSalary?: number | null;
  currentSalary?: number | null;
  offeredSalary?: number | null;
  salaryCurrency: string;
  applicationStatus: ApplicationStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type JobApplicationFormData = Omit<JobApplication, '_id' | 'createdAt' | 'updatedAt'>;

export interface ApplicationStats {
  total: number;
  statusCounts: Record<ApplicationStatus, number>;
  workModeCounts: { _id: WorkMode; count: number }[];
  jobTypeCounts: { _id: JobType; count: number }[];
}

export interface ApplicationsResponse {
  success: boolean;
  total: number;
  count: number;
  page: number;
  totalPages: number;
  data: JobApplication[];
}
