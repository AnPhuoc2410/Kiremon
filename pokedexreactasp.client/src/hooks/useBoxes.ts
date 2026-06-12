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
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
      queryClient.invalidateQueries({ queryKey: ["box", variables.boxId] });
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
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
      queryClient.invalidateQueries({ queryKey: ["collection"] });
      if (result.sourceBoxId) {
        queryClient.invalidateQueries({ queryKey: ["box", result.sourceBoxId] });
      }
      if (result.targetBoxId) {
        queryClient.invalidateQueries({ queryKey: ["box", result.targetBoxId] });
      }
    },
  });
};

export const useMovePokemonBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BatchMovePokemonDto) => boxService.movePokemonBatch(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
      queryClient.invalidateQueries({ queryKey: ["collection"] });
      if (result.success && result.affectedBoxIds) {
        result.affectedBoxIds.forEach((boxId) => {
          queryClient.invalidateQueries({ queryKey: ["box", boxId] });
        });
      }
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

import { collectionService } from "@/services/collection/collection.service";

export const useUpdatePokemonMoves = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userPokemonId,
      moveIds,
    }: {
      userPokemonId: number;
      moveIds: number[];
    }) => collectionService.updateMoves(userPokemonId, moveIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["box"] });
      queryClient.invalidateQueries({ queryKey: ["collection"] });
    },
  });
};
