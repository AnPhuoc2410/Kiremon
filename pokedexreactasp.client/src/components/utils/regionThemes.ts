// Region-based color themes for backgrounds and UI elements
export interface RegionTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  gradient: string;
  overlay?: string;
}

// Color themes for each Pokémon region
export const regionThemes: Record<string, RegionTheme> = {
  kanto: {
    primary: '#dc143c', // Crimson red
    secondary: '#2e4053', // Dark blue
    accent: '#ffd700', // Gold
    background: '#f5f5f5',
    gradient: 'linear-gradient(135deg, #dc143c 0%, #f5f5f5 100%)',
    overlay: 'rgba(220, 20, 60, 0.1)'
  },
  johto: {
    primary: '#4169e1', // Royal blue
    secondary: '#a0522d', // Brown
    accent: '#c0c0c0', // Silver
    background: '#e8f4f8',
    gradient: 'linear-gradient(135deg, #4169e1 0%, #e8f4f8 100%)',
    overlay: 'rgba(65, 105, 225, 0.1)'
  },
  hoenn: {
    primary: '#228b22', // Forest green
    secondary: '#b22222', // Fire brick red
    accent: '#00bfff', // Deep sky blue
    background: '#e8f8e8',
    gradient: 'linear-gradient(135deg, #228b22 0%, #e8f8e8 100%)',
    overlay: 'rgba(34, 139, 34, 0.1)'
  },
  sinnoh: {
    primary: '#4b0082', // Indigo
    secondary: '#6a5acd', // Slate blue
    accent: '#ff8c00', // Dark orange
    background: '#f0e8f8',
    gradient: 'linear-gradient(135deg, #4b0082 0%, #f0e8f8 100%)',
    overlay: 'rgba(75, 0, 130, 0.1)'
  },
  unova: {
    primary: '#2f4f4f', // Dark slate gray
    secondary: '#000000', // Black
    accent: '#ffffff', // White
    background: '#f0f0f0',
    gradient: 'linear-gradient(135deg, #2f4f4f 0%, #f0f0f0 100%)',
    overlay: 'rgba(47, 79, 79, 0.1)'
  },
  kalos: {
    primary: '#1e90ff', // Dodger blue
    secondary: '#ff69b4', // Hot pink
    accent: '#ffd700', // Gold
    background: '#e8f0ff',
    gradient: 'linear-gradient(135deg, #1e90ff 0%, #e8f0ff 100%)',
    overlay: 'rgba(30, 144, 255, 0.1)'
  },
  alola: {
    primary: '#ff6347', // Tomato red
    secondary: '#40e0d0', // Turquoise
    accent: '#ffa500', // Orange
    background: '#fff5eb',
    gradient: 'linear-gradient(135deg, #ff6347 0%, #fff5eb 100%)',
    overlay: 'rgba(255, 99, 71, 0.1)'
  },
  galar: {
    primary: '#8b0000', // Dark red
    secondary: '#00008b', // Dark blue
    accent: '#ffd700', // Gold
    background: '#f8f0f0',
    gradient: 'linear-gradient(135deg, #8b0000 0%, #f8f0f0 100%)',
    overlay: 'rgba(139, 0, 0, 0.1)'
  },
  paldea: {
    primary: '#9932cc', // Dark orchid
    secondary: '#ff8c00', // Dark orange
    accent: '#32cd32', // Lime green
    background: '#f8f0ff',
    gradient: 'linear-gradient(135deg, #9932cc 0%, #f8f0ff 100%)',
    overlay: 'rgba(153, 50, 204, 0.1)'
  },
  hisui: {
    primary: '#556b2f', // Dark olive green
    secondary: '#8b4513', // Saddle brown
    accent: '#d2b48c', // Tan
    background: '#f0f2e6',
    gradient: 'linear-gradient(135deg, #556b2f 0%, #f0f2e6 100%)',
    overlay: 'rgba(85, 107, 47, 0.1)'
  },
  // Default theme (fallback)
  default: {
    primary: '#3a506b', // Slate blue
    secondary: '#5bc0be', // Teal
    accent: '#fca311', // Orange
    background: '#f0f5f9',
    gradient: 'linear-gradient(135deg, #3a506b 0%, #f0f5f9 100%)',
    overlay: 'rgba(58, 80, 107, 0.1)'
  }
};

/**
 * Get theme colors for a specific region
 * @param regionName Name of the region (case insensitive)
 * @returns Theme object with color values
 */
export const getRegionTheme = (regionName: string): RegionTheme => {
  const normalizedName = regionName?.toLowerCase() || 'default';
  return regionThemes[normalizedName] || regionThemes.default;
};