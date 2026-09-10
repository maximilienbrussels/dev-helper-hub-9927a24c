/** Gedeelde data-hook voor de takenmotor (veld-app én beheerportaal). */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import {
  deleteTask,
  deleteZone,
  fetchTaskBoard,
  saveTask,
  saveZone,
  setTaskStatus,
  type TaskBoard,
} from "@/lib/tasks.functions";

const EMPTY: TaskBoard = { zones: [], tasks: [], staff: [], currentUserId: "" };

export function useTasks() {
  const queryClient = useQueryClient();
  const load = useServerFn(fetchTaskBoard);
  const saveTaskFn = useServerFn(saveTask);
  const statusFn = useServerFn(setTaskStatus);
  const deleteTaskFn = useServerFn(deleteTask);
  const saveZoneFn = useServerFn(saveZone);
  const deleteZoneFn = useServerFn(deleteZone);

  const query = useQuery({ queryKey: ["tasks-board"], queryFn: () => load() });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["tasks-board"] });
  const onError = (e: unknown) => toast.error(e instanceof Error ? e.message : "Er ging iets mis");

  const saveTaskM = useMutation({
    mutationFn: (input: Parameters<typeof saveTaskFn>[0]["data"]) => saveTaskFn({ data: input }),
    onSuccess: invalidate,
    onError,
  });
  const statusM = useMutation({
    mutationFn: (input: Parameters<typeof statusFn>[0]["data"]) => statusFn({ data: input }),
    onSuccess: invalidate,
    onError,
  });
  const deleteTaskM = useMutation({
    mutationFn: (input: { id: string }) => deleteTaskFn({ data: input }),
    onSuccess: invalidate,
    onError,
  });
  const saveZoneM = useMutation({
    mutationFn: (input: Parameters<typeof saveZoneFn>[0]["data"]) => saveZoneFn({ data: input }),
    onSuccess: invalidate,
    onError,
  });
  const deleteZoneM = useMutation({
    mutationFn: (input: { id: string }) => deleteZoneFn({ data: input }),
    onSuccess: invalidate,
    onError,
  });

  return {
    board: query.data ?? EMPTY,
    isLoading: query.isLoading,
    saveTask: saveTaskM.mutate,
    setTaskStatus: statusM.mutate,
    deleteTask: deleteTaskM.mutate,
    saveZone: saveZoneM.mutate,
    deleteZone: deleteZoneM.mutate,
  };
}
