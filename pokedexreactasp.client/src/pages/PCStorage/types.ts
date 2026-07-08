import { UserPokemonDto } from "@/types/userspokemon.types";

export interface Position {
  x: number;
  y: number;
}

export interface HeldPokemonInfo {
  pokemon: UserPokemonDto;
  fromParty: boolean;
  fromSlot: number;
  fromBoxId: number | null;
}

export interface GroupMemberInfo {
  pokemon: UserPokemonDto;
  rowOffset: number;
  colOffset: number;
  fromParty: boolean;
  fromSlot: number;
  fromBoxId: number | null;
}

export interface DragCandidate {
  pokemon: UserPokemonDto;
  fromParty: boolean;
  fromSlot: number;
  fromBoxId: number | null;
  startX: number;
  startY: number;
}
