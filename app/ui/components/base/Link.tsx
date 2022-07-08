import clsx from "clsx";
import { HTMLMotionProps, motion } from "framer-motion";
import { Link as RemixLink } from "@remix-run/react";
import { InputTheme } from "./InputTheme";
import { PropsWithChildren } from "react";

const MotionLink = motion(RemixLink);

export type LinkProps = {
  to: string;
  LeftIcon?: (props: React.ComponentProps<"svg">) => JSX.Element;
  RightIcon?: (props: React.ComponentProps<"svg">) => JSX.Element;
  theme?: InputTheme;
  className?: string;
  motionProps?: HTMLMotionProps<"a">;
};

export const Link = ({
  children,
  LeftIcon,
  RightIcon,
  motionProps,
  className,
  theme = InputTheme.Primary,
  ...rest
}: PropsWithChildren<LinkProps>) => {
  return (
    <MotionLink
      to={rest.to}
      whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.9 }}
      initial={false}
      exit={{ opacity: 0 }}
      className={clsx(
        "disabled:cursor-not-allowed inline-flex rounded-sm items-center text-sm font-semibold  focus:outline-none focus:ring-2 focus:ring-offset-2",
        theme,
        className
      )}
      {...(motionProps as any)}
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
    </MotionLink>
  );
};
