import { InventorySort } from "@/types/inventory.types";

export interface NormalizedMyInventoryQuery {
  page: number;
  pageSize: number;
  pocketName?: string;
  categoryName?: string;
  sort: InventorySort;
}

export const inventoryQueryKeys = {
  all: ["inventory"] as const,
  myItems: (query: NormalizedMyInventoryQuery) =>
    [
      ...inventoryQueryKeys.all,
      "my-items",
      query.page,
      query.pageSize,
      query.pocketName ?? "",
      query.categoryName ?? "",
      query.sort ?? "updated-desc",
    ] as const,
};
