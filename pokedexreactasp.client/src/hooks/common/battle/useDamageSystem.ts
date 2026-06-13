import { useCallback, useEffect, useRef, useState } from "react";
import { randomNumber } from "@/utils/typeEffectiveness";

export interface IDamage {
  id: number;
  value: number;
  target: "player" | "enemy";
  isCritical: boolean;
  effectiveness: number;
}

export const useDamageSystem = () => {
  const [damages, setDamages] = useState<Array<IDamage>>([]);
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const showDamage = useCallback(
    (
      target: "player" | "enemy",
      value: number,
      isCritical: boolean,
      effectiveness: number = 1,
    ) => {
      const id = randomNumber();
      setDamages((prev) => [
        ...prev,
        { id, value, target, isCritical, effectiveness },
      ]);

      const timeoutId = setTimeout(() => {
        setDamages((prev) => prev.filter((d) => d.id !== id));
        timeoutsRef.current.delete(timeoutId);
      }, 1000);

      timeoutsRef.current.add(timeoutId);
    },
    [],
  );

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutsRef.current.clear();
    };
  }, []);

  return { damages, showDamage };
};
