import { useQuery } from "@tanstack/react-query";
import { wildAreaService } from "@/services/wild-area/wild-area.service";

export const wildAreaQueryKeys = {
  all: ["wild-area"] as const,
  areas: () => [...wildAreaQueryKeys.all, "areas"] as const,
  current: (areaCode?: string) =>
    [
      ...wildAreaQueryKeys.all,
      "current",
      areaCode ?? "viridian_field",
    ] as const,
};

export const useWildAreas = (enabled = true) => {
  return useQuery({
    queryKey: wildAreaQueryKeys.areas(),
    queryFn: () => wildAreaService.getAreas(),
    enabled,
    staleTime: 5 * 60_000,
  });
};

export const useWildArea = (areaCode?: string, enabled = true) => {
  return useQuery({
    queryKey: wildAreaQueryKeys.current(areaCode),
    queryFn: () => wildAreaService.getCurrent(areaCode),
    enabled,
    staleTime: 30_000,
  });
};
