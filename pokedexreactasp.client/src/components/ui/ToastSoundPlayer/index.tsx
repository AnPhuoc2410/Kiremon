import { useEffect, useRef } from "react";
import { useToasterStore } from "react-hot-toast";

const ToastSoundPlayer = () => {
  const { toasts } = useToasterStore();
  const seenToastIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    toasts.forEach((t) => {
      if (!seenToastIds.current.has(t.id)) {
        seenToastIds.current.add(t.id);

        const audio = new Audio(
          "https://play.pokemonshowdown.com/audio/notification.wav",
        );
        audio.volume = 0.65; // Comfortable volume level
        audio.play().catch((err) => {
          console.warn("Autoplay blocked toast sound:", err);
        });
      }
    });

    // Clean up dismissed toasts from our seen set
    const activeIds = new Set(toasts.map((t) => t.id));
    seenToastIds.current.forEach((id) => {
      if (!activeIds.has(id)) {
        seenToastIds.current.delete(id);
      }
    });
  }, [toasts]);

  return null;
};

export default ToastSoundPlayer;
