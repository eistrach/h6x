import clsx from "clsx";
import { HTMLMotionProps, motion } from "framer-motion";
import { InputTheme } from "./InputTheme";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  HTMLMotionProps<"button"> & {
    LeftIcon?: (props: React.ComponentProps<"svg">) => JSX.Element;
    RightIcon?: (props: React.ComponentProps<"svg">) => JSX.Element;
    theme?: InputTheme;
    iconClasses?: string;
  };

export const buttonHoverMotion = {
  whileHover: { scale: 1.1, transition: { duration: 0.15 } },
  whileTap: { scale: 0.9 },
};

export const Button = ({
  children,
  LeftIcon,
  RightIcon,
  className,
  iconClasses = "h-5 w-5",
  theme = InputTheme.Primary,
  ...rest
}: ButtonProps) => {
  const mp = rest.disabled ? {} : buttonHoverMotion;
  return (
    <motion.button
      {...mp}
      className={clsx(
        "disabled:cursor-not-allowed  disabled:opacity-40 inline-flex rounded-sm items-center border border-transparent  text-sm font-semibold   focus:outline-none focus:ring-2 focus:ring-offset-2",
        theme,
        className
      )}
      {...rest}
    >
      {LeftIcon && (
        <LeftIcon
          className={clsx(
            {
              "-ml-1 mr-2": children || RightIcon,
              "-ml-2 -mr-2": !(children || RightIcon),
            },
            iconClasses
          )}
          aria-hidden="true"
        />
      )}
      {children}
      {RightIcon && (
        <RightIcon
          className={clsx(
            {
              "-mr-1 ml-2": children,
              "-ml-2 -mr-2": !(children || LeftIcon),
              "-mr-1": !children && LeftIcon,
            },
            iconClasses
          )}
          aria-hidden="true"
        />
      )}
    </motion.button>
  );
};
