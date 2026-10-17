import { Customer, CustomerType } from '../types/game';

export const CUSTOMER_NAMES = [
  'Sofia',
  'Marco',
  'Nonna Maria',
  'Elena',
  'Luca',
  'Matteo',
  'Giulia',
  'Leonardo',
  'Chiara',
  'Lorenzo',
  'Francesca',
  'Davide',
  'Camilla',
  'Alessio',
  'Beatrice',
  'Antonio',
];

export const SKIN_TONES = ['#FFDFD3', '#F9C9B6', '#E0AC69', '#C68642', '#8D5524'];
export const HAIR_COLORS = ['#302B29', '#5B3924', '#B35422', '#D8B167', '#888888', '#202020'];
export const SHIRT_COLORS = ['#E85D4A', '#5E9B62', '#4A90E2', '#F4BF54', '#815C43', '#8B5CF6', '#EC4899'];
export const ACCESSORIES: ('glasses' | 'hat' | 'scarf' | 'chef_band' | 'none')[] = [
  'glasses',
  'hat',
  'scarf',
  'chef_band',
  'none',
];

export function createRandomCustomer(id: string, type: CustomerType): Customer {
  const nameIndex = Math.floor(Math.random() * CUSTOMER_NAMES.length);
  const name = CUSTOMER_NAMES[nameIndex];
  const skinTone = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)];
  const hairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)];
  const shirtColor = SHIRT_COLORS[Math.floor(Math.random() * SHIRT_COLORS.length)];
  const accessory = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)];

  let patienceMultiplier = 1.0;
  let tipMultiplier = 1.0;
  let reputationMultiplier = 1.0;

  switch (type) {
    case 'impatient':
      patienceMultiplier = 0.7;
      tipMultiplier = 1.35;
      reputationMultiplier = 1.1;
      break;
    case 'generous':
      patienceMultiplier = 1.2;
      tipMultiplier = 1.8;
      reputationMultiplier = 1.25;
      break;
    case 'vip':
      patienceMultiplier = 0.85;
      tipMultiplier = 2.4;
      reputationMultiplier = 2.0;
      break;
    case 'special_request':
      patienceMultiplier = 0.95;
      tipMultiplier = 1.5;
      reputationMultiplier = 1.3;
      break;
    default:
      patienceMultiplier = 1.0;
      tipMultiplier = 1.0;
      reputationMultiplier = 1.0;
      break;
  }

  return {
    id,
    name,
    type,
    avatarStyle: {
      skinTone,
      hairColor,
      accessory,
      expression: type === 'impatient' ? 'impatient' : type === 'vip' ? 'excited' : 'happy',
      shirtColor,
    },
    patienceMultiplier,
    tipMultiplier,
    reputationMultiplier,
  };
}
