export const UNITS = [
  {
    id: "default",
    name: "Neutral",
    attack: 5,
    defense: 5,
    plunder: 0,
    income: 2,
    limit: 8,

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
    defense: 1,
    plunder: 0,
    income: 1,
    limit: 8,

    cost: 15,
  },

  {
    id: "defender",
    name: "Defender",
    attack: 1,
    defense: 10,
    plunder: 0,
    income: 1,
    limit: 8,

    cost: 15,
  },

  {
    id: "farmer",
    name: "Farmer",
    attack: 1,
    defense: 1,
    plunder: 0,
    income: 15,
    limit: 3,

    cost: 25,
  },
] as const;

export type Unit = typeof UNITS[number];
export type UnitId = Unit["id"];

export const getUnitForId = (id: UnitId): Unit => {
  return UNITS.find((unit) => unit.id === id)!;
};
