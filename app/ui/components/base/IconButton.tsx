import { HTMLMotionProps, motion } from "framer-motion";
import { buttonHoverMotion } from "./Button";

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  HTMLMotionProps<"button"> & {
    Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
    iconCss?: string;
  };

export const IconButton = ({ Icon, iconCss, ...rest }: IconButtonProps) => {
  return (
    <motion.button {...buttonHoverMotion} {...rest}>
      <Icon className={iconCss} />
    </motion.button>
  );
};
