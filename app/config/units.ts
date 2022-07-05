import AttackerSvg from "~/components/svg/AttackerSvg";
import DefaultSvg from "~/components/svg/DefaultSvg";
import DefenderSvg from "~/components/svg/DefenderSvg";
import FarmerSvg from "~/components/svg/FarmerSvg";
import SnowballerSvg from "~/components/svg/SnowballerSvg";

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

    SVG: DefaultSvg,
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
    SVG: SnowballerSvg,
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
    SVG: AttackerSvg,
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
    SVG: DefenderSvg,
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
    SVG: FarmerSvg,
  },
] as const;

export type Unit = typeof UNITS[number];
export type UnitId = Unit["id"];

export const getUnitForId = (id: UnitId): Unit => {
  return UNITS.find((unit) => unit.id === id)!;
};
