import { useMutation, useQueryClient } from "@tanstack/react-query";
import { wildAreaService } from "@/services/wild-area/wild-area.service";
import { WildCatchAttemptRequest } from "@/types/wild-area.types";

interface AttemptWildCatchParams {
  spawnId: number;
  payload: WildCatchAttemptRequest;
}

export const useAttemptWildCatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spawnId, payload }: AttemptWildCatchParams) =>
      wildAreaService.attemptCatch(spawnId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["wild-area", "current"] }),
        queryClient.invalidateQueries({ queryKey: ["collection"] }),
        queryClient.invalidateQueries({ queryKey: ["tcg-cards", "my-cards"] }),
      ]);
    },
  });
};
