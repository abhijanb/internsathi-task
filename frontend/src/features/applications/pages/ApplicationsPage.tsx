import { useState, useCallback } from "react";
import { format } from "date-fns";
import { Modal } from "../../../shared/components/Modal";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { ApplicationForm } from "../components/ApplicationForm";
import { ConfirmDialog } from "../components/ConfirmDialog";
import {
  useGetApplicationsQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
} from "../../../shared/store/api";
import { STATUSES } from "../../../shared/types/application";
import type { Application } from "../../../shared/types/application";

export function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formModal, setFormModal] = useState<{ open: boolean; application: Application | null }>({
    open: false,
    application: null,
  });
  const [detailModal, setDetailModal] = useState<{ open: boolean; application: Application | null }>({
    open: false,
    application: null,
  });
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

  const { data, isLoading, isError, error } = useGetApplicationsQuery({
    status: statusFilter || undefined,
    search: debouncedSearch || undefined,
    page,
    limit: 10,
  });

  const [createApplication, { isLoading: isCreating }] = useCreateApplicationMutation();
  const [updateApplication, { isLoading: isUpdating }] = useUpdateApplicationMutation();
  const [deleteApplication, { isLoading: isDeleting }] = useDeleteApplicationMutation();

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const statusColor: Record<string, string> = {
    Applied: "bg-blue-100 text-blue-800",
    Interviewing: "bg-yellow-100 text-yellow-800",
    Offer: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Applications</h1>
        <button
          onClick={() => setFormModal({ open: true, application: null })}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Add Application
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by company or job title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {isLoading && <LoadingSpinner className="py-20" size="lg" />}

      {isError && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {(error as { data?: { error?: string } })?.data?.error ??
            (error as { error?: string })?.error ??
            "Failed to load applications"}
        </div>
      )}

      {data && data.applications.length === 0 && (
        <div className="py-20 text-center text-gray-500">
          <p className="text-lg font-medium">No applications found</p>
          <p className="mt-1 text-sm">Add a new application to get started.</p>
        </div>
      )}

      {data && data.applications.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Job Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Applied</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {app.companyName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {app.jobTitle}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {app.jobType}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor[app.status] ?? ""}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {format(new Date(app.appliedDate), "MMM d, yyyy")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                      <button
                        onClick={() => setDetailModal({ open: true, application: app })}
                        className="mr-2 text-indigo-600 hover:text-indigo-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setFormModal({ open: true, application: app })}
                        className="mr-2 text-gray-600 hover:text-gray-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(app)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(data.pagination.page - 1) * data.pagination.limit + 1}–{Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of {data.pagination.total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= data.pagination.totalPages}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, application: null })}
        title={formModal.application ? "Edit Application" : "Add Application"}
      >
        <ApplicationForm
          application={formModal.application}
          onSubmit={async (formData) => {
            try {
              if (formModal.application) {
                await updateApplication({ id: formModal.application.id, data: formData }).unwrap();
              } else {
                await createApplication(formData).unwrap();
              }
              setFormModal({ open: false, application: null });
            } catch {
            }
          }}
          onCancel={() => setFormModal({ open: false, application: null })}
          isSubmitting={isCreating || isUpdating}
        />
      </Modal>

      <Modal
        isOpen={detailModal.open}
        onClose={() => setDetailModal({ open: false, application: null })}
        title="Application Details"
        size="sm"
      >
        {detailModal.application && (
          <div className="space-y-3">
            <div>
              <span className="text-xs font-medium text-gray-500">Company</span>
              <p className="text-sm font-medium">{detailModal.application.companyName}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Job Title</span>
              <p className="text-sm">{detailModal.application.jobTitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs font-medium text-gray-500">Type</span>
                <p className="text-sm">{detailModal.application.jobType}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Status</span>
                <p className="text-sm">{detailModal.application.status}</p>
              </div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Applied Date</span>
              <p className="text-sm">{format(new Date(detailModal.application.appliedDate), "MMMM d, yyyy")}</p>
            </div>
            {detailModal.application.notes && (
              <div>
                <span className="text-xs font-medium text-gray-500">Notes</span>
                <p className="text-sm whitespace-pre-wrap">{detailModal.application.notes}</p>
              </div>
            )}
            <div className="pt-2">
              <button
                onClick={() => setDetailModal({ open: false, application: null })}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            try {
              await deleteApplication(deleteTarget.id).unwrap();
              setDeleteTarget(null);
            } catch {
            }
          }
        }}
        title="Delete Application"
        message={`Are you sure you want to delete the application for ${deleteTarget?.jobTitle} at ${deleteTarget?.companyName}?`}
        isDeleting={isDeleting}
      />
    </div>
  );
}
