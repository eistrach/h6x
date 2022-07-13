import { MotionProps } from "framer-motion";
import { asMathCell, Point } from "~/core/math";

export const CellSelectionDelay = 300;
export const DefaultTransitionDelay = 50;

export type AnimationConfig = {
  onTransition: {
    duration: number;
    sourceCell?: (payload: any) => MotionProps;
    targetCell?: (payload: any) => MotionProps;
  };
  afterTransition?: {
    duration: number;
    sourceCell?: (payload: any) => MotionProps;
    targetCell?: (payload: any) => MotionProps;
  };
};

export const ActionAnimations: Record<string, AnimationConfig | undefined> = {
  attackCell: {
    onTransition: {
      duration: 250,
      sourceCell: ({ source, target }: { source: Point; target: Point }) => {
        const ps = asMathCell(source).toPoint();
        const pt = asMathCell(target).toPoint();
        return {
          animate: {
            x: [0, (pt.x - ps.x) * 0.7, 0],
            y: [0, (pt.y - ps.y) * 0.7, 0],

            scale: [1, 1.1, 1],
          },
          transition: {
            duration: 0.25,
            bounce: 1,
          },
        };
      },
    },
  },
};

export const getTransitionForAction = (action: string): AnimationConfig => {
  return (
    ActionAnimations[action] ?? {
      onTransition: { duration: DefaultTransitionDelay },
    }
  );
};
