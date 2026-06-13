import { AuthenticatedApiService } from "@/services/api/api-client.auth";

export interface IGymPokemonDto {
  name: string;
  sprite: string;
  types: string[];
  level: number;
  base_experience: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  };
  moves: Array<{
    name: string;
    power: number;
    type: string;
  }>;
}

export interface IGymLeaderDto {
  id: string;
  name: string;
  badgeName: string;
  region: string;
  avatar: string;
  sprite: string;
  rosterJson: string; // JSON-serialized array of IGymPokemonDto
}

export interface IBattleState {
  activePlayerIdx: number;
  playerTeamHps: number[];
  playerCurrentHP: number;
  enemyCurrentHP: number;
  isPlayerTurn: boolean;
  battleLog: string[];
  ultimateGauge: number;
  enemyUltimateGauge: number;
  showIntro: boolean;
  gameOver: boolean;
  activeEnemyIndex?: number; // For gym battles
  gymRosterHps?: number[]; // For gym battles (stores HPs of leader's team)
  wildEnemy?: any; // For wild battles
}

class BattleService extends AuthenticatedApiService {
  async getGymLeader(leaderId: string): Promise<IGymLeaderDto> {
    return this.get<IGymLeaderDto>(`/Battle/leader/${leaderId}`);
  }

  async getBattleState(key: string): Promise<IBattleState | null> {
    try {
      return await this.get<IBattleState>(`/Battle/state/${key}`);
    } catch {
      return null;
    }
  }

  async saveBattleState(key: string, state: IBattleState): Promise<void> {
    await this.post<void>(`/Battle/state/${key}`, state);
  }

  async clearBattleState(key: string): Promise<void> {
    await this.delete<void>(`/Battle/state/${key}`);
  }
}

export const battleService = new BattleService();
