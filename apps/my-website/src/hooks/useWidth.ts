import { useState, useEffect } from "react";
import { Breakpoint } from "@/components/types";

const getBreakpoint = (): Breakpoint => {
  if (typeof window === "undefined") return "xs";
  const w = window.innerWidth;
  if (w >= 1536) return "xl";
  if (w >= 1200) return "lg";
  if (w >= 900) return "md";
  if (w >= 600) return "sm";
  return "xs";
};

const useWidth = (): Breakpoint => {
  // Always start with "xs" to match SSR, then update after hydration
  const [width, setWidth] = useState<Breakpoint>("xs");

  useEffect(() => {
    setWidth(getBreakpoint());
    const handleResize = () => setWidth(getBreakpoint());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

export default useWidth;

