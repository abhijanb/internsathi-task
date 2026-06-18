import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Application,
  ApplicationFormData,
  ApplicationListResponse,
} from "../types/application";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
});

export const applicationApi = createApi({
  reducerPath: "applicationApi",
  baseQuery,
  tagTypes: ["Application"],
  endpoints: (builder) => ({
    getApplications: builder.query<
      ApplicationListResponse,
      { status?: string; search?: string; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/applications",
        params,
      }),
      transformResponse: (response: { success: boolean; data: ApplicationListResponse }) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.applications.map(({ id }) => ({
                type: "Application" as const,
                id,
              })),
              { type: "Application" as const, id: "LIST" },
            ]
          : [{ type: "Application" as const, id: "LIST" }],
    }),

    getApplication: builder.query<Application, number>({
      query: (id) => `/applications/${id}`,
      transformResponse: (response: { success: boolean; data: Application }) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Application", id }],
    }),

    createApplication: builder.mutation<Application, ApplicationFormData>({
      query: (body) => ({
        url: "/applications",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: boolean; data: Application }) => response.data,
      invalidatesTags: [{ type: "Application", id: "LIST" }],
    }),

    updateApplication: builder.mutation<
      Application,
      { id: number; data: Partial<ApplicationFormData> }
    >({
      query: ({ id, data }) => ({
        url: `/applications/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: { success: boolean; data: Application }) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Application", id },
        { type: "Application", id: "LIST" },
      ],
    }),

    deleteApplication: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/applications/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { success: boolean; data: { message: string } }) =>
        response.data,
      invalidatesTags: [{ type: "Application", id: "LIST" }],
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useGetApplicationQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
} = applicationApi;
