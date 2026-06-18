export const JOB_TYPES = ["Internship", "Full-time", "Part-time"] as const;
export const STATUSES = ["Applied", "Interviewing", "Offer", "Rejected"] as const;

export type JobType = (typeof JOB_TYPES)[number];
export type ApplicationStatus = (typeof STATUSES)[number];

export interface Application {
  id: number;
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFormData {
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApplicationListResponse {
  applications: Application[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
