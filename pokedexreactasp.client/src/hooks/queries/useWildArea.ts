import { useQuery } from "@tanstack/react-query";
import { wildAreaService } from "@/services/wild-area/wild-area.service";

export const wildAreaQueryKeys = {
  all: ["wild-area"] as const,
  current: () => [...wildAreaQueryKeys.all, "current"] as const,
};

export const useWildArea = () => {
  return useQuery({
    queryKey: wildAreaQueryKeys.current(),
    queryFn: () => wildAreaService.getCurrent(),
    staleTime: 30_000,
  });
};
