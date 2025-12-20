// Helper functions for evolution condition icons
// Replace the placeholder paths with your actual pixel art PNG images

export interface EvolutionIcon {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * Get icon for evolution conditions
 * You can place your pixel art PNG images in public/static/evolution-icons/
 * or any other folder you prefer
 */
export const getEvolutionIcon = (condition: string, value?: any): EvolutionIcon | null => {
  const iconBase = '/static/evolution-icons';

  switch (condition) {
    case 'timeOfDay':
      if (value === 'day') {
        return {
          src: `${iconBase}/day.png`,
          alt: 'Day',
          width: 16,
          height: 16
        };
      } else if (value === 'night') {
        return {
          src: `${iconBase}/night.png`,
          alt: 'Night',
          width: 16,
          height: 16
        };
      } else if (value === 'dusk') {
        return {
          src: `${iconBase}/dusk.png`,
          alt: 'Dusk',
          width: 16,
          height: 16
        };
      }
      break;

    case 'needsOverworldRain':
      return {
        src: `${iconBase}/rain.png`,
        alt: 'Rain',
        width: 16,
        height: 16
      };

    case 'turnUpsideDown':
      return {
        src: `${iconBase}/upside-down.png`,
        alt: 'Upside Down',
        width: 16,
        height: 16
      };

    case 'gender':
      if (value === 1) {
        return {
          src: `${iconBase}/female.png`,
          alt: 'Female',
          width: 16,
          height: 16
        };
      } else if (value === 2) {
        return {
          src: `${iconBase}/male.png`,
          alt: 'Male',
          width: 16,
          height: 16
        };
      }
      break;

    case 'minHappiness':
      return {
        src: `${iconBase}/happiness.png`,
        alt: 'Happiness',
        width: 16,
        height: 16
      };

    case 'minBeauty':
      return {
        src: `${iconBase}/beauty.png`,
        alt: 'Beauty',
        width: 16,
        height: 16
      };

    case 'minAffection':
      return {
        src: `${iconBase}/affection.png`,
        alt: 'Affection',
        width: 16,
        height: 16
      };

    case 'location':
      return {
        src: `${iconBase}/location.png`,
        alt: 'Location',
        width: 16,
        height: 16
      };

    case 'knownMove':
    case 'knownMoveType':
      return {
        src: `${iconBase}/move.png`,
        alt: 'Move',
        width: 16,
        height: 16
      };

    case 'partySpecies':
    case 'partyType':
      return {
        src: `${iconBase}/party.png`,
        alt: 'Party',
        width: 16,
        height: 16
      };

    default:
      return null;
  }

  return null;
};

/**
 * Generate a list of all icons needed for a complete evolution trigger
 */
export const getEvolutionIcons = (trigger: any): EvolutionIcon[] => {
  const icons: EvolutionIcon[] = [];

  if (!trigger) return icons;

  if (trigger.timeOfDay) {
    const icon = getEvolutionIcon('timeOfDay', trigger.timeOfDay);
    if (icon) icons.push(icon);
  }

  if (trigger.needsOverworldRain) {
    const icon = getEvolutionIcon('needsOverworldRain');
    if (icon) icons.push(icon);
  }

  if (trigger.turnUpsideDown) {
    const icon = getEvolutionIcon('turnUpsideDown');
    if (icon) icons.push(icon);
  }

  if (trigger.gender !== null && trigger.gender !== undefined) {
    const icon = getEvolutionIcon('gender', trigger.gender);
    if (icon) icons.push(icon);
  }

  if (trigger.minHappiness) {
    const icon = getEvolutionIcon('minHappiness');
    if (icon) icons.push(icon);
  }

  if (trigger.minBeauty) {
    const icon = getEvolutionIcon('minBeauty');
    if (icon) icons.push(icon);
  }

  if (trigger.minAffection) {
    const icon = getEvolutionIcon('minAffection');
    if (icon) icons.push(icon);
  }

  if (trigger.location) {
    const icon = getEvolutionIcon('location');
    if (icon) icons.push(icon);
  }

  if (trigger.knownMove || trigger.knownMoveType) {
    const icon = getEvolutionIcon('knownMove');
    if (icon) icons.push(icon);
  }

  if (trigger.partySpecies || trigger.partyType) {
    const icon = getEvolutionIcon('partySpecies');
    if (icon) icons.push(icon);
  }

  return icons;
};
