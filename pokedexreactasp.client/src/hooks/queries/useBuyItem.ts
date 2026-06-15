import { useMutation, useQueryClient } from "@tanstack/react-query";

import { marketPurchaseService } from "@/services/market/market-purchase.service";
import { PurchaseItemPayload } from "@/types/market.types";

import { useInventoryQueryKeys } from "./useInventory";

export const useBuyItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PurchaseItemPayload) =>
      marketPurchaseService.buyItem(payload),
    onSuccess: () => {
      // Refresh the bag so the newly bought item shows up.
      queryClient.invalidateQueries({ queryKey: useInventoryQueryKeys.all });
    },
  });
};
