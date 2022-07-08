import clsx from "clsx";

export const PopperPopover = ({
  setPopperElement,
  styles,
  attributes,
  setArrowElement,
  children,
  className,
  wrapperClassName,
  arrowClassName,
}: {
  setPopperElement: any;
  styles: any;
  attributes: any;
  setArrowElement: any;
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  arrowClassName?: string;
}) => {
  return (
    <>
      <div
        className={clsx(wrapperClassName, "tooltip")}
        ref={setPopperElement as any}
        style={styles.popper}
        {...attributes.popper}
      >
        <div className={className}>{children}</div>

        <div
          className={clsx("arrow", arrowClassName)}
          ref={setArrowElement as any}
          style={styles.arrow}
        />
      </div>
    </>
  );
};
