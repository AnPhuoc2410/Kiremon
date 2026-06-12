import { AuthenticatedApiService } from "@/services/api/api-client.auth";
import { PurchaseItemPayload, PurchaseResult } from "@/types/market.types";

/**
 * Authenticated Poké Mart actions (buying items with coins).
 * Kept separate from the GraphQL-based `marketService` which only reads PokeAPI data.
 */
class MarketPurchaseService extends AuthenticatedApiService {
  async buyItem(payload: PurchaseItemPayload): Promise<PurchaseResult> {
    return this.post<PurchaseResult>("/market/buy", payload);
  }
}

export const marketPurchaseService = new MarketPurchaseService();
