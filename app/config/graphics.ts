import AttackerSvg from "~/ui/components/svg/AttackerSvg";
import DefaultSvg from "~/ui/components/svg/DefaultSvg";
import DefenderSvg from "~/ui/components/svg/DefenderSvg";
import FarmerSvg from "~/ui/components/svg/FarmerSvg";

export const CellModeSprites = {
  average: DefaultSvg,
  offensive: AttackerSvg,
  defensive: DefenderSvg,
  productive: FarmerSvg,
};

export const PlayerColors = [
  {
    fill: "fill-red-400",
    selectedFill: "fill-red-400",
    stroke: "stroke-red-400",
    bg: "bg-red-400",
    ring: "ring-red-400",
    fillSecondary: "fill-red-200",
    strokeSecondary: "stroke-red-200",
  },
  {
    fill: "fill-yellow-400",
    selectedFill: "fill-yellow-400",
    stroke: "stroke-yellow-400",
    bg: "bg-yellow-400",
    ring: "ring-yellow-400",
    fillSecondary: "fill-yellow-200",
    strokeSecondary: "stroke-yellow-200",
  },
  {
    fill: "fill-emerald-400",
    selectedFill: "fill-emerald-400",
    stroke: "stroke-emerald-400",
    bg: "bg-emerald-400",
    ring: "ring-emerald-400",
    fillSecondary: "fill-emerald-200",
    strokeSecondary: "stroke-emerald-200",
  },
  {
    fill: "fill-sky-400",
    selectedFill: "fill-sky-400",
    stroke: "stroke-sky-400",
    bg: "bg-sky-400",
    ring: "ring-sky-400",
    fillSecondary: "fill-sky-200",
    strokeSecondary: "stroke-sky-200",
  },
  {
    fill: "fill-violet-400",
    selectedFill: "fill-violet-400",
    stroke: "stroke-violet-400",
    bg: "bg-violet-400",
    ring: "ring-violet-400",
    fillSecondary: "fill-violet-200",
    strokeSecondary: "stroke-violet-200",
  },
  {
    fill: "fill-pink-400",
    selectedFill: "fill-pink-400",
    stroke: "stroke-pink-400",
    bg: "bg-pink-400",
    ring: "ring-pink-400",
    fillSecondary: "fill-pink-200",
    strokeSecondary: "stroke-pink-200",
  },
];

export const NeutralColor = {
  fill: "fill-gray-200",
  selectedFill: "fill-gray-200",
  stroke: "stroke-gray-200",
  bg: "bg-gray-200",
  ring: "ring-gray-200",
  fillSecondary: "fill-gray-100",
  strokeSecondary: "stroke-gray-100",
};

export const ListItemAnimationProps = {
  layout: true,
  initial: { opacity: 0, scale: 0 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.1 },
  },
  exit: { opacity: 0, scale: 0 },
};
