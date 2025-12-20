export interface EvolutionIconFont {
  className: string;
  alt: string;
  color?: string;
}

export const getEvolutionIcon = (condition: string, value?: any): EvolutionIconFont | null => {
  switch (condition) {
    case 'timeOfDay':
      if (value === 'day') {
        return {
          className: 'ra ra-sun',
          alt: 'Day',
          color: '#FDB813' // Golden yellow for sun
        };
      } else if (value === 'night') {
        return {
          className: 'ra ra-moon-sun',
          alt: 'Night',
          color: '#A78BFA' // Purple for night
        };
      } else if (value === 'dusk') {
        return {
          className: 'ra ra-eclipse',
          alt: 'Dusk',
          color: '#F59E0B' // Orange for dusk
        };
      }
      break;

    case 'needsOverworldRain':
      return {
        className: 'ra ra-droplet',
        alt: 'Rain',
        color: '#3B82F6' // Blue for rain
      };

    case 'turnUpsideDown':
      return {
        className: 'ra ra-reverse',
        alt: 'Upside Down',
        color: '#8B5CF6'
      };

    case 'gender':
      if (value === 1) {
        return {
          className: 'ra ra-hearts',
          alt: 'Female',
          color: '#EC4899' // Pink for female
        };
      } else if (value === 2) {
        return {
          className: 'ra ra-muscle-up',
          alt: 'Male',
          color: '#3B82F6' // Blue for male
        };
      }
      break;

    case 'minHappiness':
      return {
        className: 'ra ra-heart',
        alt: 'Happiness',
        color: '#EF4444' // Red heart
      };

    case 'minBeauty':
      return {
        className: 'ra ra-flower',
        alt: 'Beauty',
        color: '#EC4899' // Pink for beauty
      };

    case 'minAffection':
      return {
        className: 'ra ra-double-team',
        alt: 'Affection',
        color: '#F59E0B' // Orange for affection
      };

    case 'location':
      return {
        className: 'ra ra-map-marker',
        alt: 'Location',
        color: '#10B981' // Green for location
      };

    case 'knownMove':
    case 'knownMoveType':
      return {
        className: 'ra ra-sword',
        alt: 'Move',
        color: '#6366F1' // Indigo for moves
      };

    case 'partySpecies':
    case 'partyType':
      return {
        className: 'ra ra-player',
        alt: 'Party',
        color: '#8B5CF6' // Purple for party
      };

    default:
      return null;
  }

  return null;
};


export const getEvolutionIcons = (trigger: any): EvolutionIconFont[] => {
  const icons: EvolutionIconFont[] = [];

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
