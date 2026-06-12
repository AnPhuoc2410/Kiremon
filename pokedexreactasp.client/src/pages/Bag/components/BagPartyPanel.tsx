import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { MAX_COMBAT_TEAM_SIZE } from "@/hooks/useCombatTeamActive";
import { ICombatPokemon } from "@/types/pokemon";

import * as S from "../index.style";

function getHpStat(pokemon: ICombatPokemon): number {
  const stat = pokemon.stats?.find(
    (s) => s.stat.name === "hp" || s.stat.name.replace("-", "") === "hp",
  );
  return stat?.base_stat ?? 0;
}

interface BagPartyPanelProps {
  activeTeam: ICombatPokemon[];
}

export const BagPartyPanel: React.FC<BagPartyPanelProps> = ({ activeTeam }) => {
  const slots = Array.from({ length: MAX_COMBAT_TEAM_SIZE }, (_, index) =>
    activeTeam[index] ?? null,
  );

  return (
    <S.PartyPanel>
      <S.PartyPanelTitle>Combat Team</S.PartyPanelTitle>

      <S.PartySlots>
        {slots.map((pokemon, index) => (
          <S.PartyCard key={pokemon ? `${pokemon.id}-${pokemon.name}` : `empty-${index}`} $isEmpty={!pokemon}>
            {pokemon ? (
              <>
                <S.PartySpriteWrap>
                  <LazyLoadImage
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    width={44}
                    height={44}
                    effect="blur"
                  />
                </S.PartySpriteWrap>

                <S.PartyDetails>
                  <S.PartyNameRow>
                    <S.PartyName>{pokemon.name}</S.PartyName>
                  </S.PartyNameRow>

                  <S.PartyHpRow>
                    <S.PartyHpBar>
                      <S.PartyHpFill $percent={100} />
                    </S.PartyHpBar>
                    <S.PartyHpText>
                      {getHpStat(pokemon)}/{getHpStat(pokemon)}
                    </S.PartyHpText>
                  </S.PartyHpRow>
                </S.PartyDetails>

                <S.PartyLevel>Lv. {pokemon.level}</S.PartyLevel>
              </>
            ) : (
              <S.PartyEmptySlot>—</S.PartyEmptySlot>
            )}
          </S.PartyCard>
        ))}
      </S.PartySlots>

      {activeTeam.length === 0 ? (
        <S.PartyHint>
          No Pokémon in your active team.{" "}
          <Link to="/games/combat-team">Manage team</Link>
        </S.PartyHint>
      ) : null}
    </S.PartyPanel>
  );
};

export default BagPartyPanel;
