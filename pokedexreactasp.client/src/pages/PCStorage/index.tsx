import React, { useState, useEffect, useRef, useMemo, MouseEvent } from "react";
import toast from "react-hot-toast";
import gsap from "gsap";
import {
  IconSearch,
  IconPhoto,
  IconArrowLeft,
  IconArrowRight,
  IconX,
  IconStar,
  IconHelp,
  IconTrash,
  IconLayout,
} from "@tabler/icons-react";

import { Navbar, Text } from "@/components/ui";
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

// ── Constants ────────────────────────────────────────────────
const DRAG_THRESHOLD = 8; // px before drag starts
const STAT_MAX = 255;

const NATURE_EFFECTS: Record<string, { increased: string; decreased: string } | null> = {
  lonely: { increased: "ATK", decreased: "DEF" },
  brave: { increased: "ATK", decreased: "SPD" },
  adamant: { increased: "ATK", decreased: "SpA" },
  naughty: { increased: "ATK", decreased: "SpD" },
  bold: { increased: "DEF", decreased: "ATK" },
  relaxed: { increased: "DEF", decreased: "SPD" },
  impish: { increased: "DEF", decreased: "SpA" },
  lax: { increased: "DEF", decreased: "SpD" },
  timid: { increased: "SPD", decreased: "ATK" },
  hasty: { increased: "SPD", decreased: "DEF" },
  jolly: { increased: "SPD", decreased: "SpA" },
  naive: { increased: "SPD", decreased: "SpD" },
  modest: { increased: "SpA", decreased: "ATK" },
  mild: { increased: "SpA", decreased: "DEF" },
  quiet: { increased: "SpA", decreased: "SPD" },
  rash: { increased: "SpA", decreased: "SpD" },
  calm: { increased: "SpD", decreased: "ATK" },
  gentle: { increased: "SpD", decreased: "DEF" },
  sassy: { increased: "SpD", decreased: "SPD" },
  careful: { increased: "SpD", decreased: "SpA" },
};

const getIvJudgeText = (iv: number | null): string => {
  if (iv === null) return "Decent";
  if (iv === 31) return "Best";
  if (iv === 30) return "Fantastic";
  if (iv >= 26) return "Very Good";
  if (iv >= 16) return "Pretty Good";
  if (iv >= 1) return "Decent";
  return "No Good";
};

const getPokeballSpriteUrl = (ball: number): string => {
  const ballNames: Record<number, string> = {
    0: "poke-ball",
    1: "great-ball",
    2: "ultra-ball",
    3: "master-ball",
    10: "quick-ball",
    11: "timer-ball",
    12: "dusk-ball",
    13: "net-ball",
    14: "dive-ball",
    15: "nest-ball",
    16: "repeat-ball",
    17: "luxury-ball",
    18: "premier-ball",
    19: "heal-ball",
  };
  const name = ballNames[ball] || "poke-ball";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`;
};


const TYPE_COLORS: Record<string, string> = {
  fire: "#FF6B35",    water: "#4A90E2",   grass: "#5CB85C",
  electric: "#F0C040", ice: "#74CEC0",    fighting: "#C03028",
  poison: "#A040A0",  ground: "#E0C068",  flying: "#A890F0",
  psychic: "#F85888", bug: "#A8B820",     rock: "#B8A038",
  ghost: "#705898",   dragon: "#7038F8",  dark: "#705848",
  steel: "#B8B8D0",   fairy: "#EE99AC",   normal: "#A8A878",
};

const DEFAULT_WALLPAPERS = [
  // Base BDSP
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
  "Box_Checks_BDSP.png",
  "Box_Nostalgic_BDSP.png",
  "Box_Pikapika_BDSP.png",
  "Box_Pokemon_Center_BDSP.png",
  "Box_Simple_BDSP.png",
  "Box_Team_Galactic_BDSP.png",
  "Box_Torchic_BDSP.png",
  "Box_Trio_BDSP.png",
  // Platinum variants
  "Box_Contest_Platinum_BDSP.png",
  "Box_Croagunk_Platinum_BDSP.png",
  "Box_Distortion_Platinum_BDSP.png",
  "Box_Legend_Platinum_BDSP.png",
  "Box_Nostalgic_Platinum_BDSP.png",
  "Box_Pikapika_Platinum_BDSP.png",
  "Box_Team_Galactic_Platinum_BDSP.png",
  "Box_Trio_Platinum_BDSP.png",
  // Special
  "Box_Slowpoke_BDSP.jpg",
];

// ── Interfaces ───────────────────────────────────────────────
interface Position { x: number; y: number; }

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

interface DragCandidate {
  pokemon: UserPokemonDto;
  fromParty: boolean;
  fromSlot: number;
  fromBoxId: number | null;
  startX: number;
  startY: number;
}

// ─────────────────────────────────────────────────────────────

const PCStorage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // ── Data ─────────────────────────────────────────────────
  const { data: boxes = [], isLoading: isLoadingBoxes } = useUserBoxes();
  const updateBoxMutation    = useUpdateBox();
  const movePokemonMutation  = useMovePokemon();
  const moveBatchMutation    = useMovePokemonBatch();
  const reorderBoxesMutation = useReorderBoxes();
  const { uploadFile, uploading, uploadProgress } = useSupabaseStorage();

  // ── UI State ──────────────────────────────────────────────
  const [currentBoxIndex, setCurrentBoxIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery]         = useState<string>("");
  const [partyPokemons, setPartyPokemons]     = useState<UserPokemonDto[]>([]);
  const [showBoxList, setShowBoxList]         = useState<boolean>(false);
  const [showHelp, setShowHelp]               = useState<boolean>(false);

  // ── Selection ─────────────────────────────────────────────
  // Primary single-click selection → shows detail panel
  const [selectedPokemon, setSelectedPokemon] = useState<UserPokemonDto | null>(null);
  // Ctrl+Click multi-select (max 2) → group drag / compare
  const [multiSelectedIds, setMultiSelectedIds] = useState<Set<number>>(new Set());
  // For Shift+Click range select
  const [lastClickedCtx, setLastClickedCtx] = useState<{ slot: number; isParty: boolean } | null>(null);

  // ── Drag State ────────────────────────────────────────────
  const [heldPokemon, setHeldPokemon] = useState<HeldPokemonInfo | null>(null);
  const [heldGroup, setHeldGroup]     = useState<GroupMemberInfo[] | null>(null);
  const [mousePos, setMousePos]       = useState<Position>({ x: 0, y: 0 });

  // ── Compare ───────────────────────────────────────────────
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // ── Context Menu ──────────────────────────────────────────
  const [contextMenu, setContextMenu] = useState<{
    x: number; y: number; pokemon: UserPokemonDto;
  } | null>(null);

  // ── Wallpaper upload DnD ──────────────────────────────────
  const [isWpDragging, setIsWpDragging] = useState<boolean>(false);

  // ── Refs ──────────────────────────────────────────────────
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef     = useRef<HTMLInputElement>(null);
  const wpDropZoneRef    = useRef<HTMLDivElement>(null);
  // Drag candidate recorded on mousedown
  const dragCandidateRef = useRef<DragCandidate | null>(null);
  // Set to true once drag threshold exceeded (to guard onClick)
  const isDraggingRef    = useRef<boolean>(false);
  // Set to true when drop lands on valid slot (to prevent global cancel)
  const didDropRef       = useRef<boolean>(false);

  // ── Derived ───────────────────────────────────────────────
  const activeBox = boxes[currentBoxIndex] as UserBoxDto | undefined;

  /** User-uploaded wallpaper URLs collected from all boxes (deduped) */
  const userUploadedWallpapers = useMemo<string[]>(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    boxes.forEach((box) => {
      const bg = box.backgroundImage;
      if (bg?.startsWith("http") && !seen.has(bg)) {
        seen.add(bg);
        result.push(bg);
      }
    });
    return result;
  }, [boxes]);

  /** The two Ctrl-selected pokemon (for compare) */
  const compareFromMulti = useMemo<UserPokemonDto[]>(() => {
    if (multiSelectedIds.size < 2) return [];
    const allPokes: UserPokemonDto[] = [];
    const seen = new Set<number>();
    [...boxes.flatMap((b) => b.pokemons), ...partyPokemons].forEach((p) => {
      if (!seen.has(p.id)) { seen.add(p.id); allPokes.push(p); }
    });
    return allPokes.filter((p) => multiSelectedIds.has(p.id)).slice(0, 2);
  }, [multiSelectedIds, boxes, partyPokemons]);

  // ── 1. Party load ─────────────────────────────────────────
  const loadParty = async () => {
    if (!isAuthenticated) return;
    try {
      const coll = await collectionService.getCollection();
      setPartyPokemons(
        coll.filter((p) => p.isInParty).sort((a, b) => a.slotIndex - b.slotIndex)
      );
    } catch { /* silent */ }
  };

  useEffect(() => { loadParty(); }, [isAuthenticated, boxes]);

  // ── 2. Drag detection ─────────────────────────────────────
  useEffect(() => {
    const onMouseMove = (e: globalThis.MouseEvent) => {
      // Detect drag threshold crossing
      if (dragCandidateRef.current && !isDraggingRef.current) {
        const dx = e.clientX - dragCandidateRef.current.startX;
        const dy = e.clientY - dragCandidateRef.current.startY;
        if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
          isDraggingRef.current = true;
          const dc = dragCandidateRef.current;
          dragCandidateRef.current = null;

          // Multi-selected group drag
          if (!dc.fromParty && multiSelectedIds.has(dc.pokemon.id) && multiSelectedIds.size > 1) {
            const pokesToLift = (activeBox?.pokemons ?? []).filter((p) =>
              multiSelectedIds.has(p.id)
            );
            const anchorRow = Math.floor(dc.fromSlot / 6);
            const anchorCol = dc.fromSlot % 6;
            setHeldGroup(
              pokesToLift.map((p) => ({
                pokemon: p,
                rowOffset: Math.floor(p.slotIndex / 6) - anchorRow,
                colOffset: (p.slotIndex % 6) - anchorCol,
                fromParty: false,
                fromSlot: p.slotIndex,
                fromBoxId: activeBox?.id ?? null,
              }))
            );
          } else {
            setHeldPokemon({
              pokemon: dc.pokemon,
              fromParty: dc.fromParty,
              fromSlot: dc.fromSlot,
              fromBoxId: dc.fromBoxId,
            });
          }
        }
      }

      if (heldPokemon || heldGroup) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [heldPokemon, heldGroup, multiSelectedIds, activeBox]);

  // ── 2b. Cancel drag on release outside slot ───────────────
  useEffect(() => {
    const onMouseUp = () => {
      dragCandidateRef.current = null;
      isDraggingRef.current    = false;
      if (!didDropRef.current) {
        if (heldPokemon) setHeldPokemon(null);
        if (heldGroup)   setHeldGroup(null);
      }
      didDropRef.current = false;
    };
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [heldPokemon, heldGroup]);

  // ── 3. Keyboard shortcuts ─────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") {
        if (e.key === "Escape") (document.activeElement as HTMLInputElement).blur();
        return;
      }
      switch (e.key.toLowerCase()) {
        case "arrowleft": case "a": handlePrevBox(); break;
        case "arrowright": case "d": handleNextBox(); break;
        case "b": setShowBoxList((v) => !v); break;
        case "c":
          if (compareFromMulti.length === 2) setIsComparing(true);
          break;
        case "f": case "s":
          e.preventDefault();
          document.getElementById("search-input")?.focus();
          break;
        case "escape":
          setHeldPokemon(null);
          setHeldGroup(null);
          setMultiSelectedIds(new Set());
          setSelectedPokemon(null);
          setContextMenu(null);
          setIsComparing(false);
          setShowBoxList(false);
          setShowHelp(false);
          break;
        case "1": case "2": case "3": case "4": case "5": case "6":
          if (heldPokemon) handleDropHeldPokemon(parseInt(e.key) - 1, true);
          break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentBoxIndex, boxes, heldPokemon, compareFromMulti]);

  // ── 4. Box navigation ─────────────────────────────────────
  const animateBoxTransition = (dir: "left" | "right") => {
    if (!gridContainerRef.current) return;
    gsap.fromTo(
      gridContainerRef.current,
      { x: dir === "right" ? 150 : -150, opacity: 0.4, scale: 0.98 },
      { x: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
    );
  };
  const handlePrevBox = () => {
    if (!boxes.length) return;
    animateBoxTransition("left");
    setCurrentBoxIndex((p) => (p - 1 + boxes.length) % boxes.length);
  };
  const handleNextBox = () => {
    if (!boxes.length) return;
    animateBoxTransition("right");
    setCurrentBoxIndex((p) => (p + 1) % boxes.length);
  };
  const handleSelectBoxFromModal = (idx: number) => {
    setShowBoxList(false);
    if (idx === currentBoxIndex) return;
    if (gridContainerRef.current) {
      gsap.fromTo(gridContainerRef.current,
        { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.1)" }
      );
    }
    setCurrentBoxIndex(idx);
  };

  // ── 5. Box bg ─────────────────────────────────────────────
  const getBoxBgUrl = (bg: string) => {
    if (!bg) return "/wallpaper/Box_Forest_BDSP.png";
    if (bg.startsWith("http")) return bg;
    return `/wallpaper/${bg}`;
  };

  // ── 6. Unified slot interaction ───────────────────────────
  const handleSlotMouseDown = (
    e: MouseEvent<HTMLElement>,
    slotIdx: number,
    isParty: boolean
  ) => {
    if (e.button !== 0) return;
    const poke = isParty
      ? partyPokemons.find((p) => p.slotIndex === slotIdx)
      : activeBox?.pokemons.find((p) => p.slotIndex === slotIdx);
    if (!poke) return;
    e.preventDefault();
    dragCandidateRef.current = {
      pokemon: poke,
      fromParty: isParty,
      fromSlot: slotIdx,
      fromBoxId: isParty ? null : (activeBox?.id ?? null),
      startX: e.clientX,
      startY: e.clientY,
    };
    isDraggingRef.current = false;
  };

  const handleSlotMouseUp = (slotIdx: number, isParty: boolean) => {
    if (heldPokemon) {
      didDropRef.current = true;
      handleDropHeldPokemon(slotIdx, isParty);
    } else if (heldGroup) {
      didDropRef.current = true;
      handleDropGroup(slotIdx);
    }
  };

  const handleSlotClick = (
    e: MouseEvent<HTMLElement>,
    slotIdx: number,
    isParty: boolean
  ) => {
    // Ignore if this was a drag (isDraggingRef still set from mousemove)
    if (isDraggingRef.current) { isDraggingRef.current = false; return; }

    setContextMenu(null);
    const poke = isParty
      ? partyPokemons.find((p) => p.slotIndex === slotIdx)
      : activeBox?.pokemons.find((p) => p.slotIndex === slotIdx);

    if (e.ctrlKey || e.metaKey) {
      // Ctrl+Click: toggle multi-select (for group drag / compare)
      if (!poke) return;
      setMultiSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(poke.id)) {
          next.delete(poke.id);
        } else {
          if (next.size >= 2) next.delete(next.values().next().value as number);
          next.add(poke.id);
        }
        return next;
      });
      setLastClickedCtx({ slot: slotIdx, isParty });
    } else if (e.shiftKey && lastClickedCtx && lastClickedCtx.isParty === isParty) {
      // Shift+Click: range select within same context
      if (!poke) return;
      const min = Math.min(slotIdx, lastClickedCtx.slot);
      const max = Math.max(slotIdx, lastClickedCtx.slot);
      const src = isParty ? partyPokemons : (activeBox?.pokemons ?? []);
      setMultiSelectedIds((prev) => {
        const next = new Set(prev);
        src.filter((p) => p.slotIndex >= min && p.slotIndex <= max).forEach((p) => next.add(p.id));
        return next;
      });
      setLastClickedCtx({ slot: slotIdx, isParty });
    } else {
      // Normal click: single select → show detail, clear multi
      setMultiSelectedIds(new Set());
      setSelectedPokemon(poke ?? null);
      if (poke) setLastClickedCtx({ slot: slotIdx, isParty });
    }
  };

  // ── 7. Drop logic ─────────────────────────────────────────
  const handleDropHeldPokemon = async (targetSlot: number, toParty: boolean) => {
    if (!heldPokemon) return;
    const { pokemon, fromParty } = heldPokemon;
    const targetPokemon = toParty
      ? partyPokemons.find((p) => p.slotIndex === targetSlot)
      : activeBox?.pokemons.find((p) => p.slotIndex === targetSlot);
    if (fromParty && !toParty && !targetPokemon && partyPokemons.length <= 1) {
      toast.error("Your party needs at least 1 Pokémon.");
      setHeldPokemon(null);
      return;
    }
    try {
      const result = await movePokemonMutation.mutateAsync({
        userPokemonId: pokemon.id,
        data: { targetBoxId: toParty ? null : (activeBox?.id ?? null), toParty, slotIndex: targetSlot },
      });
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Move failed.");
    } finally {
      setHeldPokemon(null);
      setMultiSelectedIds(new Set());
      loadParty();
    }
  };

  const handleDropGroup = async (targetAnchorSlot: number) => {
    if (!heldGroup || !activeBox) return;
    const anchorRow = Math.floor(targetAnchorSlot / 6);
    const anchorCol = targetAnchorSlot % 6;
    const occupied = new Set<number>();
    activeBox.pokemons.forEach((p) => {
      if (!heldGroup.some((m) => m.pokemon.id === p.id)) occupied.add(p.slotIndex);
    });
    const moves: MovePokemonItemDto[] = [];
    let invalid = false;
    for (const m of heldGroup) {
      const tRow = anchorRow + m.rowOffset;
      const tCol = anchorCol + m.colOffset;
      if (tRow < 0 || tRow >= 5 || tCol < 0 || tCol >= 6) {
        toast.error("Placement out of bounds!");
        invalid = true; break;
      }
      const tSlot = tRow * 6 + tCol;
      if (occupied.has(tSlot)) {
        toast.error("Target slots must be empty for group move.");
        invalid = true; break;
      }
      moves.push({ userPokemonId: m.pokemon.id, targetBoxId: activeBox.id, toParty: false, slotIndex: tSlot });
    }
    if (invalid) { setHeldGroup(null); setMultiSelectedIds(new Set()); return; }
    try {
      await moveBatchMutation.mutateAsync({ moves });
      toast.success("Pokémon moved.");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Move failed.");
    } finally {
      setHeldGroup(null);
      setMultiSelectedIds(new Set());
      loadParty();
    }
  };

  // ── 8. Wallpaper ──────────────────────────────────────────
  const handleSelectWallpaper = async (bg: string) => {
    if (!activeBox) return;
    try {
      await updateBoxMutation.mutateAsync({ boxId: activeBox.id, data: { name: activeBox.name, backgroundImage: bg } });
    } catch { toast.error("Failed to apply wallpaper."); }
  };

  const uploadAndApplyWallpaper = async (file: File) => {
    if (!activeBox) return;
    if (!file.type.startsWith("image/")) { toast.error("Invalid file type."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5 MB."); return; }
    try {
      toast.loading("Applying wallpaper…", { id: "wp" });
      const { url, error } = await uploadFile(file, "Kiremon", "box-wallpapers");
      if (error || !url) throw error ?? new Error();
      await updateBoxMutation.mutateAsync({ boxId: activeBox.id, data: { name: activeBox.name, backgroundImage: url } });
      toast.dismiss("wp");
      toast.success("Wallpaper applied!");
    } catch {
      toast.dismiss("wp");
      toast.error("Failed to apply wallpaper.");
    }
  };

  const handleWallpaperUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadAndApplyWallpaper(file);
  };

  const handleWpDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); if (!uploading) setIsWpDragging(true); };
  const handleWpDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); if (e.currentTarget === wpDropZoneRef.current) setIsWpDragging(false); };
  const handleWpDragOver  = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleWpDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsWpDragging(false);
    if (!uploading) { const f = e.dataTransfer.files?.[0]; if (f) await uploadAndApplyWallpaper(f); }
  };

  useEffect(() => {
    const onPaste = async (e: ClipboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || uploading) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.includes("image")) {
          const f = items[i].getAsFile();
          if (f) { e.preventDefault(); await uploadAndApplyWallpaper(f); break; }
        }
      }
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [activeBox, uploading]);

  // ── 9. Box management ─────────────────────────────────────
  const handleRenameBox = async () => {
    if (!activeBox) return;
    const n = prompt("New name:", activeBox.name);
    if (!n?.trim() || n === activeBox.name) return;
    try {
      await updateBoxMutation.mutateAsync({ boxId: activeBox.id, data: { name: n.trim(), backgroundImage: activeBox.backgroundImage } });
    } catch { toast.error("Rename failed."); }
  };

  const handleBoxDragStart = (e: React.DragEvent, boxId: number) =>
    e.dataTransfer.setData("boxId", boxId.toString());
  const handleBoxDrop = async (e: React.DragEvent, targetBoxId: number) => {
    const src = parseInt(e.dataTransfer.getData("boxId"));
    if (isNaN(src) || src === targetBoxId) return;
    try { await reorderBoxesMutation.mutateAsync({ boxIdA: src, boxIdB: targetBoxId }); }
    catch { toast.error("Reorder failed."); }
  };

  // ── 10. Context menu ──────────────────────────────────────
  const handleRightClickSlot = (e: MouseEvent, pokemon: UserPokemonDto) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, pokemon });
  };
  const handleToggleFavorite = async (p: UserPokemonDto) => {
    setContextMenu(null);
    try { await collectionService.toggleFavorite(p.id); loadParty(); } catch { toast.error("Action failed."); }
  };
  const handleReleasePokemon = async (p: UserPokemonDto) => {
    setContextMenu(null);
    if (p.isInParty && partyPokemons.length <= 1) { toast.error("Party needs at least 1 Pokémon."); return; }
    if (!window.confirm(`Release ${p.displayName}?`)) return;
    try {
      await collectionService.releasePokemon(p.id);
      toast.success(`${p.displayName} was released.`);
      if (selectedPokemon?.id === p.id) setSelectedPokemon(null);
      loadParty();
    } catch { toast.error("Release failed."); }
  };
  const handleToggleMarking = (p: UserPokemonDto, marking: string) => {
    setContextMenu(null);
    // TODO: persist via API when ready
    toast(`Marking toggled: ${marking}`);
  };

  // ── 11. Search ────────────────────────────────────────────
  const matchesSearch = (p: UserPokemonDto) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.displayName.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.pokemonApiId.toString() === q ||
      !!(p.type1?.toLowerCase().includes(q)) ||
      !!(p.type2?.toLowerCase().includes(q))
    );
  };

  // ── Radar Chart Calculations ──────────────────────────────
  const natureKey = selectedPokemon?.natureDisplay?.toLowerCase() || "";
  const natureEffect = NATURE_EFFECTS[natureKey];

  const getStatColor = (label: string) => {
    if (!natureEffect) return "#334155"; // dark slate for neutral
    if (natureEffect.increased === label) return "#dc2626"; // red for increased
    if (natureEffect.decreased === label) return "#2563eb"; // blue for decreased
    return "#334155";
  };

  const getStatArrow = (label: string, x: number, y: number) => {
    if (!natureEffect) return null;
    const isIncreased = natureEffect.increased === label;
    const isDecreased = natureEffect.decreased === label;
    if (isIncreased) {
      return (
        <polygon
          points={`${x},${y-4} ${x-4},${y+2} ${x+4},${y+2}`}
          fill="#dc2626"
          stroke="#ffffff"
          strokeWidth="0.5"
        />
      );
    } else if (isDecreased) {
      return (
        <polygon
          points={`${x},${y+2} ${x-4},${y-4} ${x+4},${y-4}`}
          fill="#2563eb"
          stroke="#ffffff"
          strokeWidth="0.5"
        />
      );
    }
    return null;
  };


  const getStatRadius = (iv: number | null) => {
    const val = iv ?? 15; // default to Decent if null
    return 10 + (val / 31) * 45; // maps 0..31 to 10..55 range
  };

  const radii = selectedPokemon
    ? [
        getStatRadius(selectedPokemon.ivHp),
        getStatRadius(selectedPokemon.ivAttack),
        getStatRadius(selectedPokemon.ivDefense),
        getStatRadius(selectedPokemon.ivSpeed),
        getStatRadius(selectedPokemon.ivSpecialDefense),
        getStatRadius(selectedPokemon.ivSpecialAttack),
      ]
    : [];

  const cx = 130;
  const cy = 110;

  const getGridHexagon = (r: number) => {
    return [0, 1, 2, 3, 4, 5]
      .map((i) => {
        const angle = -Math.PI / 2 + (i * Math.PI) / 3;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
      })
      .join(" ");
  };

  const polyPoints = radii
    .map((r, i) => {
      const angle = -Math.PI / 2 + (i * Math.PI) / 3;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(" ");

  const statItems = selectedPokemon
    ? [
        { label: "HP", displayName: "HP", judge: getIvJudgeText(selectedPokemon.ivHp) },
        { label: "ATK", displayName: "Attack", judge: getIvJudgeText(selectedPokemon.ivAttack) },
        { label: "DEF", displayName: "Defense", judge: getIvJudgeText(selectedPokemon.ivDefense) },
        { label: "SPD", displayName: "Speed", judge: getIvJudgeText(selectedPokemon.ivSpeed) },
        { label: "SpD", displayName: "Sp. Def", judge: getIvJudgeText(selectedPokemon.ivSpecialDefense) },
        { label: "SpA", displayName: "Sp. Atk", judge: getIvJudgeText(selectedPokemon.ivSpecialAttack) },
      ]
    : [];

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <>
      <Navbar />
      <S.Page>

        {/* ── Header ── */}
        <S.StorageHeader className="pxl-border no-inset">
          <div className="title-section">
            <Text as="h1" variant="outlined" size="xl">Pokémon PC Storage</Text>
            <Text as="p" variant="darker" size="sm">
              Click · Hold&amp;Drag to move · Ctrl+Click multi-select · Shift+Click range
            </Text>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <S.KeyboardInfoBtn className="pxl-border" onClick={() => setShowHelp(true)}>
              <IconHelp size={16} /> Help
            </S.KeyboardInfoBtn>
            <S.KeyboardInfoBtn className="pxl-border" onClick={() => setShowBoxList(true)}>
              <IconLayout size={16} /> Boxes (B)
            </S.KeyboardInfoBtn>
          </div>
        </S.StorageHeader>

        <S.Workspace>

          {/* ── LEFT: Party ── */}
          <S.SidebarCard className="pxl-border no-inset">
            <Text as="h2" variant="darker" size="lg" style={{ marginBottom: "16px" }}>
              Party
            </Text>
            <S.PartySlotsContainer>
              {Array.from({ length: 6 }).map((_, idx) => {
                const poke = partyPokemons.find((p) => p.slotIndex === idx);
                const isSel       = poke?.id === selectedPokemon?.id;
                const isMultiSel  = poke ? multiSelectedIds.has(poke.id) : false;
                return (
                  <S.PartySlot
                    key={`party-${idx}`}
                    isEmpty={!poke}
                    isHovered={false}
                    isDraggingOver={(heldPokemon !== null || heldGroup !== null) && !poke}
                    isSelected={isSel}
                    isMultiSelected={isMultiSel}
                    onMouseDown={(e) => handleSlotMouseDown(e, idx, true)}
                    onMouseUp={() => handleSlotMouseUp(idx, true)}
                    onClick={(e) => handleSlotClick(e, idx, true)}
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
                        {poke.isShiny && <span style={{ color: "#fbbf24", fontSize: 12 }}>★</span>}
                      </>
                    ) : (
                      <span style={{ fontSize: "0.95rem", color: "#64748b", margin: "auto" }}>—</span>
                    )}
                  </S.PartySlot>
                );
              })}
            </S.PartySlotsContainer>
          </S.SidebarCard>

          {/* ── CENTER: Box Grid ── */}
          <S.BoxWrapper className="pxl-border no-inset">
            <S.BoxControls className="pxl-border no-inset">
              <div className="navigation">
                <button className="box-action-btn pxl-border" onClick={handlePrevBox}>
                  <IconArrowLeft size={18} />
                </button>
                <Text
                  as="h3" variant="outlined" size="lg"
                  onClick={handleRenameBox}
                  style={{ cursor: "pointer", minWidth: "120px", textAlign: "center" }}
                >
                  {activeBox?.name ?? `Box ${currentBoxIndex + 1}`}
                </Text>
                <button className="box-action-btn pxl-border" onClick={handleNextBox}>
                  <IconArrowRight size={18} />
                </button>
              </div>
              <Text as="span" variant="darker" size="sm">
                {activeBox?.pokemons.length ?? 0} / 30
              </Text>
            </S.BoxControls>

            <S.BoxGridContainer
              ref={gridContainerRef}
              bgUrl={activeBox ? getBoxBgUrl(activeBox.backgroundImage) : ""}
            >
              {Array.from({ length: 30 }).map((_, slotIdx) => {
                const poke        = activeBox?.pokemons.find((p) => p.slotIndex === slotIdx);
                const isSel       = poke?.id === selectedPokemon?.id;
                const isMultiSel  = poke ? multiSelectedIds.has(poke.id) : false;
                const isDimmed    = !!(searchQuery && poke && !matchesSearch(poke));
                const compareIdx  = poke ? [...multiSelectedIds].indexOf(poke.id) : -1;
                return (
                  <S.BoxSlotCell
                    key={`box-slot-${slotIdx}`}
                    isEmpty={!poke}
                    isHovered={false}
                    isDraggingOver={(heldPokemon !== null || heldGroup !== null) && !poke}
                    isDimmed={isDimmed}
                    isHighlighted={isMultiSel}
                    isShiny={poke?.isShiny}
                    isCompareSelected={isMultiSel}
                    isSelected={isSel}
                    data-slot-index={slotIdx}
                    data-pokemon-id={poke?.id}
                    onMouseDown={(e) => handleSlotMouseDown(e, slotIdx, false)}
                    onMouseUp={() => handleSlotMouseUp(slotIdx, false)}
                    onClick={(e) => handleSlotClick(e, slotIdx, false)}
                    onContextMenu={(e) => poke && handleRightClickSlot(e, poke)}
                  >
                    {poke && (
                      <>
                        <img className="sprite" src={poke.spriteUrl} alt={poke.displayName} />
                        {isMultiSel && (
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
                    )}
                  </S.BoxSlotCell>
                );
              })}
            </S.BoxGridContainer>
          </S.BoxWrapper>

          {/* ── RIGHT: Detail + Wallpaper ── */}
          <S.RightPanelCard className="pxl-border no-inset">

            {/* Search */}
            <S.SearchBoxWrapper>
              <IconSearch size={18} style={{ color: "#64748b", flexShrink: 0 }} />
              <input
                id="search-input"
                type="text"
                placeholder="Name, type, or #ID  (F)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", padding: 0 }}
                  onClick={() => setSearchQuery("")}
                >
                  <IconX size={14} />
                </button>
              )}
            </S.SearchBoxWrapper>

            {/* Pokemon Detail Panel */}
            {selectedPokemon ? (
              <S.DetailPanel>
                <S.DetailTopBar>
                  <div className="left-section">
                    <img
                      src={getPokeballSpriteUrl(selectedPokemon.caughtBall)}
                      alt="Pokeball"
                      className="pokeball-icon"
                    />
                    <span className="name">{selectedPokemon.displayName}</span>
                  </div>
                  <div className="right-section">
                    <span className="lvl-pill">Lv.{selectedPokemon.currentLevel}</span>
                    <span className={`gender-badge ${selectedPokemon.gender === 0 ? "male" : selectedPokemon.gender === 1 ? "female" : "genderless"}`}>
                      {selectedPokemon.gender === 0 ? "♂" : selectedPokemon.gender === 1 ? "♀" : "⚲"}
                    </span>
                  </div>
                </S.DetailTopBar>

                <S.DetailSubBar>
                  <span className="dex-no">
                    No. {String(selectedPokemon.pokemonApiId).padStart(3, "0")}
                  </span>
                  {selectedPokemon.isShiny && <span className="shiny-star">★ Shiny</span>}
                </S.DetailSubBar>

                <S.DetailTypeRow>
                  {[selectedPokemon.type1, selectedPokemon.type2]
                    .filter(Boolean)
                    .map((t) => (
                      <span
                        key={t}
                        className="type-badge"
                        style={{ background: TYPE_COLORS[t!.toLowerCase()] ?? "#888" }}
                      >
                        {t!.toUpperCase()}
                      </span>
                    ))}
                </S.DetailTypeRow>

                <S.DetailArtworkArea>
                  <img
                    src={selectedPokemon.officialArtworkUrl ?? selectedPokemon.spriteUrl}
                    alt={selectedPokemon.displayName}
                    className="artwork"
                  />
                </S.DetailArtworkArea>

                <S.DetailStatsArea>
                  <div className="radar-chart-container">
                    <svg width="260" height="220" viewBox="0 0 260 220">
                      {/* Grid hexagons */}
                      <polygon points={getGridHexagon(60)} stroke="rgba(15, 23, 42, 0.12)" fill="none" strokeWidth="1" />
                      <polygon points={getGridHexagon(40)} stroke="rgba(15, 23, 42, 0.08)" fill="none" strokeWidth="1" />
                      <polygon points={getGridHexagon(20)} stroke="rgba(15, 23, 42, 0.05)" fill="none" strokeWidth="1" />

                      {/* Radial lines */}
                      {[0, 1, 2, 3, 4, 5].map((i) => {
                        const angle = -Math.PI / 2 + (i * Math.PI) / 3;
                        return (
                          <line
                            key={`line-${i}`}
                            x1={130}
                            y1={110}
                            x2={130 + 60 * Math.cos(angle)}
                            y2={110 + 60 * Math.sin(angle)}
                            stroke="rgba(15, 23, 42, 0.1)"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                          />
                        );
                      })}

                      {/* Stat poly */}
                      <polygon
                        points={polyPoints}
                        fill="rgba(59, 130, 246, 0.22)"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                      />

                      {/* Dots */}
                      {radii.map((r, i) => {
                        const angle = -Math.PI / 2 + (i * Math.PI) / 3;
                        const x = 130 + r * Math.cos(angle);
                        const y = 110 + r * Math.sin(angle);
                        return (
                          <circle
                            key={`dot-${i}`}
                            cx={x}
                            cy={y}
                            r="3.5"
                            fill="#ffffff"
                            stroke="#3b82f6"
                            strokeWidth="1.5"
                          />
                        );
                      })}

                      {/* Labels */}
                      {statItems.map((item, idx) => {
                        const angle = -Math.PI / 2 + (idx * Math.PI) / 3;
                        const color = getStatColor(item.label);

                        let lx = 130;
                        let ly = 110;
                        let textAnchor: "inherit" | "end" | "start" | "middle" = "middle";
                        let offsetLy1 = 0;
                        let offsetLy2 = 0;

                        if (idx === 0) {
                          lx = 130;
                          ly = 110 - 65;
                          textAnchor = "middle";
                          offsetLy1 = -6;
                          offsetLy2 = 6;
                        } else if (idx === 1) {
                          lx = 130 + 65 * 0.866;
                          ly = 110 - 65 * 0.5;
                          textAnchor = "start";
                          lx += 6;
                          offsetLy1 = -4;
                          offsetLy2 = 8;
                        } else if (idx === 2) {
                          lx = 130 + 65 * 0.866;
                          ly = 110 + 65 * 0.5;
                          textAnchor = "start";
                          lx += 6;
                          offsetLy1 = -4;
                          offsetLy2 = 8;
                        } else if (idx === 3) {
                          lx = 130;
                          ly = 110 + 65;
                          textAnchor = "middle";
                          offsetLy1 = 4;
                          offsetLy2 = 16;
                        } else if (idx === 4) {
                          lx = 130 - 65 * 0.866;
                          ly = 110 + 65 * 0.5;
                          textAnchor = "end";
                          lx -= 6;
                          offsetLy1 = -4;
                          offsetLy2 = 8;
                        } else if (idx === 5) {
                          lx = 130 - 65 * 0.866;
                          ly = 110 - 65 * 0.5;
                          textAnchor = "end";
                          lx -= 6;
                          offsetLy1 = -4;
                          offsetLy2 = 8;
                        }

                        let arrowX = lx;
                        if (idx === 1 || idx === 2) {
                          arrowX -= 12;
                        } else if (idx === 4 || idx === 5) {
                          arrowX += 12;
                        }

                        return (
                          <g key={item.label}>
                            <text
                              x={lx}
                              y={ly + offsetLy1}
                              textAnchor={textAnchor}
                              fill={color}
                              style={{
                                fontFamily: '"VT323", sans-serif',
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              {item.displayName}
                            </text>
                            <text
                              x={lx}
                              y={ly + offsetLy2}
                              textAnchor={textAnchor}
                              fill="#64748b"
                              style={{
                                fontFamily: '"VT323", sans-serif',
                                fontSize: "12px",
                              }}
                            >
                              {item.judge}
                            </text>
                            {getStatArrow(item.label, arrowX, ly + offsetLy1 - 3)}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </S.DetailStatsArea>

                <S.DetailNatureBar>
                  <span className="label">Nature</span>
                  <span className="value">{selectedPokemon.natureDisplay}</span>
                </S.DetailNatureBar>

                {selectedPokemon.ivRating && (
                  <S.DetailIvJudgmentBar>
                    <span className="rating-text">{selectedPokemon.ivRating}</span>
                  </S.DetailIvJudgmentBar>
                )}

                <S.DetailMarkingsBar>
                  {["circle", "triangle", "square", "heart", "star", "diamond"].map((shape) => {
                    const isActive = selectedPokemon.markings?.split(",").includes(shape);
                    const symbols: Record<string, string> = {
                      circle: "●",
                      triangle: "▲",
                      square: "■",
                      heart: "♥",
                      star: "★",
                      diamond: "◆",
                    };
                    return (
                      <span
                        key={shape}
                        className={`marking-shape ${isActive ? "active" : ""}`}
                        title={shape}
                      >
                        {symbols[shape]}
                      </span>
                    );
                  })}
                </S.DetailMarkingsBar>
              </S.DetailPanel>
            ) : (
              <S.DetailPlaceholder>
                <span className="hint-main">Select a Pokémon</span>
                <span className="hint-sub">
                  Ctrl+Click 2 Pokémon to compare their stats
                </span>
              </S.DetailPlaceholder>
            )}

            {/* Compare strip (when 2 ctrl-selected) */}
            {compareFromMulti.length === 2 && (
              <S.CompareStrip>
                <div className="compare-picks">
                  {compareFromMulti.map((p) => (
                    <div className="pick" key={p.id}>
                      <img src={p.spriteUrl} alt={p.displayName} />
                      <span>{p.displayName}</span>
                    </div>
                  ))}
                </div>
                <S.CompareButton
                  className="pxl-border"
                  onClick={() => setIsComparing(true)}
                >
                  ⚖ Compare Stats (C)
                </S.CompareButton>
              </S.CompareStrip>
            )}

            {/* Wallpaper selector */}
            <S.WallpaperSelectorWrapper>
              <Text as="h3" variant="darker" size="md" style={{ marginBottom: "8px" }}>
                Box Wallpaper
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
                {userUploadedWallpapers.map((url) => (
                  <S.WallpaperItem
                    key={url}
                    selected={activeBox?.backgroundImage === url}
                    bgUrl={url}
                    onClick={() => handleSelectWallpaper(url)}
                    title="Custom"
                  />
                ))}
              </S.WallpaperGrid>

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
                style={{ opacity: uploading ? 0.5 : 1, cursor: uploading ? "not-allowed" : "pointer" }}
              >
                <IconPhoto size={20} />
                <span>
                  {uploading
                    ? `${uploadProgress}% uploading…`
                    : "Upload · Drag & Drop · Ctrl+V"}
                </span>
              </S.UploadWallpaperZone>
            </S.WallpaperSelectorWrapper>

          </S.RightPanelCard>
        </S.Workspace>
      </S.Page>

      {/* ── Floating held pokemon ── */}
      {heldPokemon && (
        <S.FloatingHeldPokemon x={mousePos.x} y={mousePos.y}>
          <img src={heldPokemon.pokemon.spriteUrl} alt={heldPokemon.pokemon.displayName} />
        </S.FloatingHeldPokemon>
      )}

      {/* ── Floating group ── */}
      {heldGroup && (
        <S.FloatingGroupPreview x={mousePos.x} y={mousePos.y}>
          {heldGroup.map((m) => (
            <img key={m.pokemon.id} src={m.pokemon.spriteUrl} alt={m.pokemon.displayName} />
          ))}
        </S.FloatingGroupPreview>
      )}

      {/* ── Context Menu ── */}
      {contextMenu && (
        <S.ContextMenu x={contextMenu.x} y={contextMenu.y} className="pxl-border no-inset">
          <S.ContextMenuItem onClick={() => handleToggleFavorite(contextMenu.pokemon)}>
            <IconStar size={16} />
            {contextMenu.pokemon.isFavorite ? "Remove Favorite" : "Add to Favorites"}
          </S.ContextMenuItem>
          <div style={{ borderBottom: "1px solid rgba(15,23,42,0.08)", margin: "4px 0" }} />
          <div style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#64748b", fontWeight: "bold" }}>
            Markings
          </div>
          <div style={{ display: "flex", gap: "2px", padding: "0 6px 4px" }}>
            {(["circle","triangle","square","heart","star"] as const).map((m, i) => (
              <button
                key={m}
                style={{ background: "transparent", border: "none", color: "#334155", padding: "2px", cursor: "pointer", fontSize: "1.1rem" }}
                onClick={() => handleToggleMarking(contextMenu.pokemon, m)}
              >
                {["●","▲","■","♥","★"][i]}
              </button>
            ))}
          </div>
          <div style={{ borderBottom: "1px solid rgba(15,23,42,0.08)", margin: "4px 0" }} />
          <S.ContextMenuItem className="danger" onClick={() => handleReleasePokemon(contextMenu.pokemon)}>
            <IconTrash size={16} /> Release
          </S.ContextMenuItem>
        </S.ContextMenu>
      )}

      {/* ── Compare Modal ── */}
      {isComparing && compareFromMulti.length === 2 && (
        <S.CompareOverlay onClick={() => setIsComparing(false)}>
          <S.CompareContainer className="pxl-border" onClick={(e) => e.stopPropagation()}>
            <div className="compare-header">
              <Text as="h2" variant="outlined" size="lg">Compare Stats</Text>
              <S.CloseBtn className="pxl-border" onClick={() => setIsComparing(false)}>
                Close
              </S.CloseBtn>
            </div>
            <div className="compare-grids">
              {compareFromMulti.map((p, idx) => {
                const other = compareFromMulti[(idx + 1) % 2];
                return (
                  <S.CompareCard key={p.id} className="pxl-border no-inset">
                    <img className="sprite" src={p.spriteUrl} alt={p.displayName} />
                    <Text as="h3" variant="outlined" size="lg" style={{ marginTop: "12px" }}>
                      {p.displayName}
                    </Text>
                    <div className="details">
                      {[
                        { label: "Level",    val: p.currentLevel },
                        { label: "Nature",   val: p.natureDisplay },
                        { label: "Gender",   val: p.genderDisplay },
                        { label: "Win Rate", val: `${p.winRate}%` },
                      ].map(({ label, val }) => (
                        <div className="detail-row" key={label}>
                          <span className="label">{label}</span>
                          <span className="val">{val}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {[
                          { name: "HP",       a: p.calculatedHp,            b: other.calculatedHp },
                          { name: "Attack",   a: p.calculatedAttack,        b: other.calculatedAttack },
                          { name: "Defense",  a: p.calculatedDefense,       b: other.calculatedDefense },
                          { name: "Sp. Atk",  a: p.calculatedSpecialAttack, b: other.calculatedSpecialAttack },
                          { name: "Sp. Def",  a: p.calculatedSpecialDefense,b: other.calculatedSpecialDefense },
                          { name: "Speed",    a: p.calculatedSpeed,         b: other.calculatedSpeed },
                        ].map(({ name, a, b }) => (
                          <S.StatCompareRow key={name}>
                            <div className="stat-label">
                              <span>{name}</span>
                              <span>{a}</span>
                            </div>
                            <div className="bar-container">
                              <S.StatCompareBar percent={(a / 250) * 100} isWinner={a > b} />
                            </div>
                          </S.StatCompareRow>
                        ))}
                      </div>
                    </div>
                  </S.CompareCard>
                );
              })}
            </div>
          </S.CompareContainer>
        </S.CompareOverlay>
      )}

      {/* ── Box List Modal ── */}
      {showBoxList && (
        <S.BoxListModalOverlay onClick={() => setShowBoxList(false)}>
          <S.BoxListModalContainer className="pxl-border" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Text as="h3" variant="outlined" size="lg">PC Box List</Text>
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

      {/* ── Help Modal ── */}
      {showHelp && (
        <S.HelpOverlay onClick={() => setShowHelp(false)}>
          <S.HelpContainer className="pxl-border" onClick={(e) => e.stopPropagation()}>
            <Text as="h3" variant="outlined" size="lg" style={{ marginBottom: "16px", paddingBottom: "8px" }}>
              Controls
            </Text>
            <div className="shortcuts-grid">
              {[
                { desc: "Select Pokémon · show details",       key: "Click" },
                { desc: "Multi-select (group move / compare)", key: "Ctrl+Click" },
                { desc: "Range select",                        key: "Shift+Click" },
                { desc: "Move / swap Pokémon",                 key: "Hold & Drag" },
                { desc: "Drop to party slot 1–6",             key: "1 – 6" },
                { desc: "Navigate Boxes",                      key: "← / → / A / D" },
                { desc: "Open Box List",                       key: "B" },
                { desc: "Compare (2 selected)",                key: "C" },
                { desc: "Focus Search",                        key: "F / S" },
                { desc: "Cancel / Close",                      key: "ESC" },
              ].map(({ desc, key }) => (
                <div className="shortcut-row" key={key}>
                  <span className="desc">{desc}</span>
                  <span className="key">{key}</span>
                </div>
              ))}
            </div>
            <S.HelpCloseButton className="pxl-border" onClick={() => setShowHelp(false)}>
              Got it
            </S.HelpCloseButton>
          </S.HelpContainer>
        </S.HelpOverlay>
      )}
    </>
  );
};

export default PCStorage;
