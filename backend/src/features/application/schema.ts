import { z } from "zod";

export const jobTypes = ["Internship", "Full-time", "Part-time"] as const;
export const statuses = ["Applied", "Interviewing", "Offer", "Rejected"] as const;

export const applicationSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobType: z.enum(jobTypes),
  status: z.enum(statuses),
  appliedDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  notes: z.string().optional().nullable(),
});

export const applicationUpdateSchema = applicationSchema.partial();

export const applicationQuerySchema = z.object({
  status: z.enum(statuses).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ApplicationUpdate = z.infer<typeof applicationUpdateSchema>;
export type ApplicationQuery = z.infer<typeof applicationQuerySchema>;
