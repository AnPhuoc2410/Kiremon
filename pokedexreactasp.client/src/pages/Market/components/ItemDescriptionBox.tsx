import React from "react";
import {
  DialogBox,
  DialogOverlay,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogPlaceholder,
  CloseButton,
} from "../Market.styles";
import {
  Item,
  getItemEffect,
  formatItemName,
} from "../Market.types";

interface ItemDescriptionBoxProps {
  item: Item | null;
  onClose?: () => void;
}

export const ItemDescriptionBox: React.FC<ItemDescriptionBoxProps> = ({ item, onClose }) => {
  if (!item) {
    return (
      <DialogBox $visible={false}>
        <DialogContent>
          <DialogPlaceholder>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>Click an item to see details</div>
          </DialogPlaceholder>
        </DialogContent>
      </DialogBox>
    );
  }

  const effect = getItemEffect(item);
  const formattedName = formatItemName(item.name);

  return (
    <>
      <DialogOverlay $visible={!!item} onClick={onClose} />
      <DialogBox $visible={!!item}>
        <DialogHeader>
          <DialogTitle>{formattedName}</DialogTitle>
          <CloseButton onClick={onClose} aria-label="Close">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </CloseButton>
        </DialogHeader>
        <DialogContent>
          <DialogDescription>
            {effect}
          </DialogDescription>
          {item.cost !== undefined && item.cost > 0 && (
            <DialogDescription style={{ marginTop: "16px", color: "#B45309", fontWeight: "600", fontSize: "16px" }}>
              Price: ₽{item.cost.toLocaleString()}
            </DialogDescription>
          )}
        </DialogContent>
      </DialogBox>
    </>
  );
};

export default ItemDescriptionBox;
