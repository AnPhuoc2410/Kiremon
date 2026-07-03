import React, { useState, useEffect, useRef, useMemo, MouseEvent } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import gsap from "gsap";
import {
  IconSearch,
  IconPhoto,
  IconX,
  IconStar,
  IconHelp,
  IconTrash,
  IconLayout,
} from "@tabler/icons-react";

import { Navbar, Text, Button, StorageHeader } from "@/components/ui";

import { useAuth } from "@/contexts";
import { useSupabaseStorage } from "@/components/hooks/useSupabaseStorage";
import {
  useUserBoxes,
  useUpdateBox,
  useMovePokemon,
  useMovePokemonBatch,
  useReorderBoxes,
  useUpdatePokemonMoves,
} from "@/hooks/useBoxes";
import { usePokemonCore } from "@/hooks/queries";
import { collectionService } from "@/services/collection/collection.service";
import { UserPokemonDto } from "@/types/userspokemon.types";
import { UserBoxDto, MovePokemonItemDto } from "@/types/box.types";
import { MyPokemonCardsView } from "./components/MyPokemonCardsView";

import * as S from "./index.style";

import {
  Position,
  HeldPokemonInfo,
  GroupMemberInfo,
  DragCandidate,
} from "./types";
import {
  DRAG_THRESHOLD,
  NATURE_EFFECTS,
  TYPE_COLORS,
  DEFAULT_WALLPAPERS,
} from "./constants";
import { getIvJudgeText, getPokeballSpriteUrl } from "./utils";

// ─────────────────────────────────────────────────────────────

const PCStorage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // ── Data ─────────────────────────────────────────────────
  const { data: boxes = [], isLoading: isLoadingBoxes } = useUserBoxes();
  const updateBoxMutation = useUpdateBox();
  const movePokemonMutation = useMovePokemon();
  const moveBatchMutation = useMovePokemonBatch();
  const reorderBoxesMutation = useReorderBoxes();
  const updateMovesMutation = useUpdatePokemonMoves();
  const { uploadFile, uploading, uploadProgress } = useSupabaseStorage();

  // ── UI State ──────────────────────────────────────────────
  const [currentBoxIndex, setCurrentBoxIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [partyPokemons, setPartyPokemons] = useState<UserPokemonDto[]>([]);
  const [showBoxList, setShowBoxList] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [isEditingBoxName, setIsEditingBoxName] = useState<boolean>(false);
  const [editingBoxName, setEditingBoxName] = useState<string>("");
  const [boxFilter, setBoxFilter] = useState<"all" | "has_pokemon" | "empty">(
    "all",
  );

  // ── Selection ─────────────────────────────────────────────
  // Primary single-click selection → shows detail panel
  const [selectedPokemon, setSelectedPokemon] = useState<UserPokemonDto | null>(
    null,
  );
  const [hoveredPokemon, setHoveredPokemon] = useState<UserPokemonDto | null>(
    null,
  );
  const [activeMainTab, setActiveMainTab] = useState<
    "status" | "moves" | "stats"
  >("status");
  const [showMoveManager, setShowMoveManager] = useState(false);
  const [tempSelectedMoves, setTempSelectedMoves] = useState<number[]>([]);
  const [showRadarChart, setShowRadarChart] = useState(false);
  const [cardsModalOpen, setCardsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (selectedPokemon) {
      setActiveMainTab("status");
    }
  }, [selectedPokemon?.id]);

  // Ctrl+Click multi-select (max 2) → group drag / compare
  const [multiSelectedIds, setMultiSelectedIds] = useState<Set<number>>(
    new Set(),
  );
  // For Shift+Click range select
  const [lastClickedCtx, setLastClickedCtx] = useState<{
    slot: number;
    isParty: boolean;
  } | null>(null);

  // ── Drag State ────────────────────────────────────────────
  const [heldPokemon, setHeldPokemon] = useState<HeldPokemonInfo | null>(null);
  const [heldGroup, setHeldGroup] = useState<GroupMemberInfo[] | null>(null);
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });

  // ── Drag Selection (Marquee) State ────────────────────────
  const [dragSelectStart, setDragSelectStart] = useState<Position | null>(null);
  const [dragSelectCurrent, setDragSelectCurrent] = useState<Position | null>(
    null,
  );
  const [isDragSelecting, setIsDragSelecting] = useState<boolean>(false);
  const didDragSelectRef = useRef<boolean>(false);

  // ── Compare ───────────────────────────────────────────────
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [activeStatTab, setActiveStatTab] = useState<"iv" | "ev">("iv");

  // ── Context Menu ──────────────────────────────────────────
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    pokemon: UserPokemonDto;
  } | null>(null);

  // ── Wallpaper upload DnD ──────────────────────────────────
  const [isWpDragging, setIsWpDragging] = useState<boolean>(false);

  // ── Refs ──────────────────────────────────────────────────
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wpDropZoneRef = useRef<HTMLDivElement>(null);
  // Drag candidate recorded on mousedown
  const dragCandidateRef = useRef<DragCandidate | null>(null);
  // Set to true once drag threshold exceeded (to guard onClick)
  const isDraggingRef = useRef<boolean>(false);
  // Set to true when drop lands on valid slot (to prevent global cancel)
  const didDropRef = useRef<boolean>(false);

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
      if (!seen.has(p.id)) {
        seen.add(p.id);
        allPokes.push(p);
      }
    });
    return allPokes.filter((p) => multiSelectedIds.has(p.id)).slice(0, 2);
  }, [multiSelectedIds, boxes, partyPokemons]);

  const filteredBoxes = useMemo(() => {
    return boxes
      .map((box, idx) => ({ box, originalIndex: idx }))
      .filter(({ box }) => {
        if (boxFilter === "has_pokemon") return box.pokemons.length > 0;
        if (boxFilter === "empty") return box.pokemons.length === 0;
        return true;
      });
  }, [boxes, boxFilter]);

  const filterCounts = useMemo(() => {
    let occupied = 0;
    let empty = 0;
    boxes.forEach((b) => {
      if (b.pokemons.length > 0) occupied++;
      else empty++;
    });
    return { all: boxes.length, occupied, empty };
  }, [boxes]);

  // ── 1. Party load ─────────────────────────────────────────
  const loadParty = async () => {
    if (!isAuthenticated) return;
    try {
      const coll = await collectionService.getCollection();
      setPartyPokemons(
        coll
          .filter((p) => p.isInParty)
          .sort((a, b) => a.slotIndex - b.slotIndex),
      );
    } catch {
      /* silent */
    }
  };

  useEffect(() => {
    loadParty();
  }, [isAuthenticated, boxes]);

  // ── 2. Drag detection ─────────────────────────────────────
  useEffect(() => {
    const onMouseMove = (e: globalThis.MouseEvent) => {
      // Marquee selection drag
      if (isDragSelecting && dragSelectStart && gridContainerRef.current) {
        const rect = gridContainerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
        setDragSelectCurrent({ x, y });

        const dx = Math.abs(x - dragSelectStart.x);
        const dy = Math.abs(y - dragSelectStart.y);
        if (dx > 5 || dy > 5) {
          didDragSelectRef.current = true;
        }

        const selLeft = Math.min(dragSelectStart.x, x);
        const selRight = Math.max(dragSelectStart.x, x);
        const selTop = Math.min(dragSelectStart.y, y);
        const selBottom = Math.max(dragSelectStart.y, y);

        const cells =
          gridContainerRef.current.querySelectorAll("[data-slot-index]");
        const intersectedIds = new Set<number>();

        cells.forEach((cell) => {
          const cellRect = cell.getBoundingClientRect();
          const relativeCell = {
            left: cellRect.left - rect.left,
            top: cellRect.top - rect.top,
            right: cellRect.right - rect.left,
            bottom: cellRect.bottom - rect.top,
          };

          const intersects = !(
            relativeCell.left > selRight ||
            relativeCell.right < selLeft ||
            relativeCell.top > selBottom ||
            relativeCell.bottom < selTop
          );

          if (intersects) {
            const pokeIdAttr = cell.getAttribute("data-pokemon-id");
            if (pokeIdAttr) {
              intersectedIds.add(parseInt(pokeIdAttr));
            }
          }
        });

        setMultiSelectedIds(intersectedIds);
        return;
      }

      // Detect drag threshold crossing
      if (dragCandidateRef.current && !isDraggingRef.current) {
        const dx = e.clientX - dragCandidateRef.current.startX;
        const dy = e.clientY - dragCandidateRef.current.startY;
        if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
          isDraggingRef.current = true;
          const dc = dragCandidateRef.current;
          dragCandidateRef.current = null;

          // Multi-selected group drag
          if (
            !dc.fromParty &&
            multiSelectedIds.has(dc.pokemon.id) &&
            multiSelectedIds.size > 1
          ) {
            const pokesToLift: UserPokemonDto[] = [];
            for (const id of multiSelectedIds) {
              const p = activeBox?.pokemons.find((x) => x.id === id);
              if (p) pokesToLift.push(p);
            }
            setHeldGroup(
              pokesToLift.map((p) => ({
                pokemon: p,
                rowOffset: 0,
                colOffset: 0,
                fromParty: false,
                fromSlot: p.slotIndex,
                fromBoxId: activeBox?.id ?? null,
              })),
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
  }, [
    heldPokemon,
    heldGroup,
    multiSelectedIds,
    activeBox,
    isDragSelecting,
    dragSelectStart,
  ]);

  // ── 2b. Cancel drag on release outside slot ───────────────
  useEffect(() => {
    const onMouseUp = () => {
      dragCandidateRef.current = null;

      if (isDragSelecting) {
        setIsDragSelecting(false);
        setDragSelectStart(null);
        setDragSelectCurrent(null);
        if (!didDragSelectRef.current) {
          // Normal click on background/empty slot -> clear selection
          setMultiSelectedIds(new Set());
          setSelectedPokemon(null);
          setHoveredPokemon(null);
        }
        setTimeout(() => {
          didDragSelectRef.current = false;
        }, 50);
        return;
      }

      if (!didDropRef.current) {
        if (heldPokemon) setHeldPokemon(null);
        if (heldGroup) setHeldGroup(null);
      }
      didDropRef.current = false;

      setTimeout(() => {
        isDraggingRef.current = false;
      }, 50);
    };
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [heldPokemon, heldGroup, isDragSelecting, dragSelectStart]);

  // ── 2c. Scroll wheel box navigation during drag ───────────
  const lastWheelSwitchRef = useRef<number>(0);
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!heldPokemon && !heldGroup) return;

      // Always block browser scrolling while active dragging is happening
      e.preventDefault();

      const now = Date.now();
      if (now - lastWheelSwitchRef.current < 250) return;

      const boxCount = boxes.length;
      if (boxCount <= 1) return;

      if (e.deltaY < 0) {
        animateBoxTransition("left");
        setCurrentBoxIndex((p) => (p - 1 + boxCount) % boxCount);
        lastWheelSwitchRef.current = now;
      } else if (e.deltaY > 0) {
        animateBoxTransition("right");
        setCurrentBoxIndex((p) => (p + 1) % boxCount);
        lastWheelSwitchRef.current = now;
      }
    };

    window.addEventListener("wheel", onWheel, {
      capture: true,
      passive: false,
    });
    return () =>
      window.removeEventListener("wheel", onWheel, { capture: true });
  }, [heldPokemon, heldGroup, boxes.length]);

  // ── 3. Keyboard shortcuts ─────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") {
        if (e.key === "Escape")
          (document.activeElement as HTMLInputElement).blur();
        return;
      }
      switch (e.key.toLowerCase()) {
        case "arrowleft":
        case "a":
          handlePrevBox();
          break;
        case "arrowright":
        case "d":
          handleNextBox();
          break;
        case "b":
          setShowBoxList((v) => !v);
          break;
        case "c":
          if (compareFromMulti.length === 2) setIsComparing(true);
          break;
        case "f":
        case "s":
          e.preventDefault();
          document.getElementById("search-input")?.focus();
          break;
        case "escape":
          setHeldPokemon(null);
          setHeldGroup(null);
          setMultiSelectedIds(new Set());
          setSelectedPokemon(null);
          setHoveredPokemon(null);
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
      { x: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" },
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
      gsap.fromTo(
        gridContainerRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.1)" },
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

  const handleGridMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left click

    // Only start drag selecting if we click the grid background or an empty slot
    const target = e.target as HTMLElement;
    const isCell = target.closest("[data-slot-index]");
    const slotIdxAttr = isCell?.getAttribute("data-slot-index");

    if (isCell && typeof slotIdxAttr === "string") {
      const slotIdx = parseInt(slotIdxAttr);
      const poke = activeBox?.pokemons.find((p) => p.slotIndex === slotIdx);
      if (poke) return; // Has pokemon, standard drag instead of marquee select
    }

    if (!gridContainerRef.current) return;
    e.preventDefault();

    const rect = gridContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDragSelectStart({ x, y });
    setDragSelectCurrent({ x, y });
    setIsDragSelecting(true);
    didDragSelectRef.current = false;
  };

  // ── 6. Unified slot interaction ───────────────────────────
  const handleSlotMouseDown = (
    e: MouseEvent<HTMLElement>,
    slotIdx: number,
    isParty: boolean,
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
      if (isParty) {
        toast.error("Cannot move a group of Pokémon into the party.");
        setHeldGroup(null);
        setMultiSelectedIds(new Set());
      } else {
        handleDropGroup(slotIdx);
      }
    }
  };

  const handleSlotClick = (
    e: MouseEvent<HTMLElement>,
    slotIdx: number,
    isParty: boolean,
  ) => {
    if (didDragSelectRef.current) {
      didDragSelectRef.current = false;
      return;
    }
    // Ignore if this was a drag (isDraggingRef still set from mousemove)
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      return;
    }

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
          next.add(poke.id);
        }
        return next;
      });
      setLastClickedCtx({ slot: slotIdx, isParty });
    } else if (
      e.shiftKey &&
      lastClickedCtx &&
      lastClickedCtx.isParty === isParty
    ) {
      // Shift+Click: range select within same context
      if (!poke) return;
      const min = Math.min(slotIdx, lastClickedCtx.slot);
      const max = Math.max(slotIdx, lastClickedCtx.slot);
      const src = isParty ? partyPokemons : (activeBox?.pokemons ?? []);
      setMultiSelectedIds((prev) => {
        const next = new Set(prev);
        src
          .filter((p) => p.slotIndex >= min && p.slotIndex <= max)
          .forEach((p) => next.add(p.id));
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
  const handleDropHeldPokemon = async (
    targetSlot: number,
    toParty: boolean,
  ) => {
    if (!heldPokemon) return;
    const { pokemon, fromParty, fromSlot, fromBoxId } = heldPokemon;
    const targetBoxId = toParty ? null : (activeBox?.id ?? null);
    const targetPokemon = toParty
      ? partyPokemons.find((p) => p.slotIndex === targetSlot)
      : activeBox?.pokemons.find((p) => p.slotIndex === targetSlot);

    if (fromParty && !toParty && !targetPokemon && partyPokemons.length <= 1) {
      toast.error("Your party needs at least 1 Pokémon.");
      setHeldPokemon(null);
      return;
    }

    // Capture snapshots for rollback
    const prevBoxes = queryClient.getQueryData<UserBoxDto[]>(["boxes"]);
    const prevParty = [...partyPokemons];

    // Clear drag state immediately to make UI feel instant
    setHeldPokemon(null);
    setMultiSelectedIds(new Set());

    // Perform optimistic update
    const movedPoke = {
      ...pokemon,
      isInParty: toParty,
      slotIndex: targetSlot,
      boxId: targetBoxId,
    };
    const swappedPoke = targetPokemon
      ? {
          ...targetPokemon,
          isInParty: fromParty,
          slotIndex: fromSlot,
          boxId: fromBoxId,
        }
      : null;

    setPartyPokemons((prev) => {
      let next = prev.filter(
        (p) =>
          p.id !== movedPoke.id && (!swappedPoke || p.id !== swappedPoke.id),
      );
      if (toParty) next.push(movedPoke);
      if (fromParty && swappedPoke) next.push(swappedPoke);
      return next.sort((a, b) => a.slotIndex - b.slotIndex);
    });

    queryClient.setQueryData<UserBoxDto[]>(["boxes"], (old) => {
      if (!old) return old;
      return old.map((box) => {
        let pokes = box.pokemons.filter(
          (p) =>
            p.id !== movedPoke.id && (!swappedPoke || p.id !== swappedPoke.id),
        );
        if (!toParty && box.id === targetBoxId) pokes.push(movedPoke);
        if (!fromParty && box.id === fromBoxId && swappedPoke)
          pokes.push(swappedPoke);
        return {
          ...box,
          pokemons: pokes.sort((a, b) => a.slotIndex - b.slotIndex),
        };
      });
    });

    try {
      const result = await movePokemonMutation.mutateAsync({
        userPokemonId: pokemon.id,
        data: { targetBoxId, toParty, slotIndex: targetSlot },
      });
      if (!result.success) {
        toast.error(result.message);
        if (prevBoxes) queryClient.setQueryData(["boxes"], prevBoxes);
        setPartyPokemons(prevParty);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Move failed.");
      if (prevBoxes) queryClient.setQueryData(["boxes"], prevBoxes);
      setPartyPokemons(prevParty);
    }
  };

  const handleDropGroup = async (targetAnchorSlot: number) => {
    if (!heldGroup || !activeBox) return;
    const occupied = new Set<number>();
    activeBox.pokemons.forEach((p) => {
      if (!heldGroup.some((m) => m.pokemon.id === p.id))
        occupied.add(p.slotIndex);
    });
    const moves: MovePokemonItemDto[] = [];
    let invalid = false;
    for (let i = 0; i < heldGroup.length; i++) {
      const m = heldGroup[i];
      const tSlot = targetAnchorSlot + i;
      if (tSlot < 0 || tSlot >= 30) {
        toast.error("Placement out of bounds!");
        invalid = true;
        break;
      }
      if (occupied.has(tSlot)) {
        toast.error("Target slots must be empty for group move.");
        invalid = true;
        break;
      }
      moves.push({
        userPokemonId: m.pokemon.id,
        targetBoxId: activeBox.id,
        toParty: false,
        slotIndex: tSlot,
      });
    }
    if (invalid) {
      setHeldGroup(null);
      setMultiSelectedIds(new Set());
      return;
    }

    const prevBoxes = queryClient.getQueryData<UserBoxDto[]>(["boxes"]);
    setHeldGroup(null);
    setMultiSelectedIds(new Set());

    // Optimistic update for group move
    queryClient.setQueryData<UserBoxDto[]>(["boxes"], (old) => {
      if (!old) return old;
      return old.map((box) => {
        let pokes = box.pokemons.filter(
          (p) => !moves.some((mv) => mv.userPokemonId === p.id),
        );
        moves.forEach((mv) => {
          if (box.id === mv.targetBoxId) {
            const member = heldGroup.find(
              (g) => g.pokemon.id === mv.userPokemonId,
            );
            if (member) {
              pokes.push({
                ...member.pokemon,
                isInParty: false,
                boxId: mv.targetBoxId,
                slotIndex: mv.slotIndex,
              });
            }
          }
        });
        return {
          ...box,
          pokemons: pokes.sort((a, b) => a.slotIndex - b.slotIndex),
        };
      });
    });

    try {
      await moveBatchMutation.mutateAsync({ moves });
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Move failed.");
      if (prevBoxes) queryClient.setQueryData(["boxes"], prevBoxes);
    }
  };

  // ── 8. Wallpaper ──────────────────────────────────────────
  const handleSelectWallpaper = async (bg: string) => {
    if (!activeBox) return;
    try {
      await updateBoxMutation.mutateAsync({
        boxId: activeBox.id,
        data: { name: activeBox.name, backgroundImage: bg },
      });
    } catch {
      toast.error("Failed to apply wallpaper.");
    }
  };

  const uploadAndApplyWallpaper = async (file: File) => {
    if (!activeBox) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5 MB.");
      return;
    }
    try {
      toast.loading("Applying wallpaper…", { id: "wp" });
      const { url, error } = await uploadFile(
        file,
        "Kiremon",
        "box-wallpapers",
      );
      if (error || !url) throw error ?? new Error();
      await updateBoxMutation.mutateAsync({
        boxId: activeBox.id,
        data: { name: activeBox.name, backgroundImage: url },
      });
      toast.dismiss("wp");
      toast.success("Wallpaper applied!");
    } catch {
      toast.dismiss("wp");
      toast.error("Failed to apply wallpaper.");
    }
  };

  const handleWallpaperUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) await uploadAndApplyWallpaper(file);
  };

  const handleWpDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading) setIsWpDragging(true);
  };
  const handleWpDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === wpDropZoneRef.current) setIsWpDragging(false);
  };
  const handleWpDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleWpDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWpDragging(false);
    if (!uploading) {
      const f = e.dataTransfer.files?.[0];
      if (f) await uploadAndApplyWallpaper(f);
    }
  };

  useEffect(() => {
    const onPaste = async (e: ClipboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || uploading) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.includes("image")) {
          const f = items[i].getAsFile();
          if (f) {
            e.preventDefault();
            await uploadAndApplyWallpaper(f);
            break;
          }
        }
      }
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [activeBox, uploading]);

  const handleStartBoxRename = () => {
    if (!activeBox) return;
    setEditingBoxName(activeBox.name);
    setIsEditingBoxName(true);
    setTimeout(() => {
      const inputEl = document.querySelector(".box-rename-input");
      if (inputEl) {
        gsap.fromTo(
          inputEl,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.15, ease: "back.out(1.5)" },
        );
      }
    }, 0);
  };

  const handleSaveBoxRename = async () => {
    setIsEditingBoxName(false);
    if (!activeBox) return;
    const trimmed = editingBoxName.trim();
    if (!trimmed || trimmed === activeBox.name) return;
    try {
      await updateBoxMutation.mutateAsync({
        boxId: activeBox.id,
        data: { name: trimmed, backgroundImage: activeBox.backgroundImage },
      });
      toast.success("Box renamed!");
    } catch {
      toast.error("Rename failed.");
    }
  };

  const handleBoxRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveBoxRename();
    } else if (e.key === "Escape") {
      setIsEditingBoxName(false);
    }
  };

  const handleBoxDragStart = (e: React.DragEvent, boxId: number) =>
    e.dataTransfer.setData("boxId", boxId.toString());
  const handleBoxDrop = async (e: React.DragEvent, targetBoxId: number) => {
    const src = parseInt(e.dataTransfer.getData("boxId"));
    if (isNaN(src) || src === targetBoxId) return;
    try {
      await reorderBoxesMutation.mutateAsync({
        boxIdA: src,
        boxIdB: targetBoxId,
      });
    } catch {
      toast.error("Reorder failed.");
    }
  };

  // ── 10. Context menu ──────────────────────────────────────
  const handleRightClickSlot = (e: MouseEvent, pokemon: UserPokemonDto) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, pokemon });
  };
  const handleToggleFavorite = async (p: UserPokemonDto) => {
    setContextMenu(null);
    try {
      await collectionService.toggleFavorite(p.id);
      loadParty();
    } catch {
      toast.error("Action failed.");
    }
  };
  const handleReleasePokemon = async (p: UserPokemonDto) => {
    setContextMenu(null);
    if (p.isInParty && partyPokemons.length <= 1) {
      toast.error("Party needs at least 1 Pokémon.");
      return;
    }
    if (!window.confirm(`Release ${p.displayName}?`)) return;
    try {
      await collectionService.releasePokemon(p.id);
      toast.success(`${p.displayName} was released.`);
      if (selectedPokemon?.id === p.id) setSelectedPokemon(null);
      if (hoveredPokemon?.id === p.id) setHoveredPokemon(null);
      loadParty();
    } catch {
      toast.error("Release failed.");
    }
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
      !!p.type1?.toLowerCase().includes(q) ||
      !!p.type2?.toLowerCase().includes(q)
    );
  };

  // ── Sync Selected Pokémon Details ──
  const activePokemonDetails = useMemo(() => {
    const displayedPokemon = hoveredPokemon || selectedPokemon;
    if (!displayedPokemon) return null;
    const inParty = partyPokemons.find((p) => p.id === displayedPokemon.id);
    if (inParty) return inParty;
    for (const box of boxes) {
      const inBox = box.pokemons.find((p: any) => p.id === displayedPokemon.id);
      if (inBox) return inBox;
    }
    return displayedPokemon;
  }, [hoveredPokemon?.id, selectedPokemon?.id, boxes, partyPokemons]);

  // ── usePokemonCore for Moves & Abilities details ──
  const { detail, isLoading: isCoreLoading } = usePokemonCore(
    activePokemonDetails?.name || "",
    undefined,
    {
      enabled:
        !!activePokemonDetails &&
        (activeMainTab === "moves" || showMoveManager),
    },
  );

  // ── Moves Lookup ──
  const allLearnedMoves = useMemo(() => {
    if (!detail?.moveDetails || !activePokemonDetails) return [];

    // Filter level-up moves learned up to current level
    const filtered = detail.moveDetails.filter(
      (m) =>
        m.learnMethod === "level-up" &&
        m.level !== null &&
        m.level <= activePokemonDetails.currentLevel,
    );

    // Group by move ID or name and keep the one with the lowest level (earliest learned)
    const uniqueMovesMap = new Map<number | string, (typeof filtered)[0]>();
    for (const move of filtered) {
      const key = move.id || move.name;
      const existing = uniqueMovesMap.get(key);
      if (
        !existing ||
        (move.level !== null &&
          existing.level !== null &&
          move.level < existing.level)
      ) {
        uniqueMovesMap.set(key, move);
      }
    }

    // Convert back to array and sort by level ascending
    return Array.from(uniqueMovesMap.values()).sort((a, b) => {
      const lvlA = a.level ?? 0;
      const lvlB = b.level ?? 0;
      if (lvlA !== lvlB) return lvlA - lvlB;
      return a.name.localeCompare(b.name);
    });
  }, [detail?.moveDetails, activePokemonDetails?.currentLevel]);

  const currentMoves = useMemo(() => {
    if (!activePokemonDetails || !detail?.moveDetails) return [];
    if (
      activePokemonDetails.customMoveIds &&
      activePokemonDetails.customMoveIds.length > 0
    ) {
      return activePokemonDetails.customMoveIds
        .map((id) => detail.moveDetails.find((m) => m.id === id))
        .filter(Boolean) as any[];
    }
    // Fallback to top 4 level-up moves
    const sorted = [...allLearnedMoves].sort(
      (a, b) => (b.level || 0) - (a.level || 0),
    );
    return sorted.slice(0, 4);
  }, [activePokemonDetails, detail?.moveDetails, allLearnedMoves]);

  const getAbilityDesc = (abilityName: string) => {
    if (!detail?.abilities) return null;
    const found = detail.abilities.find(
      (a: any) => a.ability.name.toLowerCase() === abilityName.toLowerCase(),
    );
    return found?.description || "No description available.";
  };

  // ── Radar Chart Calculations ──────────────────────────────
  const natureKey =
    activePokemonDetails?.natureDisplay?.toLowerCase().split(" ")[0] || "";
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
          points={`${x},${y - 4} ${x - 4},${y + 2} ${x + 4},${y + 2}`}
          fill="#dc2626"
          stroke="#ffffff"
          strokeWidth="0.5"
        />
      );
    } else if (isDecreased) {
      return (
        <polygon
          points={`${x},${y + 2} ${x - 4},${y - 4} ${x + 4},${y - 4}`}
          fill="#2563eb"
          stroke="#ffffff"
          strokeWidth="0.5"
        />
      );
    }
    return null;
  };

  const getMaxStatAtCurrentLevel = (
    base: number,
    level: number,
    isHp: boolean,
  ) => {
    if (isHp) {
      return (
        Math.floor(((2 * base + 31 + Math.floor(252 / 4)) * level) / 100) +
        level +
        10
      );
    }
    return Math.floor(
      (Math.floor(((2 * base + 31 + Math.floor(252 / 4)) * level) / 100) + 5) *
        1.1,
    );
  };

  const getStatRadius = (iv: number | null) => {
    const val = iv ?? 15; // default to Decent if null
    return 10 + (val / 31) * 45; // maps 0..31 to 10..55 range
  };

  const getEvRadius = (ev: number | null) => {
    const val = ev ?? 0;
    return 10 + (val / 252) * 45; // maps 0..252 to 10..55 range
  };

  const radii = activePokemonDetails
    ? activeStatTab === "iv"
      ? [
          getStatRadius(activePokemonDetails.ivHp),
          getStatRadius(activePokemonDetails.ivAttack),
          getStatRadius(activePokemonDetails.ivDefense),
          getStatRadius(activePokemonDetails.ivSpeed),
          getStatRadius(activePokemonDetails.ivSpecialDefense),
          getStatRadius(activePokemonDetails.ivSpecialAttack),
        ]
      : [
          getEvRadius(activePokemonDetails.evHp),
          getEvRadius(activePokemonDetails.evAttack),
          getEvRadius(activePokemonDetails.evDefense),
          getEvRadius(activePokemonDetails.evSpeed),
          getEvRadius(activePokemonDetails.evSpecialDefense),
          getEvRadius(activePokemonDetails.evSpecialAttack),
        ]
    : [];

  const cx = 140;
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

  const statItems = activePokemonDetails
    ? activeStatTab === "iv"
      ? [
          {
            label: "HP",
            displayName: "HP",
            judge: `${getIvJudgeText(activePokemonDetails.ivHp)} (${activePokemonDetails.ivHp ?? 0})`,
          },
          {
            label: "ATK",
            displayName: "Attack",
            judge: `${getIvJudgeText(activePokemonDetails.ivAttack)} (${activePokemonDetails.ivAttack ?? 0})`,
          },
          {
            label: "DEF",
            displayName: "Defense",
            judge: `${getIvJudgeText(activePokemonDetails.ivDefense)} (${activePokemonDetails.ivDefense ?? 0})`,
          },
          {
            label: "SPD",
            displayName: "Speed",
            judge: `${getIvJudgeText(activePokemonDetails.ivSpeed)} (${activePokemonDetails.ivSpeed ?? 0})`,
          },
          {
            label: "SpD",
            displayName: "Sp. Def",
            judge: `${getIvJudgeText(activePokemonDetails.ivSpecialDefense)} (${activePokemonDetails.ivSpecialDefense ?? 0})`,
          },
          {
            label: "SpA",
            displayName: "Sp. Atk",
            judge: `${getIvJudgeText(activePokemonDetails.ivSpecialAttack)} (${activePokemonDetails.ivSpecialAttack ?? 0})`,
          },
        ]
      : [
          {
            label: "HP",
            displayName: "HP",
            judge: `EV: ${activePokemonDetails.evHp}`,
          },
          {
            label: "ATK",
            displayName: "Attack",
            judge: `EV: ${activePokemonDetails.evAttack}`,
          },
          {
            label: "DEF",
            displayName: "Defense",
            judge: `EV: ${activePokemonDetails.evDefense}`,
          },
          {
            label: "SPD",
            displayName: "Speed",
            judge: `EV: ${activePokemonDetails.evSpeed}`,
          },
          {
            label: "SpD",
            displayName: "Sp. Def",
            judge: `EV: ${activePokemonDetails.evSpecialDefense}`,
          },
          {
            label: "SpA",
            displayName: "Sp. Atk",
            judge: `EV: ${activePokemonDetails.evSpecialAttack}`,
          },
        ]
    : [];

  const handleOpenMoveManager = () => {
    if (!activePokemonDetails) return;
    const currentMoveIds = currentMoves
      .map((m) => m.id)
      .filter(Boolean) as number[];
    setTempSelectedMoves(currentMoveIds);
    setShowMoveManager(true);
  };

  const handleToggleMove = (moveId: number) => {
    setTempSelectedMoves((prev) => {
      if (prev.includes(moveId)) {
        return prev.filter((id) => id !== moveId);
      } else {
        if (prev.length >= 4) {
          toast.error("You can select up to 4 moves!");
          return prev;
        }
        return [...prev, moveId];
      }
    });
  };

  const handleSaveMoves = async () => {
    if (!activePokemonDetails) return;
    if (tempSelectedMoves.length === 0 || tempSelectedMoves.length > 4) return;
    try {
      await updateMovesMutation.mutateAsync({
        userPokemonId: activePokemonDetails.id,
        moveIds: tempSelectedMoves,
      });
      toast.success("Moveset updated successfully!");
      setShowMoveManager(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update moveset.");
    }
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <>
      <Navbar />
      <S.Page>
        <StorageHeader
          actions={
            <>
              <S.KeyboardInfoBtn onClick={() => setShowHelp(true)} title="Help">
                <IconHelp size={18} />
                <span className="btn-text">Help</span>
              </S.KeyboardInfoBtn>
              <S.KeyboardInfoBtn
                onClick={() => setShowBoxList(true)}
                title="Boxes (B)"
              >
                <IconLayout size={18} />
                <span className="btn-text">Boxes (B)</span>
              </S.KeyboardInfoBtn>
            </>
          }
        />

        <S.Workspace>
          {/* ── LEFT: Party ── */}
          <S.SidebarCard className="pxl-border no-inset">
            <Text
              as="h2"
              variant="darker"
              size="lg"
              style={{ marginBottom: "16px" }}
            >
              Party
            </Text>
            <S.PartySlotsContainer>
              {Array.from({ length: 6 }).map((_, idx) => {
                const poke = partyPokemons.find((p) => p.slotIndex === idx);
                const isSel =
                  !!poke &&
                  !!(
                    (hoveredPokemon && poke.id === hoveredPokemon.id) ||
                    (!hoveredPokemon &&
                      selectedPokemon &&
                      poke.id === selectedPokemon.id)
                  );
                const isMultiSel = poke ? multiSelectedIds.has(poke.id) : false;
                return (
                  <S.PartySlot
                    key={`party-${idx}`}
                    isEmpty={!poke}
                    isDraggingOver={
                      (heldPokemon !== null || heldGroup !== null) && !poke
                    }
                    isSelected={isSel}
                    isMultiSelected={isMultiSel}
                    onMouseDown={(e) => handleSlotMouseDown(e, idx, true)}
                    onMouseUp={() => handleSlotMouseUp(idx, true)}
                    onClick={(e) => handleSlotClick(e, idx, true)}
                    onContextMenu={(e) => poke && handleRightClickSlot(e, poke)}
                    onMouseEnter={() => {
                      if (poke && !heldPokemon && !heldGroup) {
                        setHoveredPokemon(poke);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!heldPokemon && !heldGroup) {
                        setHoveredPokemon(null);
                      }
                    }}
                  >
                    <span className="index-tag">{idx + 1}</span>
                    {poke ? (
                      <>
                        <img
                          className="sprite"
                          src={poke.spriteUrl}
                          alt={poke.displayName}
                        />
                        <div className="details">
                          <span className="name">{poke.displayName}</span>
                          <span className="lvl">Lv. {poke.currentLevel}</span>
                        </div>
                        {poke.isShiny && (
                          <span
                            className="shiny-sparkle"
                            style={{ color: "#fbbf24", fontSize: 12 }}
                          >
                            ★
                          </span>
                        )}
                      </>
                    ) : (
                      <span
                        style={{
                          fontSize: "0.95rem",
                          color: "#64748b",
                          margin: "auto",
                        }}
                      >
                        —
                      </span>
                    )}
                  </S.PartySlot>
                );
              })}
            </S.PartySlotsContainer>
          </S.SidebarCard>

          {/* ── CENTER: Box Grid ── */}
          <S.BoxWrapper className="pxl-border no-inset">
            <S.BoxControls>
              {/* Navigation elements grouped in center */}
              <div className="navigation-group">
                <button
                  className="nav-arrow-btn"
                  onClick={handlePrevBox}
                  title="Previous Box"
                >
                  <svg viewBox="0 0 24 24" width="28" height="28">
                    <polygon
                      points="16,4 6,12 16,20"
                      fill="#cbd5e1"
                      stroke="#0f172a"
                      strokeWidth="2.5"
                      strokeLinejoin="miter"
                    />
                  </svg>
                </button>

                <div
                  className="name-plate"
                  onClick={!isEditingBoxName ? handleStartBoxRename : undefined}
                  title={!isEditingBoxName ? "Rename Box" : undefined}
                >
                  {isEditingBoxName ? (
                    <S.BoxRenameInput
                      className="box-rename-input"
                      type="text"
                      value={editingBoxName}
                      onChange={(e) => setEditingBoxName(e.target.value)}
                      onBlur={handleSaveBoxRename}
                      onKeyDown={handleBoxRenameKeyDown}
                      autoFocus
                      maxLength={15}
                    />
                  ) : (
                    <h3>{activeBox?.name ?? `Box ${currentBoxIndex + 1}`}</h3>
                  )}
                </div>

                <button
                  className="nav-arrow-btn"
                  onClick={handleNextBox}
                  title="Next Box"
                >
                  <svg viewBox="0 0 24 24" width="28" height="28">
                    <polygon
                      points="8,4 18,12 8,20"
                      fill="#cbd5e1"
                      stroke="#0f172a"
                      strokeWidth="2.5"
                      strokeLinejoin="miter"
                    />
                  </svg>
                </button>
              </div>

              {/* Box count badge */}
              <div className="box-count-badge">
                {activeBox?.pokemons.length ?? 0} / 30
              </div>
            </S.BoxControls>

            <S.BoxGridContainer
              ref={gridContainerRef}
              bgUrl={activeBox ? getBoxBgUrl(activeBox.backgroundImage) : ""}
              onMouseDown={handleGridMouseDown}
            >
              {isDragSelecting && dragSelectStart && dragSelectCurrent && (
                <S.SelectionRectangle
                  startX={Math.min(dragSelectStart.x, dragSelectCurrent.x)}
                  startY={Math.min(dragSelectStart.y, dragSelectCurrent.y)}
                  width={Math.abs(dragSelectStart.x - dragSelectCurrent.x)}
                  height={Math.abs(dragSelectStart.y - dragSelectCurrent.y)}
                />
              )}
              {Array.from({ length: 30 }).map((_, slotIdx) => {
                const poke = activeBox?.pokemons.find(
                  (p) => p.slotIndex === slotIdx,
                );
                const isSel =
                  !!poke &&
                  !!(
                    (hoveredPokemon && poke.id === hoveredPokemon.id) ||
                    (!hoveredPokemon &&
                      selectedPokemon &&
                      poke.id === selectedPokemon.id)
                  );
                const isMultiSel = poke ? multiSelectedIds.has(poke.id) : false;
                const isDimmed = !!(
                  searchQuery &&
                  poke &&
                  !matchesSearch(poke)
                );
                const compareIdx = poke
                  ? [...multiSelectedIds].indexOf(poke.id)
                  : -1;
                return (
                  <S.BoxSlotCell
                    key={`box-slot-${slotIdx}`}
                    isEmpty={!poke}
                    isDraggingOver={
                      (heldPokemon !== null || heldGroup !== null) && !poke
                    }
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
                    onMouseEnter={() => {
                      if (poke && !heldPokemon && !heldGroup) {
                        setHoveredPokemon(poke);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!heldPokemon && !heldGroup) {
                        setHoveredPokemon(null);
                      }
                    }}
                  >
                    {poke && (
                      <>
                        <img
                          className="sprite"
                          src={poke.spriteUrl}
                          alt={poke.displayName}
                        />
                        {isMultiSel && (
                          <span className="compare-badge">
                            ♦{compareIdx + 1}
                          </span>
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

          <S.RightPanelCard className="pxl-border no-inset">
            <div className="detail-column">
              {/* Search */}
              <S.SearchBoxWrapper>
                <IconSearch
                  size={18}
                  style={{ color: "#64748b", flexShrink: 0 }}
                />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Name, type, or #ID  (F)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    onClick={() => setSearchQuery("")}
                  >
                    <IconX size={14} />
                  </button>
                )}
              </S.SearchBoxWrapper>

              {/* Pokemon Detail Panel */}
              {activePokemonDetails ? (
                <S.DetailPanel>
                  <S.DetailTopBar>
                    <div className="left-section">
                      <img
                        src={getPokeballSpriteUrl(
                          activePokemonDetails.caughtBall,
                        )}
                        alt="Pokeball"
                        className="pokeball-icon"
                      />
                      <span className="name">
                        {activePokemonDetails.displayName}
                      </span>
                    </div>
                    <div className="right-section">
                      <span className="lvl-pill">
                        Lv.{activePokemonDetails.currentLevel}
                      </span>
                      <span
                        className={`gender-badge ${activePokemonDetails.gender === 0 ? "male" : activePokemonDetails.gender === 1 ? "female" : "genderless"}`}
                      >
                        {activePokemonDetails.gender === 0
                          ? "♂"
                          : activePokemonDetails.gender === 1
                            ? "♀"
                            : "⚲"}
                      </span>
                    </div>
                  </S.DetailTopBar>

                  <S.DetailSubBar>
                    <span className="dex-no">
                      No.{" "}
                      {String(activePokemonDetails.pokemonApiId).padStart(
                        3,
                        "0",
                      )}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      {activePokemonDetails.isShiny && (
                        <span className="shiny-star">★ Shiny</span>
                      )}
                      <button
                        onClick={() => setCardsModalOpen(true)}
                        title="View TCG Cards"
                        style={{
                          background: "#ffffff",
                          border: "2px solid #0f172a",
                          borderRadius: "2px",
                          padding: "2px 8px",
                          color: "#0f172a",
                          fontSize: "9px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontFamily: '"Press Start 2P", monospace',
                          boxShadow: "2px 2px 0px #0f172a",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#facc15";
                          e.currentTarget.style.transform =
                            "translateY(-1px) translateX(-1px)";
                          e.currentTarget.style.boxShadow =
                            "3px 3px 0px #0f172a";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#ffffff";
                          e.currentTarget.style.transform =
                            "translateY(0) translateX(0)";
                          e.currentTarget.style.boxShadow =
                            "2px 2px 0px #0f172a";
                        }}
                      >
                        <img
                          src="/static/tcgcard_back.png"
                          alt="TCG"
                          style={{
                            width: 14,
                            height: 20,
                            objectFit: "contain",
                          }}
                        />
                        TCG
                      </button>
                    </div>
                  </S.DetailSubBar>

                  <S.DetailTypeRow>
                    {[activePokemonDetails.type1, activePokemonDetails.type2]
                      .filter(Boolean)
                      .map((t) => (
                        <span
                          key={t}
                          className="type-badge"
                          style={{
                            background: TYPE_COLORS[t!.toLowerCase()] ?? "#888",
                          }}
                        >
                          {t!.toUpperCase()}
                        </span>
                      ))}
                  </S.DetailTypeRow>

                  <S.DetailArtworkArea>
                    <img
                      src={
                        activePokemonDetails.officialArtworkUrl ??
                        activePokemonDetails.spriteUrl
                      }
                      alt={activePokemonDetails.displayName}
                      className="artwork"
                    />
                  </S.DetailArtworkArea>

                  {/* Main 3-Tab Headers */}
                  <S.DetailMainTabContainer>
                    <S.DetailMainTabButton
                      active={activeMainTab === "status"}
                      onClick={() => setActiveMainTab("status")}
                    >
                      Status
                    </S.DetailMainTabButton>
                    <S.DetailMainTabButton
                      active={activeMainTab === "moves"}
                      onClick={() => setActiveMainTab("moves")}
                    >
                      Moves
                    </S.DetailMainTabButton>
                    <S.DetailMainTabButton
                      active={activeMainTab === "stats"}
                      onClick={() => setActiveMainTab("stats")}
                    >
                      Stats
                    </S.DetailMainTabButton>
                  </S.DetailMainTabContainer>

                  {/* Tab 1: Status */}
                  {activeMainTab === "status" && (
                    <S.StatusTabContainer>
                      <S.HpBarWrapper>
                        {(() => {
                          const hpPercent = Math.min(
                            100,
                            Math.max(0, activePokemonDetails.currentHp),
                          );
                          const currentHpPoints = Math.round(
                            (hpPercent / 100) * activePokemonDetails.maxHp,
                          );
                          let hpColor = "#10b981"; // green >50%
                          if (hpPercent <= 20)
                            hpColor = "#ef4444"; // red <=20%
                          else if (hpPercent <= 50) hpColor = "#f59e0b"; // yellow <=50%
                          return (
                            <>
                              <S.HpBarInner
                                percent={hpPercent}
                                colorCode={hpColor}
                              />
                              <S.HpBarText>
                                {currentHpPoints} / {activePokemonDetails.maxHp}{" "}
                                HP
                              </S.HpBarText>
                            </>
                          );
                        })()}
                      </S.HpBarWrapper>

                      <S.InfoGrid>
                        <S.InfoItemBox>
                          <span className="label">Nature</span>
                          <span className="value">
                            {activePokemonDetails.natureDisplay.split(" ")[0]}
                          </span>
                        </S.InfoItemBox>
                        <S.InfoItemBox>
                          <span className="label">Gender</span>
                          <span className="value">
                            {activePokemonDetails.gender === 0
                              ? "Male (♂)"
                              : activePokemonDetails.gender === 1
                                ? "Female (♀)"
                                : "Unknown (⚲)"}
                          </span>
                        </S.InfoItemBox>
                      </S.InfoGrid>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          width: "100%",
                        }}
                      >
                        {activePokemonDetails.ability ? (
                          (() => {
                            const desc = getAbilityDesc(
                              activePokemonDetails.ability,
                            );
                            return (
                              <S.AbilityPill key={activePokemonDetails.ability}>
                                <span className="label">Ability</span>
                                <span className="value">
                                  {activePokemonDetails.ability.replace(
                                    "-",
                                    " ",
                                  )}
                                </span>
                                {desc && (
                                  <span className="tooltip">{desc}</span>
                                )}
                              </S.AbilityPill>
                            );
                          })()
                        ) : (
                          <S.InfoItemBox>
                            <span className="label">Ability</span>
                            <span className="value">None</span>
                          </S.InfoItemBox>
                        )}

                        {activePokemonDetails.heldItemName ? (
                          <S.HeldItemPill hasItem={true}>
                            {activePokemonDetails.heldItemSpriteUrl ? (
                              <img
                                className="icon"
                                src={activePokemonDetails.heldItemSpriteUrl}
                                alt={activePokemonDetails.heldItemName}
                              />
                            ) : (
                              <div
                                className="icon"
                                style={{
                                  width: 24,
                                  height: 24,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                🎒
                              </div>
                            )}
                            <div className="info">
                              <span className="label">Held Item</span>
                              <span className="value">
                                {activePokemonDetails.heldItemName}
                              </span>
                            </div>
                          </S.HeldItemPill>
                        ) : (
                          <S.HeldItemPill hasItem={false}>
                            <div
                              className="icon"
                              style={{
                                width: 24,
                                height: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "14px",
                              }}
                            >
                              —
                            </div>
                            <div className="info">
                              <span className="label">Held Item</span>
                              <span className="value">No Item</span>
                            </div>
                          </S.HeldItemPill>
                        )}
                      </div>
                    </S.StatusTabContainer>
                  )}

                  {/* Tab 2: Moves */}
                  {activeMainTab === "moves" && (
                    <S.MovesTabContainer>
                      {isCoreLoading ? (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "24px",
                            fontFamily: '"Press Start 2P", monospace',
                            fontSize: "0.7rem",
                            color: "#64748b",
                          }}
                        >
                          Loading moves...
                        </div>
                      ) : (
                        <>
                          <S.MovesGrid>
                            {currentMoves.map((move, idx) => {
                              const typeColor =
                                TYPE_COLORS[
                                  move.type?.toLowerCase() || "normal"
                                ] || "#888";
                              return (
                                <S.MoveItemCard
                                  key={`${move.name}-${idx}`}
                                  typeColor={typeColor}
                                >
                                  <div className="move-header">
                                    <span className="move-name">
                                      {move.localizedName || move.name}
                                    </span>
                                    <span className="pp-val">
                                      PP {move.pp || "—"}/{move.pp || "—"}
                                    </span>
                                  </div>
                                  <S.MoveMetaRow>
                                    <span
                                      className="type-badge"
                                      style={{ backgroundColor: typeColor }}
                                    >
                                      {move.type}
                                    </span>
                                    <span
                                      className={`class-badge ${move.damageClass}`}
                                    >
                                      {move.damageClass}
                                    </span>
                                    <span className="power-acc">
                                      Power: {move.power || "—"} Acc:{" "}
                                      {move.accuracy || "—"}%
                                    </span>
                                  </S.MoveMetaRow>
                                </S.MoveItemCard>
                              );
                            })}
                            {currentMoves.length === 0 && (
                              <span
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#64748b",
                                  textAlign: "center",
                                  padding: "12px",
                                }}
                              >
                                No moves learned yet.
                              </span>
                            )}
                          </S.MovesGrid>
                          <S.ManageMovesBtn
                            className="pxl-border"
                            onClick={handleOpenMoveManager}
                          >
                            Manage Moves
                          </S.ManageMovesBtn>
                        </>
                      )}
                    </S.MovesTabContainer>
                  )}

                  {/* Tab 3: Stats */}
                  {activeMainTab === "stats" && (
                    <S.StatsTabContainer>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {(() => {
                          const currentHpPoints = Math.round(
                            (Math.min(
                              100,
                              Math.max(0, activePokemonDetails.currentHp),
                            ) /
                              100) *
                              activePokemonDetails.maxHp,
                          );
                          return [
                            {
                              label: "HP",
                              key: "HP",
                              val: currentHpPoints,
                              maxDisplay: activePokemonDetails.maxHp,
                              base: activePokemonDetails.baseHp,
                              isHp: true,
                            },
                            {
                              label: "Attack",
                              key: "ATK",
                              val: activePokemonDetails.calculatedAttack,
                              base: activePokemonDetails.baseAttack,
                              isHp: false,
                            },
                            {
                              label: "Defense",
                              key: "DEF",
                              val: activePokemonDetails.calculatedDefense,
                              base: activePokemonDetails.baseDefense,
                              isHp: false,
                            },
                            {
                              label: "Sp. Atk",
                              key: "SpA",
                              val: activePokemonDetails.calculatedSpecialAttack,
                              base: activePokemonDetails.baseSpecialAttack,
                              isHp: false,
                            },
                            {
                              label: "Sp. Def",
                              key: "SpD",
                              val: activePokemonDetails.calculatedSpecialDefense,
                              base: activePokemonDetails.baseSpecialDefense,
                              isHp: false,
                            },
                            {
                              label: "Speed",
                              key: "SPD",
                              val: activePokemonDetails.calculatedSpeed,
                              base: activePokemonDetails.baseSpeed,
                              isHp: false,
                            },
                          ].map((s) => {
                            const maxVal = getMaxStatAtCurrentLevel(
                              s.base,
                              activePokemonDetails.currentLevel,
                              s.isHp,
                            );
                            const percent = Math.min(
                              100,
                              Math.max(0, (s.val / maxVal) * 100),
                            );
                            const textColor = getStatColor(s.key);
                            return (
                              <S.StatBarRow key={s.label}>
                                <S.StatLabelRow textColor={textColor}>
                                  <span className="stat-name">{s.label}</span>
                                  <span className="stat-values">
                                    <span className="curr">{s.val}</span>
                                    <span className="max">
                                      /{s.isHp ? s.maxDisplay : maxVal}
                                    </span>
                                  </span>
                                </S.StatLabelRow>
                                <S.StatBarWrapper>
                                  <S.StatBarInner
                                    percent={percent}
                                    color={textColor}
                                  />
                                </S.StatBarWrapper>
                              </S.StatBarRow>
                            );
                          });
                        })()}
                      </div>

                      <S.RadarToggleBtn
                        className="pxl-border"
                        onClick={() => setShowRadarChart(!showRadarChart)}
                      >
                        {showRadarChart
                          ? "Hide Radar Chart"
                          : "Show Radar (IV/EV)"}
                      </S.RadarToggleBtn>

                      {showRadarChart && (
                        <>
                          <S.DetailTabContainer
                            style={{ margin: "8px 0 0", width: "100%" }}
                          >
                            <S.DetailTabButton
                              active={activeStatTab === "iv"}
                              onClick={() => setActiveStatTab("iv")}
                            >
                              IVs
                            </S.DetailTabButton>
                            <S.DetailTabButton
                              active={activeStatTab === "ev"}
                              onClick={() => setActiveStatTab("ev")}
                            >
                              EVs
                            </S.DetailTabButton>
                          </S.DetailTabContainer>

                          <S.DetailStatsArea style={{ padding: "8px 0 0" }}>
                            <div className="radar-chart-container">
                              <svg
                                width="280"
                                height="220"
                                viewBox="0 0 280 220"
                              >
                                <polygon
                                  points={getGridHexagon(60)}
                                  stroke="rgba(15, 23, 42, 0.12)"
                                  fill="none"
                                  strokeWidth="1"
                                />
                                <polygon
                                  points={getGridHexagon(40)}
                                  stroke="rgba(15, 23, 42, 0.08)"
                                  fill="none"
                                  strokeWidth="1"
                                />
                                <polygon
                                  points={getGridHexagon(20)}
                                  stroke="rgba(15, 23, 42, 0.05)"
                                  fill="none"
                                  strokeWidth="1"
                                />

                                {[0, 1, 2, 3, 4, 5].map((i) => {
                                  const angle =
                                    -Math.PI / 2 + (i * Math.PI) / 3;
                                  return (
                                    <line
                                      key={`line-${i}`}
                                      x1={cx}
                                      y1={cy}
                                      x2={cx + 60 * Math.cos(angle)}
                                      y2={cy + 60 * Math.sin(angle)}
                                      stroke="rgba(15, 23, 42, 0.1)"
                                      strokeWidth="1"
                                      strokeDasharray="2,2"
                                    />
                                  );
                                })}

                                <polygon
                                  points={polyPoints}
                                  fill="rgba(59, 130, 246, 0.22)"
                                  stroke="#3b82f6"
                                  strokeWidth="2.5"
                                />

                                {radii.map((r, i) => {
                                  const angle =
                                    -Math.PI / 2 + (i * Math.PI) / 3;
                                  const x = cx + r * Math.cos(angle);
                                  const y = cy + r * Math.sin(angle);
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

                                {statItems.map((item, idx) => {
                                  const angle =
                                    -Math.PI / 2 + (idx * Math.PI) / 3;
                                  const color = getStatColor(item.label);

                                  let lx = cx;
                                  let ly = cy;
                                  let textAnchor:
                                    | "inherit"
                                    | "end"
                                    | "start"
                                    | "middle" = "middle";
                                  let offsetLy1 = 0;
                                  let offsetLy2 = 0;

                                  if (idx === 0) {
                                    lx = cx;
                                    ly = cy - 65;
                                    textAnchor = "middle";
                                    offsetLy1 = -6;
                                    offsetLy2 = 6;
                                  } else if (idx === 1) {
                                    lx = cx + 65 * 0.866;
                                    ly = cy - 65 * 0.5;
                                    textAnchor = "start";
                                    lx += 6;
                                    offsetLy1 = -4;
                                    offsetLy2 = 8;
                                  } else if (idx === 2) {
                                    lx = cx + 65 * 0.866;
                                    ly = cy + 65 * 0.5;
                                    textAnchor = "start";
                                    lx += 6;
                                    offsetLy1 = -4;
                                    offsetLy2 = 8;
                                  } else if (idx === 3) {
                                    lx = cx;
                                    ly = cy + 65;
                                    textAnchor = "middle";
                                    offsetLy1 = 4;
                                    offsetLy2 = 16;
                                  } else if (idx === 4) {
                                    lx = cx - 65 * 0.866;
                                    ly = cy + 65 * 0.5;
                                    textAnchor = "end";
                                    lx -= 6;
                                    offsetLy1 = -4;
                                    offsetLy2 = 8;
                                  } else if (idx === 5) {
                                    lx = cx - 65 * 0.866;
                                    ly = cy - 65 * 0.5;
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
                                      {getStatArrow(
                                        item.label,
                                        arrowX,
                                        ly + offsetLy1 - 3,
                                      )}
                                    </g>
                                  );
                                })}
                              </svg>
                            </div>
                          </S.DetailStatsArea>

                          {activeStatTab === "iv" &&
                          activePokemonDetails.ivRating ? (
                            <S.DetailIvJudgmentBar
                              style={{ margin: "8px 0 0", width: "100%" }}
                            >
                              <span className="rating-text">
                                {activePokemonDetails.ivRating}
                              </span>
                            </S.DetailIvJudgmentBar>
                          ) : activeStatTab === "ev" ? (
                            <S.DetailIvJudgmentBar
                              style={{ margin: "8px 0 0", width: "100%" }}
                            >
                              <span className="rating-text">
                                Total EVs: {activePokemonDetails.evTotal}/510
                              </span>
                            </S.DetailIvJudgmentBar>
                          ) : null}
                        </>
                      )}
                    </S.StatsTabContainer>
                  )}

                  {/* Markings */}
                  <S.DetailMarkingsBar>
                    {[
                      "circle",
                      "triangle",
                      "square",
                      "heart",
                      "star",
                      "diamond",
                    ].map((shape) => {
                      const isActive = activePokemonDetails.markings
                        ?.split(",")
                        .includes(shape);
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
            </div>

            <div className="wallpaper-column">
              {/* Wallpaper selector */}
              <S.WallpaperSelectorWrapper>
                <Text
                  as="h3"
                  variant="darker"
                  size="md"
                  style={{ marginBottom: "8px" }}
                >
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
                  style={{
                    opacity: uploading ? 0.5 : 1,
                    cursor: uploading ? "not-allowed" : "pointer",
                  }}
                >
                  <IconPhoto size={20} />
                  <span>
                    {uploading
                      ? `${uploadProgress}% uploading…`
                      : "Upload · Drag & Drop · Ctrl+V"}
                  </span>
                </S.UploadWallpaperZone>
              </S.WallpaperSelectorWrapper>
            </div>
          </S.RightPanelCard>
        </S.Workspace>
      </S.Page>

      <MyPokemonCardsView
        isOpen={cardsModalOpen}
        onClose={() => setCardsModalOpen(false)}
        pokemonApiId={activePokemonDetails?.pokemonApiId}
        pokemonName={activePokemonDetails?.displayName}
      />

      {/* ── Floating held pokemon ── */}
      {heldPokemon && (
        <S.FloatingHeldPokemon x={mousePos.x} y={mousePos.y}>
          <img
            src={heldPokemon.pokemon.spriteUrl}
            alt={heldPokemon.pokemon.displayName}
          />
        </S.FloatingHeldPokemon>
      )}

      {/* ── Floating group ── */}
      {heldGroup && (
        <S.FloatingGroupPreview x={mousePos.x} y={mousePos.y}>
          {heldGroup.map((m) => (
            <img
              key={m.pokemon.id}
              src={m.pokemon.spriteUrl}
              alt={m.pokemon.displayName}
            />
          ))}
        </S.FloatingGroupPreview>
      )}

      {/* ── Context Menu ── */}
      {contextMenu && (
        <S.ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          className="pxl-border no-inset"
        >
          <S.ContextMenuItem
            onClick={() => handleToggleFavorite(contextMenu.pokemon)}
          >
            <IconStar size={16} />
            {contextMenu.pokemon.isFavorite
              ? "Remove Favorite"
              : "Add to Favorites"}
          </S.ContextMenuItem>
          <div
            style={{
              borderBottom: "1px solid rgba(15,23,42,0.08)",
              margin: "4px 0",
            }}
          />
          <div
            style={{
              padding: "4px 8px",
              fontSize: "0.85rem",
              color: "#64748b",
              fontWeight: "bold",
            }}
          >
            Markings
          </div>
          <div style={{ display: "flex", gap: "2px", padding: "0 6px 4px" }}>
            {(["circle", "triangle", "square", "heart", "star"] as const).map(
              (m, i) => (
                <button
                  key={m}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#334155",
                    padding: "2px",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                  }}
                  onClick={() => handleToggleMarking(contextMenu.pokemon, m)}
                >
                  {["●", "▲", "■", "♥", "★"][i]}
                </button>
              ),
            )}
          </div>
          <div
            style={{
              borderBottom: "1px solid rgba(15,23,42,0.08)",
              margin: "4px 0",
            }}
          />
          <S.ContextMenuItem
            className="danger"
            onClick={() => handleReleasePokemon(contextMenu.pokemon)}
          >
            <IconTrash size={16} /> Release
          </S.ContextMenuItem>
        </S.ContextMenu>
      )}

      {/* ── Compare Modal ── */}
      {isComparing && compareFromMulti.length === 2 && (
        <S.CompareOverlay onClick={() => setIsComparing(false)}>
          <S.CompareContainer
            className="pxl-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="compare-header">
              <Text as="h2" variant="outlined" size="lg">
                Compare Stats
              </Text>
              <S.CloseBtn
                className="pxl-border"
                onClick={() => setIsComparing(false)}
              >
                Close
              </S.CloseBtn>
            </div>
            <div className="compare-grids">
              {compareFromMulti.map((p, idx) => {
                const other = compareFromMulti[(idx + 1) % 2];
                return (
                  <S.CompareCard key={p.id} className="pxl-border no-inset">
                    <img
                      className="sprite"
                      src={p.spriteUrl}
                      alt={p.displayName}
                    />
                    <Text
                      as="h3"
                      variant="outlined"
                      size="lg"
                      style={{ marginTop: "12px" }}
                    >
                      {p.displayName}
                    </Text>
                    <div className="details">
                      {[
                        { label: "Level", val: p.currentLevel },
                        { label: "Nature", val: p.natureDisplay },
                        { label: "Gender", val: p.genderDisplay },
                        { label: "Win Rate", val: `${p.winRate}%` },
                      ].map(({ label, val }) => (
                        <div className="detail-row" key={label}>
                          <span className="label">{label}</span>
                          <span className="val">{val}</span>
                        </div>
                      ))}
                      <div
                        style={{
                          marginTop: "12px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {[
                          {
                            name: "HP",
                            a: p.calculatedHp,
                            b: other.calculatedHp,
                          },
                          {
                            name: "Attack",
                            a: p.calculatedAttack,
                            b: other.calculatedAttack,
                          },
                          {
                            name: "Defense",
                            a: p.calculatedDefense,
                            b: other.calculatedDefense,
                          },
                          {
                            name: "Sp. Atk",
                            a: p.calculatedSpecialAttack,
                            b: other.calculatedSpecialAttack,
                          },
                          {
                            name: "Sp. Def",
                            a: p.calculatedSpecialDefense,
                            b: other.calculatedSpecialDefense,
                          },
                          {
                            name: "Speed",
                            a: p.calculatedSpeed,
                            b: other.calculatedSpeed,
                          },
                        ].map(({ name, a, b }) => (
                          <S.StatCompareRow key={name}>
                            <div className="stat-label">
                              <span>{name}</span>
                              <span>{a}</span>
                            </div>
                            <div className="bar-container">
                              <S.StatCompareBar
                                percent={(a / 250) * 100}
                                isWinner={a > b}
                              />
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
          <S.BoxListModalContainer
            className="pxl-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>PC Box List</h3>
              <div className="header-meta">
                <S.ModalCloseButton onClick={() => setShowBoxList(false)}>
                  <IconX size={20} />
                </S.ModalCloseButton>
              </div>
            </div>
            <S.BoxFilterTabsContainer>
              <S.FilterTabButton
                isActive={boxFilter === "all"}
                onClick={() => setBoxFilter("all")}
              >
                All ({filterCounts.all})
              </S.FilterTabButton>
              <S.FilterTabButton
                isActive={boxFilter === "has_pokemon"}
                onClick={() => setBoxFilter("has_pokemon")}
              >
                Occupied ({filterCounts.occupied})
              </S.FilterTabButton>
              <S.FilterTabButton
                isActive={boxFilter === "empty"}
                onClick={() => setBoxFilter("empty")}
              >
                Empty ({filterCounts.empty})
              </S.FilterTabButton>
            </S.BoxFilterTabsContainer>
            <div className="grid-container">
              {filteredBoxes.map(({ box, originalIndex }) => (
                <S.BoxThumbnailItem
                  key={box.id}
                  isActive={originalIndex === currentBoxIndex}
                  bgUrl={getBoxBgUrl(box.backgroundImage)}
                  pokemonCount={box.pokemons.length}
                  draggable
                  onDragStart={(e) => handleBoxDragStart(e, box.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleBoxDrop(e, box.id)}
                  onClick={() => handleSelectBoxFromModal(originalIndex)}
                >
                  <div className="box-details">
                    <span className="box-name">
                      {originalIndex === currentBoxIndex && "▶ "}
                      {box.name}
                    </span>
                    <span className="box-count">{box.pokemons.length}/30</span>
                  </div>
                </S.BoxThumbnailItem>
              ))}
            </div>
          </S.BoxListModalContainer>
        </S.BoxListModalOverlay>
      )}

      {/* ── Help Modal ── */}
      {showHelp && (
        <S.HelpOverlay onClick={() => setShowHelp(false)}>
          <S.HelpContainer
            className="pxl-border"
            onClick={(e) => e.stopPropagation()}
          >
            <Text
              as="h3"
              variant="outlined"
              size="lg"
              style={{ marginBottom: "16px", paddingBottom: "8px" }}
            >
              Controls
            </Text>
            <div className="shortcuts-grid">
              {[
                { desc: "Select Pokémon · show details", key: "Click" },
                {
                  desc: "Multi-select (group move / compare)",
                  key: "Ctrl+Click",
                },
                { desc: "Range select", key: "Shift+Click" },
                { desc: "Move / swap Pokémon", key: "Hold & Drag" },
                { desc: "Drop to party slot 1–6", key: "1 – 6" },
                { desc: "Navigate Boxes", key: "← / → / A / D" },
                { desc: "Open Box List", key: "B" },
                { desc: "Compare (2 selected)", key: "C" },
                { desc: "Focus Search", key: "F / S" },
                { desc: "Cancel / Close", key: "ESC" },
              ].map(({ desc, key }) => (
                <div className="shortcut-row" key={key}>
                  <span className="desc">{desc}</span>
                  <span className="key">{key}</span>
                </div>
              ))}
            </div>
            <S.HelpCloseButton
              className="pxl-border"
              onClick={() => setShowHelp(false)}
            >
              Got it
            </S.HelpCloseButton>
          </S.HelpContainer>
        </S.HelpOverlay>
      )}

      {/* ── Manage Moves Modal ── */}
      {showMoveManager && activePokemonDetails && (
        <S.MoveManagerModalOverlay onClick={() => setShowMoveManager(false)}>
          <S.MoveManagerContainer
            className="pxl-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Manage Moves</h3>
              <button
                className="close-btn"
                onClick={() => setShowMoveManager(false)}
              >
                <IconX size={20} />
              </button>
            </div>

            <S.MoveManagerSplitLayout>
              {/* Left Column: Active Moves (the 4 selected moves) */}
              <S.ActiveMovesColumn>
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontFamily: '"Press Start 2P", monospace',
                    color: "#475569",
                    marginBottom: "8px",
                  }}
                >
                  Active Moves ({tempSelectedMoves.length}/4)
                </div>
                {Array.from({ length: 4 }).map((_, idx) => {
                  const moveId = tempSelectedMoves[idx];
                  if (moveId) {
                    const move =
                      detail?.moveDetails?.find((m) => m.id === moveId) ||
                      allLearnedMoves.find((m) => m.id === moveId);
                    if (move) {
                      const typeColor =
                        TYPE_COLORS[move.type?.toLowerCase() || "normal"] ||
                        "#888";
                      return (
                        <S.ActiveMoveSlot
                          key={`active-slot-${moveId}`}
                          isEmpty={false}
                          typeColor={typeColor}
                          onClick={() => handleToggleMove(moveId)}
                        >
                          <div className="active-move-header">
                            <span className="move-name">
                              {move.localizedName || move.name}
                            </span>
                            <span className="pp-val">
                              PP {move.pp || "—"}/{move.pp || "—"}
                            </span>
                          </div>
                          <div className="active-move-meta">
                            <span
                              className="type-badge"
                              style={{ backgroundColor: typeColor }}
                            >
                              {move.type}
                            </span>
                            {move.damageClass && (
                              <span
                                className={`class-badge ${move.damageClass.toLowerCase()}`}
                              >
                                {move.damageClass}
                              </span>
                            )}
                            <span className="power-acc">
                              Pwr: {move.power || "—"} Acc:{" "}
                              {move.accuracy || "—"}%
                            </span>
                          </div>
                          <span className="remove-indicator">✕</span>
                        </S.ActiveMoveSlot>
                      );
                    }
                  }
                  return (
                    <S.ActiveMoveSlot
                      key={`active-slot-empty-${idx}`}
                      isEmpty={true}
                    >
                      — Empty Slot —
                    </S.ActiveMoveSlot>
                  );
                })}
              </S.ActiveMovesColumn>

              {/* Right Column: Available Moves */}
              <S.AvailableMovesColumn>
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontFamily: '"Press Start 2P", monospace',
                    color: "#475569",
                    marginBottom: "8px",
                  }}
                >
                  Available Level-up Moves
                </div>
                {tempSelectedMoves.length === 0 && (
                  <div
                    className="validation-warning"
                    style={{ marginBottom: "8px" }}
                  >
                    Warning: You must select at least 1 move.
                  </div>
                )}
                {tempSelectedMoves.length > 4 && (
                  <div
                    className="validation-warning"
                    style={{ marginBottom: "8px" }}
                  >
                    Warning: Maximum 4 moves allowed.
                  </div>
                )}

                <S.MovesListContainer>
                  {allLearnedMoves.map((move) => {
                    const moveId = move.id;
                    if (!moveId) return null;
                    const isChecked = tempSelectedMoves.includes(moveId);
                    const isDisable =
                      !isChecked && tempSelectedMoves.length >= 4;
                    const typeColor =
                      TYPE_COLORS[move.type?.toLowerCase() || "normal"] ||
                      "#888";
                    return (
                      <S.MoveRowItem
                        key={moveId}
                        checked={isChecked}
                        disabled={isDisable}
                        onClick={() => handleToggleMove(moveId)}
                      >
                        <S.PixelCheckbox checked={isChecked} />
                        <span className="lvl-badge">Lvl {move.level}</span>
                        <span className="move-name">
                          {move.localizedName || move.name}
                        </span>
                        <div className="move-stats">
                          <span
                            className="type-badge"
                            style={{ backgroundColor: typeColor }}
                          >
                            {move.type}
                          </span>
                          <span className="stat">Pwr: {move.power || "—"}</span>
                          <span className="stat">
                            Acc: {move.accuracy || "—"}%
                          </span>
                        </div>
                      </S.MoveRowItem>
                    );
                  })}
                  {allLearnedMoves.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#64748b",
                        padding: "24px",
                      }}
                    >
                      Loading level-up moves from database/PokeAPI...
                    </div>
                  )}
                </S.MovesListContainer>
              </S.AvailableMovesColumn>
            </S.MoveManagerSplitLayout>

            <div className="actions-row">
              <Button variant="sky" onClick={() => setShowMoveManager(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={
                  tempSelectedMoves.length === 0 ||
                  tempSelectedMoves.length > 4 ||
                  updateMovesMutation.isPending
                }
                onClick={handleSaveMoves}
              >
                {updateMovesMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </S.MoveManagerContainer>
        </S.MoveManagerModalOverlay>
      )}
    </>
  );
};

export default PCStorage;
