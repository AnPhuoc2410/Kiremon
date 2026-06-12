import { UserPokemonDto } from "./userspokemon.types";

export interface UserBoxDto {
  id: number;
  name: string;
  order: number;
  backgroundImage: string;
  pokemonCount: number;
  pokemons: UserPokemonDto[];
}

export interface UpdateBoxDto {
  name: string;
  backgroundImage: string;
}

export interface MovePokemonDto {
  targetBoxId: number | null;
  toParty: boolean;
  slotIndex: number;
}

export interface MovePokemonItemDto {
  userPokemonId: number;
  targetBoxId: number | null;
  toParty: boolean;
  slotIndex: number;
}

export interface BatchMovePokemonDto {
  moves: MovePokemonItemDto[];
}

export interface ReorderBoxesDto {
  boxIdA: number;
  boxIdB: number;
}

export interface MovePokemonResultDto {
  success: boolean;
  message: string;
  swappedPokemonId: number | null;
  sourceBoxId?: number | null;
  targetBoxId?: number | null;
}

export interface BatchMoveResultDto {
  success: boolean;
  message?: string;
  affectedBoxIds?: number[];
  partyAffected?: boolean;
}
