import { keyframes } from "@emotion/react";

// ============ FLOATING ANIMATION ============
export const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

export const floatSmall = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

// ============ PULSE ANIMATIONS ============
export const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
`;

export const pulseRing = keyframes`
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(0.95); opacity: 0.7; }
`;

// ============ FADE ANIMATIONS ============
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// ============ SLIDE ANIMATIONS ============
export const slideInRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

export const slideInLeft = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

export const slideInUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

// ============ BOUNCE ANIMATIONS ============
export const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-15px); }
  60% { transform: translateY(-7px); }
`;

export const bounceSmall = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// ============ SPIN ANIMATIONS ============
export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const spinSlow = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ============ SHAKE ANIMATION ============
export const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

// ============ SCALE ANIMATIONS ============
export const scaleIn = keyframes`
  from { transform: scale(0); }
  to { transform: scale(1); }
`;

export const scaleUp = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.05); }
`;

// ============ GLOW ANIMATION ============
export const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
  }
`;

// ============ SHIMMER (for loading states) ============
export const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// ============ POKEBALL SPECIFIC ============
export const pokeballWiggle = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
  75% { transform: rotate(-10deg); }
`;

export const pokemonAppear = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(20px);
  }
  60% {
    opacity: 1;
    transform: scale(1.1) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;
