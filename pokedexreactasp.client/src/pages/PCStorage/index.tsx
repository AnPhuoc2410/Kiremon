import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import gsap from "gsap";
import {
  IconSearch,
  IconClick,
  IconHandMove,
  IconLayout,
  IconPhoto,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconX,
  IconHeart,
  IconStar,
  IconGitCompare,
  IconBriefcase,
  IconCircle,
  IconTriangle,
  IconSquare,
  IconDiamond,
  IconHelp,
  IconTrash,
} from "@tabler/icons-react";

import { Navbar, Text, Button } from "@/components/ui";
import { useAuth } from "@/contexts";
import { useSupabaseStorage } from "@/components/hooks/useSupabaseStorage";
import {
  useUserBoxes,
  useUpdateBox,
  useMovePokemon,
  useMovePokemonBatch,
  useReorderBoxes,
} from "@/hooks/useBoxes";
import { collectionService } from "@/services/collection/collection.service";
import { UserPokemonDto } from "@/types/userspokemon.types";
import { UserBoxDto, MovePokemonItemDto } from "@/types/box.types";

import * as S from "./index.style";

type SelectionMode = "default" | "relocate" | "group";

interface Position {
  x: number;
  y: number;
}

interface HeldPokemonInfo {
  pokemon: UserPokemonDto;
  fromParty: boolean;
  fromSlot: number;
  fromBoxId: number | null;
}

interface GroupMemberInfo {
  pokemon: UserPokemonDto;
  rowOffset: number;
  colOffset: number;
  fromParty: boolean;
  fromSlot: number;
  fromBoxId: number | null;
}

const DEFAULT_WALLPAPERS = [
  "Box_Forest_BDSP.png",
  "Box_Cave_BDSP.png",
  "Box_Beach_BDSP.png",
  "Box_Desert_BDSP.png",
  "Box_City_BDSP.png",
  "Box_Crag_BDSP.png",
  "Box_Legend_BDSP.png",
  "Box_Machine_BDSP.png",
  "Box_River_BDSP.png",
  "Box_Savanna_BDSP.png",
  "Box_Seafloor_BDSP.png",
  "Box_Sky_BDSP.png",
  "Box_Snow_BDSP.png",
  "Box_Space_BDSP.png",
  "Box_Volcano_BDSP.png",
  "Box_Backyard_BDSP.png",
];

const PCStorage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const queryClient = React.useRef(null); // Just utility

  // Fetch Box Data
  const { data: boxes = [], isLoading: isLoadingBoxes } = useUserBoxes();

  // Mutations
  const updateBoxMutation = useUpdateBox();
  const movePokemonMutation = useMovePokemon();
  const movePokemonBatchMutation = useMovePokemonBatch();
  const reorderBoxesMutation = useReorderBoxes();

  // Supabase Custom Wallpaper Upload
  const { uploadFile, uploading, uploadProgress } = useSupabaseStorage();

  // UI state
  const [currentBoxIndex, setCurrentBoxIndex] = useState<number>(0);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [partyPokemons, setPartyPokemons] = useState<UserPokemonDto[]>([]);
  const [showBoxList, setShowBoxList] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Relocate mode state
  const [heldPokemon, setHeldPokemon] = useState<HeldPokemonInfo | null>(null);
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });

  // Group selection mode state
  const [selectionBox, setSelectionBox] = useState<{
    start: Position;
    end: Position;
    active: boolean;
  } | null>(null);
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<number>>(new Set());
  const [heldGroup, setHeldGroup] = useState<GroupMemberInfo[] | null>(null);

  // Context Menu
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    pokemon: UserPokemonDto;
  } | null>(null);

  // Compare mode state
  const [comparePokemons, setComparePokemons] = useState<UserPokemonDto[]>([]);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Grid Refs for animations
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wpDropZoneRef = useRef<HTMLDivElement>(null);
  // Tracks whether mouseup happened on a valid slot (to distinguish valid drop vs cancel)
  const didDropRef = useRef<boolean>(false);
  // Cooldown to prevent rapid box-switching while dragging to edges
  const dragNavCooldownRef = useRef<boolean>(false);

  // UI state for wallpaper drag-and-drop
  const [isWpDragging, setIsWpDragging] = useState<boolean>(false);

  const activeBox: UserBoxDto | undefined = boxes[currentBoxIndex];

  const uploadAndApplyWallpaper = async (file: File) => {
    if (!activeBox) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Wallpaper size should be less than 5MB");
      return;
    }

    try {
      toast.loading("Uploading wallpaper to Supabase...", { id: "wp-upload" });
      const { url, error } = await uploadFile(file, "Kiremon", "box-wallpapers");

      if (error || !url) {
        throw error || new Error("Failed to upload image.");
      }

      // Save URL to database
      await updateBoxMutation.mutateAsync({
        boxId: activeBox.id,
        data: {
          name: activeBox.name,
          backgroundImage: url,
        },
      });

      toast.dismiss("wp-upload");
      toast.success("Custom wallpaper uploaded and applied!");
    } catch (err) {
      toast.dismiss("wp-upload");
      toast.error("Failed to upload custom wallpaper.");
    }
  };

  const handleWpDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading) {
      setIsWpDragging(true);
    }
  };

  const handleWpDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === wpDropZoneRef.current) {
      setIsWpDragging(false);
    }
  };

  const handleWpDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleWpDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWpDragging(false);

    if (uploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      await uploadAndApplyWallpaper(file);
    }
  };

  const handleWpPaste = async (e: ClipboardEvent) => {
    if (document.activeElement?.tagName === "INPUT") {
      return;
    }

    if (uploading) return;

    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          await uploadAndApplyWallpaper(file);
          break;
        }
      }
    }
  };

  // Listen for paste event to upload custom wallpaper
  useEffect(() => {
    document.addEventListener("paste", handleWpPaste);
    return () => {
      document.removeEventListener("paste", handleWpPaste);
    };
  }, [activeBox, uploading]);

  // 1. Fetch Party Pokemon on load
  const loadParty = async () => {
    try {
      if (isAuthenticated) {
        const fullColl = await collectionService.getCollection();
        const party = fullColl.filter((p) => p.isInParty).sort((a, b) => a.slotIndex - b.slotIndex);
        setPartyPokemons(party);
      }
    } catch (err) {
      console.error("Failed to load party", err);
    }
  };

  useEffect(() => {
    loadParty();
  }, [isAuthenticated, boxes]);

  // 2. Mouse tracking + auto-box-switch when dragging to edges
  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (heldPokemon || heldGroup) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }

      // Auto-switch box when dragging a pokemon past the grid's left/right edge
      if (heldPokemon && gridContainerRef.current && !dragNavCooldownRef.current && boxes.length > 1) {
        const rect = gridContainerRef.current.getBoundingClientRect();
        if (e.clientX < rect.left) {
          dragNavCooldownRef.current = true;
          // Go to prev box inline to avoid stale closure
          setCurrentBoxIndex((prev) => {
            const newIdx = (prev - 1 + boxes.length) % boxes.length;
            animateBoxTransition("left");
            return newIdx;
          });
          setTimeout(() => { dragNavCooldownRef.current = false; }, 750);
        } else if (e.clientX > rect.right) {
          dragNavCooldownRef.current = true;
          setCurrentBoxIndex((prev) => {
            const newIdx = (prev + 1) % boxes.length;
            animateBoxTransition("right");
            return newIdx;
          });
          setTimeout(() => { dragNavCooldownRef.current = false; }, 750);
        }
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [heldPokemon, heldGroup, boxes.length]);

  // 2b. Global mouseup: cancel drag if released outside a valid slot
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (heldPokemon) {
        if (!didDropRef.current) {
          // Dropped outside any slot — return Pokemon to original position
          setHeldPokemon(null);
        }
        didDropRef.current = false;
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [heldPokemon]);

  // 3. Keyboard Shortcuts Setup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in search input
      if (document.activeElement?.tagName === "INPUT") {
        if (e.key === "Escape") {
          (document.activeElement as HTMLInputElement).blur();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case "y":
          setSelectionMode("default");
          toast("Cursor Mode: Default (Inspect / Context Menu)");
          break;
        case "m":
          setSelectionMode("relocate");
          toast("Cursor Mode: Relocate (Pick & Swap)");
          break;
        case "h":
          setSelectionMode("group");
          toast("Cursor Mode: Group Move (Select & Drag Multiple)");
          break;
        case "arrowleft":
        case "a":
          handlePrevBox();
          break;
        case "arrowright":
        case "d":
          handleNextBox();
          break;
        case "b":
          setShowBoxList((prev) => !prev);
          break;
        case "c":
          if (comparePokemons.length === 2) {
            setIsComparing(true);
          } else {
            toast.error("Please select exactly 2 Pokémon via Context Menu first to compare.");
          }
          break;
        case "f":
        case "s":
          e.preventDefault();
          const searchInput = document.getElementById("search-input");
          if (searchInput) searchInput.focus();
          break;
        case "escape":
          // Reset all selections
          setHeldPokemon(null);
          setHeldGroup(null);
          setSelectedGroupIds(new Set());
          setContextMenu(null);
          setIsComparing(false);
          setShowBoxList(false);
          setShowHelp(false);
          break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
          // Quick drop held into party slot 1-6
          if (heldPokemon) {
            const partyIdx = parseInt(e.key) - 1;
            handleDropHeldPokemon(partyIdx, true);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentBoxIndex, boxes, heldPokemon, comparePokemons]);

  // 4. Navigation adjacent Box GSAP slides
  const handlePrevBox = () => {
    if (boxes.length === 0) return;
    const newIdx = (currentBoxIndex - 1 + boxes.length) % boxes.length;
    animateBoxTransition("left");
    setCurrentBoxIndex(newIdx);
  };

  const handleNextBox = () => {
    if (boxes.length === 0) return;
    const newIdx = (currentBoxIndex + 1) % boxes.length;
    animateBoxTransition("right");
    setCurrentBoxIndex(newIdx);
  };

  const animateBoxTransition = (direction: "left" | "right") => {
    if (!gridContainerRef.current) return;
    const xOffset = direction === "right" ? 150 : -150;
    gsap.fromTo(
      gridContainerRef.current,
      { x: xOffset, opacity: 0.4, scale: 0.98 },
      { x: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
    );
  };

  const handleSelectBoxFromModal = (idx: number) => {
    if (idx === currentBoxIndex) {
      setShowBoxList(false);
      return;
    }
    setShowBoxList(false);
    if (gridContainerRef.current) {
      gsap.fromTo(
        gridContainerRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.1)" }
      );
    }
    setCurrentBoxIndex(idx);
  };

  // 5. Box Background Resolution
  const getBoxBgUrl = (bg: string) => {
    if (!bg) return "/wallpaper/Box_Forest_BDSP.png";
    if (bg.startsWith("http://") || bg.startsWith("https://")) {
      return bg;
    }
    return `/wallpaper/${bg}`;
  };

  // 6. Relocate (Single Move) — mousedown/mouseup drag
  //    Default Mode — click to toggle compare selection; 2 selected = auto-open compare
  const handleSlotClick = (slotIdx: number, isParty: boolean) => {
    setContextMenu(null);
    if (selectionMode === "group" || selectionMode === "relocate") return;

    // Default mode: click Pokemon to add/remove from comparison
    const targetPokemon = isParty
      ? partyPokemons.find((p) => p.slotIndex === slotIdx)
      : activeBox?.pokemons.find((p) => p.slotIndex === slotIdx);

    if (!targetPokemon) return;

    const alreadySelected = comparePokemons.some((p) => p.id === targetPokemon.id);
    if (alreadySelected) {
      // Deselect
      setComparePokemons((prev) => prev.filter((p) => p.id !== targetPokemon.id));
    } else {
      if (comparePokemons.length >= 2) {
        // Replace oldest selection with new one
        const updated = [comparePokemons[1], targetPokemon];
        setComparePokemons(updated);
        setIsComparing(true);
      } else {
        const updated = [...comparePokemons, targetPokemon];
        setComparePokemons(updated);
        if (updated.length === 2) {
          // Auto-open compare when 2nd Pokemon selected
          setIsComparing(true);
        } else {
          toast(`✓ ${targetPokemon.displayName} selected — click 1 more to compare`);
        }
      }
    }
  };

  // Start drag (mousedown on a slot with a Pokemon, relocate mode)
  const handleSlotMouseDown = (
    e: MouseEvent<HTMLDivElement>,
    slotIdx: number,
    isParty: boolean
  ) => {
    if (selectionMode !== "relocate") return;

    const targetPokemon = isParty
      ? partyPokemons.find((p) => p.slotIndex === slotIdx)
      : activeBox?.pokemons.find((p) => p.slotIndex === slotIdx);

    if (!targetPokemon) return;

    e.preventDefault(); // Prevent text selection during drag
    setHeldPokemon({
      pokemon: targetPokemon,
      fromParty: isParty,
      fromSlot: slotIdx,
      fromBoxId: isParty ? null : activeBox?.id || null,
    });
  };

  // Drop (mouseup on a slot, relocate mode)
  const handleSlotMouseUp = (slotIdx: number, isParty: boolean) => {
    if (!heldPokemon) return;
    didDropRef.current = true; // Mark as valid drop so global handler won't cancel
    handleDropHeldPokemon(slotIdx, isParty);
  };

  const handleDropHeldPokemon = async (targetSlot: number, toParty: boolean) => {
    if (!heldPokemon) return;
    const { pokemon, fromParty, fromSlot, fromBoxId } = heldPokemon;

    // Check if target slot has a pokemon
    const targetPokemon = toParty
      ? partyPokemons.find((p) => p.slotIndex === targetSlot)
      : activeBox?.pokemons.find((p) => p.slotIndex === targetSlot);

    // If straight moving out of party, check minimum constraint
    if (fromParty && !toParty && !targetPokemon) {
      if (partyPokemons.length <= 1) {
        toast.error("You must keep at least 1 Pokémon in your party!");
        setHeldPokemon(null);
        return;
      }
    }

    // Call API
    try {
      const result = await movePokemonMutation.mutateAsync({
        userPokemonId: pokemon.id,
        data: {
          targetBoxId: toParty ? null : activeBox?.id || null,
          toParty,
          slotIndex: targetSlot,
        },
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to relocate Pokémon.");
    } finally {
      setHeldPokemon(null);
      loadParty();
    }
  };

  // 7. Group Selection (Tray Mode) Drag Handlers
  const handleGridMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (selectionMode !== "group" || heldGroup) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    setSelectionBox({
      start: { x: startX, y: startY },
      end: { x: startX, y: startY },
      active: true,
    });
    setSelectedGroupIds(new Set());
  };

  const handleGridMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!selectionBox || !selectionBox.active) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const currentY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    setSelectionBox((prev) =>
      prev ? { ...prev, end: { x: currentX, y: currentY } } : null
    );

    // Calculate overlap items
    const startX = Math.min(selectionBox.start.x, currentX);
    const endX = Math.max(selectionBox.start.x, currentX);
    const startY = Math.min(selectionBox.start.y, currentY);
    const endY = Math.max(selectionBox.start.y, currentY);

    const cells = e.currentTarget.querySelectorAll("[data-slot-index]");
    const newSelectedIds = new Set<number>();

    cells.forEach((cell) => {
      const cellRect = (cell as HTMLElement).getBoundingClientRect();
      const cellLeft = cellRect.left - rect.left;
      const cellTop = cellRect.top - rect.top;
      const cellRight = cellRect.right - rect.left;
      const cellBottom = cellRect.bottom - rect.top;

      // Check intersection
      const intersects =
        cellLeft < endX &&
        cellRight > startX &&
        cellTop < endY &&
        cellBottom > startY;

      if (intersects) {
        const pokeIdAttr = cell.getAttribute("data-pokemon-id");
        if (pokeIdAttr) {
          newSelectedIds.add(parseInt(pokeIdAttr));
        }
      }
    });

    setSelectedGroupIds(newSelectedIds);
  };

  const handleGridMouseUp = () => {
    if (!selectionBox) return;
    setSelectionBox((prev) => (prev ? { ...prev, active: false } : null));

    if (selectedGroupIds.size > 0) {
      toast(`Selected ${selectedGroupIds.size} Pokémon. Click one to lift the group!`);
    }
  };

  const handleLiftGroup = (clickedPokeId: number) => {
    if (selectedGroupIds.size === 0 || !activeBox) return;

    // Load selected pokemons
    const pokesToLift = activeBox.pokemons.filter((p) => selectedGroupIds.has(p.id));
    if (pokesToLift.length === 0) return;

    // Find the clicked pokemon to compute slot offset
    const anchorPoke = pokesToLift.find((p) => p.id === clickedPokeId);
    if (!anchorPoke) return;

    const anchorRow = Math.floor(anchorPoke.slotIndex / 6);
    const anchorCol = anchorPoke.slotIndex % 6;

    const members: GroupMemberInfo[] = pokesToLift.map((p) => {
      const row = Math.floor(p.slotIndex / 6);
      const col = p.slotIndex % 6;
      return {
        pokemon: p,
        rowOffset: row - anchorRow,
        colOffset: col - anchorCol,
        fromParty: false,
        fromSlot: p.slotIndex,
        fromBoxId: activeBox.id,
      };
    });

    setHeldGroup(members);
    setSelectionBox(null);
  };

  const handleDropGroup = async (targetAnchorSlot: number) => {
    if (!heldGroup || !activeBox) return;

    const anchorRow = Math.floor(targetAnchorSlot / 6);
    const anchorCol = targetAnchorSlot % 6;

    // Check boundary and occupancy for all slots in the group
    const moves: MovePokemonItemDto[] = [];
    let isInvalid = false;

    // Map of currently occupied slots in target Box (exclude moving ones)
    const occupiedMap = new Set<number>();
    activeBox.pokemons.forEach((p) => {
      if (!selectedGroupIds.has(p.id)) {
        occupiedMap.add(p.slotIndex);
      }
    });

    for (const member of heldGroup) {
      const targetRow = anchorRow + member.rowOffset;
      const targetCol = anchorCol + member.colOffset;

      // Check grid bounds (6 cols x 5 rows)
      if (targetRow < 0 || targetRow >= 5 || targetCol < 0 || targetCol >= 6) {
        isInvalid = true;
        toast.error("Group placement exceeds box boundaries!");
        break;
      }

      const targetSlot = targetRow * 6 + targetCol;

      // Check occupied (strictly no swap allowed)
      if (occupiedMap.has(targetSlot)) {
        isInvalid = true;
        toast.error("Destination slots must be completely empty!");
        break;
      }

      moves.push({
        userPokemonId: member.pokemon.id,
        targetBoxId: activeBox.id,
        toParty: false,
        slotIndex: targetSlot,
      });
    }

    if (isInvalid) {
      setHeldGroup(null);
      setSelectedGroupIds(new Set());
      return;
    }

    // Call API
    try {
      await movePokemonBatchMutation.mutateAsync({ moves });
      toast.success("Group moved successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Batch move error.");
    } finally {
      setHeldGroup(null);
      setSelectedGroupIds(new Set());
      loadParty();
    }
  };

  // 8. Wallpaper Selector Change & File Upload
  const handleSelectWallpaper = async (bgName: string) => {
    if (!activeBox) return;
    try {
      await updateBoxMutation.mutateAsync({
        boxId: activeBox.id,
        data: {
          name: activeBox.name,
          backgroundImage: bgName,
        },
      });
      toast.success("Wallpaper updated!");
    } catch (err) {
      toast.error("Failed to update wallpaper");
    }
  };

  const handleWallpaperUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAndApplyWallpaper(file);
  };

  // Rename Box
  const handleRenameBox = async () => {
    if (!activeBox) return;
    const newName = prompt("Enter new name for this Box:", activeBox.name);
    if (!newName || newName.trim() === "" || newName === activeBox.name) return;

    try {
      await updateBoxMutation.mutateAsync({
        boxId: activeBox.id,
        data: {
          name: newName.trim(),
          backgroundImage: activeBox.backgroundImage,
        },
      });
      toast.success("Box renamed!");
    } catch (err) {
      toast.error("Failed to rename box.");
    }
  };

  // HTML5 Drag-and-Drop Box Reordering (in modal)
  const handleBoxDragStart = (e: React.DragEvent, boxId: number) => {
    e.dataTransfer.setData("boxId", boxId.toString());
  };

  const handleBoxDrop = async (e: React.DragEvent, targetBoxId: number) => {
    const sourceIdStr = e.dataTransfer.getData("boxId");
    if (!sourceIdStr) return;
    const sourceBoxId = parseInt(sourceIdStr);

    if (sourceBoxId === targetBoxId) return;

    try {
      await reorderBoxesMutation.mutateAsync({
        boxIdA: sourceBoxId,
        boxIdB: targetBoxId,
      });
      toast.success("Boxes reordered successfully!");
    } catch (err) {
      toast.error("Failed to reorder boxes.");
    }
  };

  // Context Menu operations
  const handleRightClickSlot = (e: MouseEvent, pokemon: UserPokemonDto) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      pokemon,
    });
  };

  const handleToggleFavorite = async (pokemon: UserPokemonDto) => {
    setContextMenu(null);
    try {
      await collectionService.toggleFavorite(pokemon.id);
      toast.success(`${pokemon.displayName} favorite toggled!`);
      loadParty();
    } catch (err) {
      toast.error("Failed to favorite");
    }
  };

  const handleReleasePokemon = async (pokemon: UserPokemonDto) => {
    setContextMenu(null);
    if (pokemon.isInParty && partyPokemons.length <= 1) {
      toast.error("You cannot release the last Pokémon in your party!");
      return;
    }

    const confirm = window.confirm(`Are you sure you want to release ${pokemon.displayName}?`);
    if (!confirm) return;

    try {
      await collectionService.releasePokemon(pokemon.id);
      toast.success(`${pokemon.displayName} was released into the wild.`);
      loadParty();
    } catch (err) {
      toast.error("Failed to release pokemon");
    }
  };

  const handleAddToCompare = (pokemon: UserPokemonDto) => {
    setContextMenu(null);
    if (comparePokemons.some((p) => p.id === pokemon.id)) {
      // Remove
      setComparePokemons((prev) => prev.filter((p) => p.id !== pokemon.id));
      toast(`${pokemon.displayName} removed from comparison.`);
    } else {
      if (comparePokemons.length >= 2) {
        toast.error("You can only compare 2 Pokémon at a time! Remove one first.");
      } else {
        setComparePokemons((prev) => [...prev, pokemon]);
        toast.success(`${pokemon.displayName} added to comparison. Press 'C' or click Compare to open.`);
      }
    }
  };

  const handleQuickGiveItem = async (pokemon: UserPokemonDto) => {
    setContextMenu(null);
    // Simulate equipping a Leftovers item (PokeAPI Id 234)
    const currentHeld = pokemon.heldItemId;
    if (currentHeld) {
      // Unequip
      toast.success("Unequipped item.");
    } else {
      toast.success("Equipped Leftovers!");
    }
  };

  const handleToggleMarking = async (pokemon: UserPokemonDto, marking: string) => {
    setContextMenu(null);
    const markingsList = pokemon.markings
      ? pokemon.markings.split(",").filter((m) => m.trim() !== "")
      : [];

    let newMarkings = "";
    if (markingsList.includes(marking)) {
      // Remove
      newMarkings = markingsList.filter((m) => m !== marking).join(",");
      toast(`Removed marking ${marking}`);
    } else {
      // Add
      markingsList.push(marking);
      newMarkings = markingsList.join(",");
      toast(`Added marking ${marking}`);
    }

    // Since we'll add markings controller update soon, let's update local representation:
    // Simply patch notes or trigger notification.
  };

  // Search filter matching
  const matchesSearch = (pokemon: UserPokemonDto): boolean => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      pokemon.displayName.toLowerCase().includes(query) ||
      pokemon.name.toLowerCase().includes(query) ||
      pokemon.pokemonApiId.toString() === query ||
      !!(pokemon.type1 && pokemon.type1.toLowerCase().includes(query)) ||
      !!(pokemon.type2 && pokemon.type2.toLowerCase().includes(query))
    );
  };

  return (
    <>
      <Navbar />
      <S.Page>
        <S.StorageHeader className="pxl-border no-inset">
          <div className="title-section">
            <Text as="h1" variant="outlined" size="xl">
              Pokémon Storage System
            </Text>
            <Text as="p" variant="darker" size="sm">
              Organize caught Pokémon, configure wallpapers, and analyze stats.
            </Text>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <S.KeyboardInfoBtn className="pxl-border" onClick={() => setShowHelp(true)}>
              <IconHelp size={16} /> Keyboard Shortcuts
            </S.KeyboardInfoBtn>
            <S.KeyboardInfoBtn className="pxl-border" onClick={() => setShowBoxList(true)}>
              <IconLayout size={16} /> Box List (B)
            </S.KeyboardInfoBtn>
          </div>
        </S.StorageHeader>

        <S.Workspace>
          {/* LEFT: Party Sidebar */}
          <S.SidebarCard className="pxl-border no-inset">
            <Text as="h2" variant="darker" size="lg" style={{ marginBottom: "16px" }}>
              Party Sidebar
            </Text>
            <S.PartySlotsContainer>
              {Array.from({ length: 6 }).map((_, idx) => {
                const poke = partyPokemons.find((p) => p.slotIndex === idx);
                const isHovered = false; // logic simple for slots
                return (
                  <S.PartySlot
                    key={`party-slot-${idx}`}
                    isEmpty={!poke}
                    isHovered={isHovered}
                    isDraggingOver={heldPokemon !== null && !poke}
                    onClick={() => handleSlotClick(idx, true)}
                    onMouseDown={(e) => handleSlotMouseDown(e, idx, true)}
                    onMouseUp={() => handleSlotMouseUp(idx, true)}
                    onContextMenu={(e) => poke && handleRightClickSlot(e, poke)}
                  >
                    <span className="index-tag">SLOT {idx + 1}</span>
                    {poke ? (
                      <>
                        <img className="sprite" src={poke.spriteUrl} alt={poke.displayName} />
                        <div className="details">
                          <span className="name">{poke.displayName}</span>
                          <span className="lvl">Lv. {poke.currentLevel}</span>
                        </div>
                        {poke.isShiny && <IconStar className="shiny-sparkle" size={14} />}
                      </>
                    ) : (
                      <span style={{ fontSize: "0.95rem", color: "#64748b", margin: "auto", fontWeight: "bold" }}>Empty</span>
                    )}
                  </S.PartySlot>
                );
              })}
            </S.PartySlotsContainer>
          </S.SidebarCard>

          {/* CENTER: Main Box Grid */}
          <S.BoxWrapper className="pxl-border no-inset">
            <S.BoxControls className="pxl-border no-inset">
              <div className="navigation">
                <button className="box-action-btn pxl-border" onClick={handlePrevBox}>
                  <IconArrowLeft size={18} />
                </button>
                <Text
                  as="h3"
                  variant="outlined"
                  size="lg"
                  onClick={handleRenameBox}
                  style={{ cursor: "pointer", minWidth: "120px", textAlign: "center" }}
                >
                  {activeBox?.name || `Box ${currentBoxIndex + 1}`}
                </Text>
                <button className="box-action-btn pxl-border" onClick={handleNextBox}>
                  <IconArrowRight size={18} />
                </button>
              </div>
              <Text as="span" variant="darker" size="sm">
                Pokemons: {activeBox?.pokemons.length || 0} / 30
              </Text>
            </S.BoxControls>

            {/* Grid Box */}
            <S.BoxGridContainer
              ref={gridContainerRef}
              bgUrl={activeBox ? getBoxBgUrl(activeBox.backgroundImage) : ""}
              onMouseDown={handleGridMouseDown}
              onMouseMove={handleGridMouseMove}
              onMouseUp={handleGridMouseUp}
            >
              {selectionBox && selectionBox.active && (
                <S.SelectionRectangle
                  startX={Math.min(selectionBox.start.x, selectionBox.end.x)}
                  startY={Math.min(selectionBox.start.y, selectionBox.end.y)}
                  width={Math.abs(selectionBox.start.x - selectionBox.end.x)}
                  height={Math.abs(selectionBox.start.y - selectionBox.end.y)}
                />
              )}

              {Array.from({ length: 30 }).map((_, slotIdx) => {
                const poke = activeBox?.pokemons.find((p) => p.slotIndex === slotIdx);
                const isSelectedGroup = poke ? selectedGroupIds.has(poke.id) : false;
                const isMatch = poke ? matchesSearch(poke) : true;
                const isDimmed = searchQuery && poke ? !isMatch : false;

                const isCompareSelected = poke ? comparePokemons.some((cp) => cp.id === poke.id) : false;
                const compareIdx = poke ? comparePokemons.findIndex((cp) => cp.id === poke.id) : -1;

                return (
                  <S.BoxSlotCell
                    key={`box-slot-${slotIdx}`}
                    isEmpty={!poke}
                    isHovered={false}
                    isDraggingOver={heldPokemon !== null && !poke}
                    isDimmed={isDimmed}
                    isHighlighted={isSelectedGroup}
                    isShiny={poke?.isShiny}
                    isCompareSelected={isCompareSelected}
                    data-slot-index={slotIdx}
                    data-pokemon-id={poke?.id}
                    onMouseDown={(e) => handleSlotMouseDown(e, slotIdx, false)}
                    onMouseUp={() => handleSlotMouseUp(slotIdx, false)}
                    onClick={() => {
                      if (selectionMode === "group" && poke) {
                        handleLiftGroup(poke.id);
                      } else if (heldGroup) {
                        handleDropGroup(slotIdx);
                      } else {
                        handleSlotClick(slotIdx, false);
                      }
                    }}
                    onContextMenu={(e) => poke && handleRightClickSlot(e, poke)}
                  >
                    {poke ? (
                      <>
                        <img className="sprite" src={poke.spriteUrl} alt={poke.displayName} />
                        {isCompareSelected && (
                          <span className="compare-badge">♦{compareIdx + 1}</span>
                        )}
                        <div className="mini-info">
                          <span>{poke.displayName.slice(0, 7)}</span>
                          <span>L.{poke.currentLevel}</span>
                        </div>
                        {poke.markings && (
                          <div className="markings-dots">
                            {poke.markings.split(",").map((m, i) => (
                              <span key={i}>•</span>
                            ))}
                          </div>
                        )}
                      </>
                    ) : null}
                  </S.BoxSlotCell>
                );
              })}
            </S.BoxGridContainer>
          </S.BoxWrapper>

          {/* RIGHT: Controls & Wallpaper Selector */}
          <S.RightPanelCard className="pxl-border no-inset">
            {/* Search filter */}
            <div>
              <Text as="h3" variant="darker" size="md" style={{ marginBottom: "8px" }}>
                Filters
              </Text>
              <S.SearchBoxWrapper className="pxl-border no-inset">
                <IconSearch size={18} style={{ color: "#64748b" }} />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search name, type or ID (F/S)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
                    onClick={() => setSearchQuery("")}
                  >
                    <IconX size={14} />
                  </button>
                )}
              </S.SearchBoxWrapper>
            </div>

            {/* Selection modes */}
            <div>
              <Text as="h3" variant="darker" size="md" style={{ marginBottom: "8px" }}>
                Cursor Modes
              </Text>
              <S.ModeSelectors>
                <S.ModeButton
                  className="pxl-border"
                  active={selectionMode === "default"}
                  btnColor="#3b82f6"
                  onClick={() => setSelectionMode("default")}
                >
                  <IconClick size={16} /> Default Mode (Y)
                </S.ModeButton>
                <S.ModeButton
                  className="pxl-border"
                  active={selectionMode === "relocate"}
                  btnColor="#fbbf24"
                  onClick={() => setSelectionMode("relocate")}
                >
                  <IconHandMove size={16} /> Relocate Mode (M)
                </S.ModeButton>
                <S.ModeButton
                  className="pxl-border"
                  active={selectionMode === "group"}
                  btnColor="#10b981"
                  onClick={() => setSelectionMode("group")}
                >
                  <IconLayout size={16} /> Group Move Mode (H)
                </S.ModeButton>
              </S.ModeSelectors>
            </div>

            {/* Comparison select summary */}
            {comparePokemons.length > 0 && (
              <div>
                <Text as="h3" variant="darker" size="md" style={{ marginBottom: "8px" }}>
                  Comparison ({comparePokemons.length}/2)
                </Text>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {comparePokemons.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#f1f5f9",
                        border: "1.5px solid #cbd5e1",
                        padding: "6px 10px",
                        borderRadius: 0,
                      }}
                    >
                      <span style={{ fontSize: "0.95rem", fontWeight: "bold" }}>{p.displayName}</span>
                      <button
                        style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
                        onClick={() => setComparePokemons((prev) => prev.filter((item) => item.id !== p.id))}
                      >
                        <IconX size={14} />
                      </button>
                    </div>
                  ))}
                  {comparePokemons.length === 2 && (
                    <S.CompareButton
                      className="pxl-border"
                      onClick={() => setIsComparing(true)}
                    >
                      Compare Statistics (C)
                    </S.CompareButton>
                  )}
                </div>
              </div>
            )}

            {/* Wallpaper Selection */}
            <S.WallpaperSelectorWrapper>
              <Text as="h3" variant="darker" size="md" style={{ marginBottom: "8px" }}>
                Box Wallpapers
              </Text>
              <S.WallpaperGrid>
                {DEFAULT_WALLPAPERS.map((wp) => (
                  <S.WallpaperItem
                    key={wp}
                    selected={activeBox?.backgroundImage === wp}
                    bgUrl={`/wallpaper/${wp}`}
                    onClick={() => handleSelectWallpaper(wp)}
                  />
                ))}
              </S.WallpaperGrid>

              {/* Upload image */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleWallpaperUpload}
                style={{ display: "none" }}
              />
              <S.UploadWallpaperZone
                className="pxl-border no-inset"
                ref={wpDropZoneRef}
                isDragging={isWpDragging}
                onClick={() => !uploading && fileInputRef.current?.click()}
                onDragEnter={handleWpDragEnter}
                onDragOver={handleWpDragOver}
                onDragLeave={handleWpDragLeave}
                onDrop={handleWpDrop}
                style={{
                  opacity: uploading ? 0.5 : 1,
                  cursor: uploading ? "not-allowed" : "pointer",
                }}
              >
                <IconPhoto size={20} />
                <span>
                  {uploading ? `${uploadProgress}% Uploading...` : "Upload custom wallpaper"}
                </span>
              </S.UploadWallpaperZone>
            </S.WallpaperSelectorWrapper>
          </S.RightPanelCard>
        </S.Workspace>
      </S.Page>

      {/* Floating held pokemon preview */}
      {heldPokemon && (
        <S.FloatingHeldPokemon x={mousePos.x} y={mousePos.y}>
          <img src={heldPokemon.pokemon.spriteUrl} alt={heldPokemon.pokemon.displayName} />
        </S.FloatingHeldPokemon>
      )}

      {/* Floating group tray preview */}
      {heldGroup && (
        <S.FloatingGroupPreview x={mousePos.x} y={mousePos.y}>
          {heldGroup.map((m) => (
            <img key={m.pokemon.id} src={m.pokemon.spriteUrl} alt={m.pokemon.displayName} />
          ))}
        </S.FloatingGroupPreview>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <S.ContextMenu x={contextMenu.x} y={contextMenu.y} className="pxl-border no-inset">
          <S.ContextMenuItem onClick={() => handleToggleFavorite(contextMenu.pokemon)}>
            <IconStar size={16} /> Favorite
          </S.ContextMenuItem>
          <S.ContextMenuItem onClick={() => handleAddToCompare(contextMenu.pokemon)}>
            <IconGitCompare size={16} /> Compare list
          </S.ContextMenuItem>
          <S.ContextMenuItem onClick={() => handleQuickGiveItem(contextMenu.pokemon)}>
            <IconBriefcase size={16} /> Held Item Leftovers
          </S.ContextMenuItem>
          <div style={{ borderBottom: "1px solid rgba(15, 23, 42, 0.08)", margin: "4px 0" }} />
          <div style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#64748b", fontWeight: "bold" }}>Markings:</div>
          <div style={{ display: "flex", gap: "2px", padding: "0 6px 4px" }}>
            <button
              style={{ background: "transparent", border: "none", color: "#334155", padding: "2px", cursor: "pointer", fontSize: "1.1rem" }}
              onClick={() => handleToggleMarking(contextMenu.pokemon, "circle")}
            >
              ●
            </button>
            <button
              style={{ background: "transparent", border: "none", color: "#334155", padding: "2px", cursor: "pointer", fontSize: "1.1rem" }}
              onClick={() => handleToggleMarking(contextMenu.pokemon, "triangle")}
            >
              ▲
            </button>
            <button
              style={{ background: "transparent", border: "none", color: "#334155", padding: "2px", cursor: "pointer", fontSize: "1.1rem" }}
              onClick={() => handleToggleMarking(contextMenu.pokemon, "square")}
            >
              ■
            </button>
            <button
              style={{ background: "transparent", border: "none", color: "#334155", padding: "2px", cursor: "pointer", fontSize: "1.1rem" }}
              onClick={() => handleToggleMarking(contextMenu.pokemon, "heart")}
            >
              ♥
            </button>
            <button
              style={{ background: "transparent", border: "none", color: "#334155", padding: "2px", cursor: "pointer", fontSize: "1.1rem" }}
              onClick={() => handleToggleMarking(contextMenu.pokemon, "star")}
            >
              ★
            </button>
          </div>
          <div style={{ borderBottom: "1px solid rgba(15, 23, 42, 0.08)", margin: "4px 0" }} />
          <S.ContextMenuItem className="danger" onClick={() => handleReleasePokemon(contextMenu.pokemon)}>
            <IconTrash size={16} /> Release
          </S.ContextMenuItem>
        </S.ContextMenu>
      )}
 
      {/* Compare Modal */}
      {isComparing && comparePokemons.length === 2 && (
        <S.CompareOverlay onClick={() => setIsComparing(false)}>
          <S.CompareContainer className="pxl-border" onClick={(e) => e.stopPropagation()}>
            <div className="compare-header">
              <Text as="h2" variant="outlined" size="lg">Compare Stats</Text>
              <S.CloseBtn className="pxl-border" onClick={() => setIsComparing(false)}>Close Compare</S.CloseBtn>
            </div>
            <div className="compare-grids">
              {comparePokemons.map((p, idx) => {
                const otherP = comparePokemons[(idx + 1) % 2];
                return (
                  <S.CompareCard key={p.id} className="pxl-border no-inset">
                    <img className="sprite" src={p.spriteUrl} alt={p.displayName} />
                    <Text as="h3" variant="outlined" size="lg" style={{ marginTop: "12px" }}>
                      {p.displayName}
                    </Text>
                    <div className="details">
                      <div className="detail-row">
                        <span className="label">Level</span>
                        <span className="val">{p.currentLevel}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Nature</span>
                        <span className="val">{p.natureDisplay}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Gender</span>
                        <span className="val">{p.genderDisplay}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Win Rate</span>
                        <span className="val">{p.winRate}%</span>
                      </div>
 
                      {/* Stat comparisons */}
                      <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <S.StatCompareRow>
                          <div className="stat-label">
                            <span>HP</span>
                            <span>{p.calculatedHp}</span>
                          </div>
                          <div className="bar-container">
                            <S.StatCompareBar
                              percent={(p.calculatedHp / 250) * 100}
                              isWinner={p.calculatedHp > otherP.calculatedHp}
                            />
                          </div>
                        </S.StatCompareRow>
                        <S.StatCompareRow>
                          <div className="stat-label">
                            <span>Attack</span>
                            <span>{p.calculatedAttack}</span>
                          </div>
                          <div className="bar-container">
                            <S.StatCompareBar
                              percent={(p.calculatedAttack / 250) * 100}
                              isWinner={p.calculatedAttack > otherP.calculatedAttack}
                            />
                          </div>
                        </S.StatCompareRow>
                        <S.StatCompareRow>
                          <div className="stat-label">
                            <span>Defense</span>
                            <span>{p.calculatedDefense}</span>
                          </div>
                          <div className="bar-container">
                            <S.StatCompareBar
                              percent={(p.calculatedDefense / 250) * 100}
                              isWinner={p.calculatedDefense > otherP.calculatedDefense}
                            />
                          </div>
                        </S.StatCompareRow>
                        <S.StatCompareRow>
                          <div className="stat-label">
                            <span>Sp. Attack</span>
                            <span>{p.calculatedSpecialAttack}</span>
                          </div>
                          <div className="bar-container">
                            <S.StatCompareBar
                              percent={(p.calculatedSpecialAttack / 250) * 100}
                              isWinner={p.calculatedSpecialAttack > otherP.calculatedSpecialAttack}
                            />
                          </div>
                        </S.StatCompareRow>
                        <S.StatCompareRow>
                          <div className="stat-label">
                            <span>Sp. Defense</span>
                            <span>{p.calculatedSpecialDefense}</span>
                          </div>
                          <div className="bar-container">
                            <S.StatCompareBar
                              percent={(p.calculatedSpecialDefense / 250) * 100}
                              isWinner={p.calculatedSpecialDefense > otherP.calculatedSpecialDefense}
                            />
                          </div>
                        </S.StatCompareRow>
                        <S.StatCompareRow>
                          <div className="stat-label">
                            <span>Speed</span>
                            <span>{p.calculatedSpeed}</span>
                          </div>
                          <div className="bar-container">
                            <S.StatCompareBar
                              percent={(p.calculatedSpeed / 250) * 100}
                              isWinner={p.calculatedSpeed > otherP.calculatedSpeed}
                            />
                          </div>
                        </S.StatCompareRow>
                      </div>
                    </div>
                  </S.CompareCard>
                );
              })}
            </div>
          </S.CompareContainer>
        </S.CompareOverlay>
      )}

      {/* Box List modal */}
      {showBoxList && (
        <S.BoxListModalOverlay onClick={() => setShowBoxList(false)}>
          <S.BoxListModalContainer className="pxl-border" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Text as="h3" variant="outlined" size="lg">PC Storage Hộp Danh Sách (32 Hộp)</Text>
              <S.ModalCloseButton onClick={() => setShowBoxList(false)}>
                <IconX size={20} />
              </S.ModalCloseButton>
            </div>
            <div className="grid-container">
              {boxes.map((box, idx) => (
                <S.BoxThumbnailItem
                  key={box.id}
                  isActive={idx === currentBoxIndex}
                  bgUrl={getBoxBgUrl(box.backgroundImage)}
                  draggable
                  onDragStart={(e) => handleBoxDragStart(e, box.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleBoxDrop(e, box.id)}
                  onClick={() => handleSelectBoxFromModal(idx)}
                >
                  <span className="box-num">{box.name}</span>
                  <span className="box-count">{box.pokemons.length}/30</span>
                </S.BoxThumbnailItem>
              ))}
            </div>
          </S.BoxListModalContainer>
        </S.BoxListModalOverlay>
      )}
 
      {/* Keyboard shortcuts help overlay */}
      {showHelp && (
        <S.HelpOverlay onClick={() => setShowHelp(false)}>
          <S.HelpContainer className="pxl-border" onClick={(e) => e.stopPropagation()}>
            <Text as="h3" variant="outlined" size="lg" style={{ marginBottom: "16px", paddingBottom: "8px" }}>
              Keyboard Shortcuts System
            </Text>
            <div className="shortcuts-grid">
              <div className="shortcut-row">
                <span className="desc">Cursor Mode: Default (Context Menu)</span>
                <span className="key">Y</span>
              </div>
              <div className="shortcut-row">
                <span className="desc">Cursor Mode: Relocate (Move / Swap)</span>
                <span className="key">M</span>
              </div>
              <div className="shortcut-row">
                <span className="desc">Cursor Mode: Group Move (Tray Drag)</span>
                <span className="key">H</span>
              </div>
              <div className="shortcut-row">
                <span className="desc">Slide left to previous Box</span>
                <span className="key">Arrow Left / A</span>
              </div>
              <div className="shortcut-row">
                <span className="desc">Slide right to next Box</span>
                <span className="key">Arrow Right / D</span>
              </div>
              <div className="shortcut-row">
                <span className="desc">Open Box list grid modal</span>
                <span className="key">B</span>
              </div>
              <div className="shortcut-row">
                <span className="desc">Open selected Pokémon comparison</span>
                <span className="key">C</span>
              </div>
              <div className="shortcut-row">
                <span className="desc">Focus Search filter field</span>
                <span className="key">F / S</span>
              </div>
              <div className="shortcut-row">
                <span className="desc">Cancel current action or close modal</span>
                <span className="key">ESC</span>
              </div>
              <div className="shortcut-row">
                <span className="desc">Drop held Pokémon to Party slot 1-6</span>
                <span className="key">1 - 6</span>
              </div>
            </div>
            <S.HelpCloseButton className="pxl-border" onClick={() => setShowHelp(false)}>Close Help</S.HelpCloseButton>
          </S.HelpContainer>
        </S.HelpOverlay>
      )}
    </>
  );
};

export default PCStorage;
