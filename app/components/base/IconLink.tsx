import { Link, RemixLinkProps } from "@remix-run/react/components";
import { HTMLMotionProps, motion } from "framer-motion";

import { buttonHoverMotion } from "./Button";

export type LinkProps = React.LinkHTMLAttributes<HTMLLinkElement> &
  RemixLinkProps &
  HTMLMotionProps<"div"> & {
    Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  };
export const IconLink = ({ Icon, className, ...rest }: LinkProps) => {
  return (
    <Link className={className} {...rest}>
      <motion.div {...buttonHoverMotion} {...rest}>
        <Icon />
      </motion.div>
    </Link>
  );
};
