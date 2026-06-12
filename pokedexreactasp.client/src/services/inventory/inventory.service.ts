import { AuthenticatedApiService } from "@/services/api/api-client.auth";
import {
  AddItemPayload,
  MyInventoryQuery,
  PagedInventoryResponse,
  UserItem,
} from "@/types/inventory.types";

class InventoryService extends AuthenticatedApiService {
  async getMyItems(query: MyInventoryQuery): Promise<PagedInventoryResponse> {
    return this.get<PagedInventoryResponse>("/inventory/my-items", {
      params: query,
    });
  }

  async getItem(userItemId: number): Promise<UserItem> {
    return this.get<UserItem>(`/inventory/${userItemId}`);
  }

  async addItem(payload: AddItemPayload): Promise<UserItem> {
    return this.post<UserItem>("/inventory", payload);
  }

  /**
   * Decrements a stack. Returns the updated item, or null when fully consumed.
   */
  async consumeItem(
    userItemId: number,
    quantity: number,
  ): Promise<UserItem | null> {
    return this.post<UserItem | null>(`/inventory/${userItemId}/consume`, {
      quantity,
    });
  }
}

export const inventoryService = new InventoryService();
