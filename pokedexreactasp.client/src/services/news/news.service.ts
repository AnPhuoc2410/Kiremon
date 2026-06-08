import { AuthenticatedApiService } from "@/services/api/api-client.auth";

export interface PokemonNews {
  id: number;
  title: string;
  summary: string;
  imageUrl: string;
  sourceUrl: string;
  category: string;
  author: string;
  viewCount: number;
  commentCount: number;
  publishedDate: string;
  createdAt: string;
}

export interface PokemonNewsSyncResult {
  totalScraped: number;
  inserted: number;
  updated: number;
  failed: number;
}

class NewsService extends AuthenticatedApiService {
  /**
   * Fetch latest Pokemon news articles from the backend
   * @param limit Number of articles to retrieve
   */
  async getLatestNews(limit: number = 20): Promise<PokemonNews[]> {
    return this.get<PokemonNews[]>("/news", {
      params: { limit },
    });
  }

  /**
   * Manually trigger backend news synchronization scraping
   */
  async syncNews(): Promise<PokemonNewsSyncResult> {
    return this.post<PokemonNewsSyncResult>("/news/sync");
  }

  /**
   * Record a view for a news article
   * @param id News article ID
   */
  async incrementViews(id: number): Promise<void> {
    return this.post<void>(`/news/${id}/view`);
  }
}

export const newsService = new NewsService();
export default newsService;
