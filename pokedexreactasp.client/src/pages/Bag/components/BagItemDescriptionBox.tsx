import React from "react";

import { useItemEffectDetails } from "@/hooks/queries/useItemGraphQL";
import { UserItem } from "@/types/inventory.types";

import * as S from "../index.style";

interface BagItemDescriptionBoxProps {
  item: UserItem | null;
  accent: string;
}

export const BagItemDescriptionBox: React.FC<BagItemDescriptionBoxProps> = ({
  item,
  accent,
}) => {
  const { itemEffect, isLoading } = useItemEffectDetails(
    item?.itemApiId ?? null,
    !!item,
  );

  if (!item) {
    return (
      <S.DescriptionBox>
        <S.DescriptionHeader $accent={accent}>
          <span>Select an item</span>
        </S.DescriptionHeader>
        <S.DescriptionBody>
          Choose an item from the list above to read its effect.
        </S.DescriptionBody>
      </S.DescriptionBox>
    );
  }

  const displayName = item.name.replace(/-/g, " ");

  return (
    <S.DescriptionBox>
      <S.DescriptionHeader $accent={accent}>
        <span>{displayName}</span>
      </S.DescriptionHeader>
      <S.DescriptionBody>
        {isLoading ? "Loading description..." : itemEffect}
      </S.DescriptionBody>
    </S.DescriptionBox>
  );
};

export default BagItemDescriptionBox;
