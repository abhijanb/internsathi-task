import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, type ApplicationFormSchema } from "../schema/applicationSchema";
import { JOB_TYPES, STATUSES } from "../../../shared/types/application";
import type { Application } from "../../../shared/types/application";

interface Props {
  application?: Application | null;
  onSubmit: (data: ApplicationFormSchema) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

function toFormData(app: Application): ApplicationFormSchema {
  return {
    companyName: app.companyName,
    jobTitle: app.jobTitle,
    jobType: app.jobType,
    status: app.status,
    appliedDate: app.appliedDate.split("T")[0] ?? "",
    notes: app.notes ?? "",
  };
}

const emptyForm: ApplicationFormSchema = {
  companyName: "",
  jobTitle: "",
  jobType: "Full-time",
  status: "Applied",
  appliedDate: new Date().toISOString().split("T")[0] ?? "",
  notes: "",
};

export function ApplicationForm({ application, onSubmit, onCancel, isSubmitting }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormSchema>({
    resolver: zodResolver(applicationSchema),
    defaultValues: emptyForm,
  });

  useEffect(() => {
    reset(application ? toFormData(application) : emptyForm);
  }, [application, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("companyName")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g. Google"
        />
        {errors.companyName && (
          <p className="mt-1 text-xs text-red-500">{errors.companyName.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("jobTitle")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g. Software Engineer"
        />
        {errors.jobTitle && (
          <p className="mt-1 text-xs text-red-500">{errors.jobTitle.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Job Type</label>
          <select
            {...register("jobType")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register("status")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Applied Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register("appliedDate")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {errors.appliedDate && (
          <p className="mt-1 text-xs text-red-500">{errors.appliedDate.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          {...register("notes")}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Optional notes..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : application ? "Update" : "Add Application"}
        </button>
      </div>
    </form>
  );
}
