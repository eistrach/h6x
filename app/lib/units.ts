export const UNITS = [
  {
    id: "default",
    name: "Neutral",
    attack: 4,
    defense: 4,
    plunder: 0,
    income: 2,
    limit: 10,

    cost: 10,
  },

  {
    id: "snowballer",
    name: "Snowballer",
    attack: 5,
    defense: 0,
    plunder: 0,
    income: 0,
    limit: 15,

    cost: 10,
  },

  {
    id: "attacker",
    name: "Attacker",
    attack: 10,
    defense: 2,
    plunder: 0,
    income: 3,
    limit: 5,

    cost: 15,
  },

  {
    id: "defender",
    name: "Defender",
    attack: 2,
    defense: 10,
    plunder: 0,
    income: 2,
    limit: 6,

    cost: 15,
  },

  {
    id: "farmer",
    name: "Farmer",
    attack: 0,
    defense: 3,
    plunder: 0,
    income: 14,
    limit: 3,

    cost: 25,
  },
] as const;

export type Unit = typeof UNITS[number];
export type UnitId = Unit["id"];

export const getUnitForId = (id: UnitId): Unit => {
  return UNITS.find((unit) => unit.id === id)!;
};
