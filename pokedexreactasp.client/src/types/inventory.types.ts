export type InventorySort =
  | "updated-desc"
  | "name-asc"
  | "name-desc"
  | "qty-desc"
  | "qty-asc";

export interface MyInventoryQuery {
  page?: number;
  pageSize?: number;
  pocketName?: string;
  categoryName?: string;
  sort?: InventorySort;
}

export interface InventoryCategorySummary {
  categoryName: string;
  stackCount: number;
  totalQuantity: number;
}

export interface UserItem {
  id: number;
  itemApiId: number;
  name: string;
  spriteUrl: string;
  description?: string | null;
  pocketName: string;
  categoryName: string;
  quantity: number;
  isHoldable: boolean;
  isConsumable: boolean;
  usableInBattle: boolean;
  updatedAt: string;
}

export interface PagedInventoryResponse {
  items: UserItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  categories: InventoryCategorySummary[];
}

export interface AddItemPayload {
  itemApiId: number;
  name: string;
  spriteUrl: string;
  description?: string | null;
  apiPocketName?: string | null;
  categoryName?: string;
  quantity?: number;
  isHoldable?: boolean;
  isConsumable?: boolean;
  usableInBattle?: boolean;
}

export interface ConsumeItemPayload {
  quantity: number;
}
