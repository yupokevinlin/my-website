import React from "react";
import clsx from "clsx";

export interface ButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  style?: React.CSSProperties;
}

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ className, style, children, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      className={clsx("btn-base btn-solid", className)}
      style={{
        appearance: "none",
        WebkitAppearance: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        font: "inherit",
        textAlign: "left",
        background: "transparent",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
);

ButtonBase.displayName = "ButtonBase";

export default ButtonBase;
