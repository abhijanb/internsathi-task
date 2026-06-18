import { z } from "zod";
import { JOB_TYPES, STATUSES } from "../../../shared/types/application";

export const applicationSchema = z.object({
  companyName: z.string().min(2, "Must be at least 2 characters"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobType: z.enum(JOB_TYPES),
  status: z.enum(STATUSES),
  appliedDate: z.string().min(1, "Applied date is required"),
  notes: z.string(),
});

export type ApplicationFormSchema = z.infer<typeof applicationSchema>;
