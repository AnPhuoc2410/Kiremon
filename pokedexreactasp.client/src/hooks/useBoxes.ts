import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { boxService } from "@/services/collection/box.service";
import { UpdateBoxDto, MovePokemonDto, BatchMovePokemonDto, ReorderBoxesDto } from "@/types/box.types";

export const useUserBoxes = () => {
  return useQuery({
    queryKey: ["boxes"],
    queryFn: () => boxService.getBoxes(),
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  });
};

export const useUpdateBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boxId, data }: { boxId: number; data: UpdateBoxDto }) =>
      boxService.updateBox(boxId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
    },
  });
};

export const useMovePokemon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userPokemonId,
      data,
    }: {
      userPokemonId: number;
      data: MovePokemonDto;
    }) => boxService.movePokemon(userPokemonId, data),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["boxes"] }),
        queryClient.invalidateQueries({ queryKey: ["collection"] }),
      ]);
    },
  });
};

export const useMovePokemonBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BatchMovePokemonDto) => boxService.movePokemonBatch(data),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["boxes"] }),
        queryClient.invalidateQueries({ queryKey: ["collection"] }),
      ]);
    },
  });
};

export const useReorderBoxes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderBoxesDto) => boxService.reorderBoxes(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
    },
  });
};
