import clsx from "clsx";
import { HTMLMotionProps, motion } from "framer-motion";
import { InputTheme } from "./InputTheme";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  HTMLMotionProps<"button"> & {
    LeftIcon?: (props: React.ComponentProps<"svg">) => JSX.Element;
    RightIcon?: (props: React.ComponentProps<"svg">) => JSX.Element;
    theme?: InputTheme;
  };

export const Button = ({
  children,
  LeftIcon,
  RightIcon,
  className,
  theme = InputTheme.Primary,
  ...rest
}: ButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.9 }}
      className={clsx(
        "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-semibold   focus:outline-none focus:ring-2 focus:ring-offset-2",
        theme
      )}
      {...rest}
    >
      {LeftIcon && (
        <LeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      )}
      {children}
      {RightIcon && (
        <RightIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      )}
    </motion.button>
  );
};
