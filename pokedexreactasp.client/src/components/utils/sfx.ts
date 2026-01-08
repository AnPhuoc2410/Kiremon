// Simple SFX using WebAudio API to avoid asset files
let audioCtx: AudioContext | null = null;

function getCtx() {
  if (!audioCtx) {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new Ctor();
  }
  return audioCtx!;
}

function playTone(
  freq: number,
  durationMs = 120,
  type: OscillatorType = "sine",
  volume = 0.05,
) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    osc.start(now);
    osc.stop(now + durationMs / 1000);
  } catch {}
}

export const sfx = {
  click: () => playTone(600, 80, "square", 0.04),
  success: () => playTone(900, 140, "sine", 0.06),
  fail: () => playTone(200, 180, "sawtooth", 0.06),
  tick: () => playTone(800, 50, "square", 0.03),
};
