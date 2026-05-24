import { AuthenticatedApiService } from "@/services/api/api-client.auth";
import {
  MyTcgCardsQuery,
  PagedTcgCardsResponse,
  PokemonTcgPreviewCard,
} from "@/types/tcg-card-collection.types";

class TcgCardCollectionService extends AuthenticatedApiService {
  async getMyCards(query: MyTcgCardsQuery): Promise<PagedTcgCardsResponse> {
    return this.get<PagedTcgCardsResponse>("/tcg-cards/my-cards", {
      params: query,
    });
  }

  async getPokemonPreviewCards(
    pokemonApiId: number,
  ): Promise<PokemonTcgPreviewCard[]> {
    return this.get<PokemonTcgPreviewCard[]>(`/tcg-cards/pokemon/${pokemonApiId}`);
  }
}

export const tcgCardCollectionService = new TcgCardCollectionService();
