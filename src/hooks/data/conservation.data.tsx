import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageApi } from "~/services/api/message.api";

export const useDeleteConservationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => messageApi.deleteConservation(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['LIST_CONSERVATION'] });
      },
    });
  }
  