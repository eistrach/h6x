import clsx from "clsx";
import { HTMLMotionProps, motion } from "framer-motion";
import { Link as RemixLink } from "@remix-run/react";
import { RemixLinkProps } from "@remix-run/react/components";
import { InputTheme } from "./InputTheme";

export type LinkProps = React.LinkHTMLAttributes<HTMLLinkElement> &
  RemixLinkProps & {
    LeftIcon?: (props: React.ComponentProps<"svg">) => JSX.Element;
    RightIcon?: (props: React.ComponentProps<"svg">) => JSX.Element;
    theme?: InputTheme;
    motionProps: HTMLMotionProps<"div">;
  };

export const Link = ({
  children,
  LeftIcon,
  RightIcon,
  motionProps,
  theme = InputTheme.Primary,
  ...rest
}: LinkProps) => {
  return (
    <RemixLink {...rest}>
      <motion.div
        whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.9 }}
        initial={false}
        exit={{ opacity: 0 }}
        className={clsx(
          "inline-flex items-center text-sm font-semibold   focus:outline-none focus:ring-2 focus:ring-offset-2",
          theme
        )}
        {...motionProps}
      >
        {LeftIcon && (
          <LeftIcon
            className={clsx("h-5 w-5", {
              "-ml-1 mr-2": children || RightIcon,
              "-ml-2 -mr-2": !(children || RightIcon),
            })}
            aria-hidden="true"
          />
        )}
        {children}
        {RightIcon && (
          <RightIcon
            className={clsx("h-5 w-5", {
              "-mr-1 ml-2": children,
              "-ml-2 -mr-2": !(children || LeftIcon),
              "-mr-1": !children && LeftIcon,
            })}
            aria-hidden="true"
          />
        )}
      </motion.div>
    </RemixLink>
  );
};
