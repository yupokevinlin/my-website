import React, { useEffect, useState } from "react";

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  classes?: {
    container?: string;
    paper?: string;
  };
  slots?: Record<string, unknown>;
  children?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, classes, children }) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 225);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[1300]"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        transition: "background-color 225ms cubic-bezier(0.4,0,0.2,1)",
      }}
      onClick={onClose}
    >
      <div
        className={`flex w-full h-full ${classes?.container ?? ""}`}
        onClick={onClose}
      >
        <div
          className={classes?.paper ?? ""}
          style={{
            transform: visible ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 225ms cubic-bezier(0,0,0.2,1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;

