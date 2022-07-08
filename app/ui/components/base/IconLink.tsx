import { Link, RemixLinkProps } from "@remix-run/react/components";
import { HTMLMotionProps, motion } from "framer-motion";

import { buttonHoverMotion } from "./Button";
const MotionLink = motion(Link);

export type LinkProps = React.LinkHTMLAttributes<HTMLLinkElement> &
  RemixLinkProps &
  HTMLMotionProps<"a"> & {
    Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  };
export const IconLink = ({ Icon, className, ...rest }: LinkProps) => {
  return (
    <MotionLink className={className} {...buttonHoverMotion} {...rest}>
      <Icon />
    </MotionLink>
  );
};
