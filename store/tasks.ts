import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Task } from "./types";

// Define a service using a base URL and expected endpoints
export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://61dd876ff60e8f00176688cc.mockapi.io/",
  }),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], string>({
      query: () => `tasks`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
              { type: "Tasks", id: "LIST" },
            ]
          : [{ type: "Tasks", id: "LIST" }],
    }),
    addTask: builder.mutation<Task, Partial<Task>>({
      query: (body) => ({
        url: `tasks`,
        method: "POST",
        body: body,
      }),
      transformResponse: (response: { data: Task }, meta, arg) => response.data,
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
      // onQueryStarted is useful for optimistic updates
      // The 2nd parameter is the destructured `MutationLifecycleApi`
      async onQueryStarted(
        arg,
        { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      ) {},
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          cacheEntryRemoved,
          cacheDataLoaded,
          getCacheEntry,
        }
      ) {},
    }),
    updateTaskStatus: builder.mutation<Task, Partial<Task>>({
      query: ({ id, status }) => ({
        url: `tasks/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
    editTaskContent: builder.mutation<Task, Partial<Task>>({
      query: ({ id, task_content }) => ({
        url: `tasks/${id}`,
        method: "PUT",
        body: { task_content },
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
    deleteTask: builder.mutation<Task, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useUpdateTaskStatusMutation,
  useEditTaskContentMutation,
  useDeleteTaskMutation,
} = tasksApi;
