import React from "react";
import { IAbility } from "@/types/pokemon";
import * as S from "./index.style";

interface EnhancedAbilityTooltipProps {
  abilityData: IAbility;
  children: React.ReactNode;
}

export const EnhancedAbilityTooltip: React.FC<EnhancedAbilityTooltipProps> = ({
  abilityData,
  children,
}) => {
  const { ability, description, effect, shortEffect } = abilityData;
  const abilityName = ability.name.replace(/-/g, " ");

  const cleanText = (str: string | null | undefined) =>
    str ? str.replace(/[\n\f]/g, " ") : "";

  const cleanShortEffect = cleanText(shortEffect);
  const cleanEffect = cleanText(effect);
  const cleanDescription = cleanText(description);

  return (
    <S.TooltipContainer>
      {children}
      <S.TooltipContent className="tooltip-content">
        <S.TooltipHeader>
          <span className="title">{abilityName}</span>
        </S.TooltipHeader>
        <S.TooltipBody>
          {cleanShortEffect && (
            <S.ShortEffect>{cleanShortEffect}</S.ShortEffect>
          )}
          {cleanEffect && cleanEffect !== cleanShortEffect && (
            <S.FullEffect>{cleanEffect}</S.FullEffect>
          )}
          {!cleanEffect && !cleanShortEffect && cleanDescription && (
            <S.FlavorText>{cleanDescription}</S.FlavorText>
          )}
        </S.TooltipBody>
      </S.TooltipContent>
    </S.TooltipContainer>
  );
};
