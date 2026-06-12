import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { inventoryService } from "@/services/inventory/inventory.service";
import { AddItemPayload, InventorySort, MyInventoryQuery } from "@/types/inventory.types";
import { inventoryQueryKeys } from "./inventoryQueryKeys";

const sanitizeQuery = (query: MyInventoryQuery): NormalizedMyInventoryQuery => ({
  page: Math.max(1, query.page ?? 1),
  pageSize: Math.min(100, Math.max(1, query.pageSize ?? 30)),
  pocketName: query.pocketName?.trim() || undefined,
  categoryName: query.categoryName?.trim() || undefined,
  sort: query.sort ?? "updated-desc",
});

export const useMyInventory = (query: MyInventoryQuery, enabled = true) => {
  const normalized = sanitizeQuery(query);

  return useQuery({
    queryKey: inventoryQueryKeys.myItems(normalized),
    queryFn: () => inventoryService.getMyItems(normalized),
    enabled,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
};

export const useAddItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddItemPayload) => inventoryService.addItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.all });
    },
  });
};

export const useConsumeItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userItemId,
      quantity,
    }: {
      userItemId: number;
      quantity: number;
    }) => inventoryService.consumeItem(userItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.all });
    },
  });
};

export interface NormalizedMyInventoryQuery {
  page: number;
  pageSize: number;
  pocketName?: string;
  categoryName?: string;
  sort: InventorySort;
}

export const useInventoryQueryKeys = inventoryQueryKeys;
