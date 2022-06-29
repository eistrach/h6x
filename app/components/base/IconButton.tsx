import { HTMLMotionProps, motion } from "framer-motion";
import { buttonHoverMotion } from "./Button";

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  HTMLMotionProps<"button"> & {
    Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  };

export const IconButton = ({ Icon, ...rest }: IconButtonProps) => {
  return (
    <motion.button {...buttonHoverMotion} {...rest}>
      <Icon />
    </motion.button>
  );
};
