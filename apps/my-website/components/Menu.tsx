import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface MenuProps {
  id?: string;
  anchorEl?: Element | null;
  anchorOrigin?: { vertical: "top" | "center" | "bottom"; horizontal: "left" | "center" | "right" };
  transformOrigin?: { vertical: "top" | "center" | "bottom"; horizontal: "left" | "center" | "right" };
  keepMounted?: boolean;
  open: boolean;
  labelledBy?: string;
  onClick?: (e: React.MouseEvent) => void;
  onClose?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  children?: React.ReactNode;
}

const Menu: React.FC<MenuProps> = ({
  id,
  anchorEl,
  anchorOrigin = { vertical: "bottom", horizontal: "left" },
  transformOrigin = { vertical: "top", horizontal: "left" },
  open,
  labelledBy,
  onClick,
  onKeyDown,
  children,
}) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const anchorY =
        anchorOrigin.vertical === "top"    ? rect.top :
        anchorOrigin.vertical === "bottom" ? rect.bottom :
        rect.top + rect.height / 2;
      const anchorX =
        anchorOrigin.horizontal === "left"  ? rect.left :
        anchorOrigin.horizontal === "right" ? rect.right :
        rect.left + rect.width / 2;
      setPos({ top: anchorY, left: anchorX });
    }
  }, [open, anchorEl, anchorOrigin.vertical, anchorOrigin.horizontal]);

  if (!open || typeof window === "undefined") return null;

  const transformX =
    transformOrigin.horizontal === "left"  ? "0%"    :
    transformOrigin.horizontal === "right" ? "-100%" : "-50%";
  const transformY =
    transformOrigin.vertical === "top"    ? "0%"    :
    transformOrigin.vertical === "bottom" ? "-100%" : "-50%";

  return createPortal(
    <div className="fixed inset-0 z-[9999]" onClick={onClick}>
      <div
        id={id}
        role="menu"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="fixed outline-none"
        style={{
          top: pos.top,
          left: pos.left,
          transform: `translate(${transformX}, ${transformY})`,
          backgroundColor: "var(--bg-paper)",
          boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
          borderRadius: "4px",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Menu;
