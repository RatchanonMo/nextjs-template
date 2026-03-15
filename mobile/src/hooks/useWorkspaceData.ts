import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { workspaceAPI } from "../api/workspaceAPI";
import { queryKeys } from "../constants/queryKeys";
import { WorkspaceLabel, WorkspaceProject } from "../types/workspace";

export const useWorkspaceData = () => {
  const queryClient = useQueryClient();

  const workspaceQuery = useQuery({
    queryKey: queryKeys.workspace,
    queryFn: () => workspaceAPI.getWorkspace(),
  });

  const createProjectMutation = useMutation({
    mutationFn: (payload: Omit<WorkspaceProject, "id" | "_id">) => workspaceAPI.createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspace });
    },
  });

  const createLabelMutation = useMutation({
    mutationFn: (payload: Omit<WorkspaceLabel, "id">) => workspaceAPI.createLabel(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspace });
    },
  });

  return {
    workspaceQuery,
    createProjectMutation,
    createLabelMutation,
  };
};
