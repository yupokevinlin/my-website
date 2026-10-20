import { type PointerEvent as ReactPointerEvent, type ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";

const MIN_THUMB = 30;

// The site's own scroll bar, as on the original design: a 10 px rounded thumb
// that floats over the page below the top bar. globals.css hides the native
// one. Drag the thumb, or click the track to page up or down.
export const PageScrollbar = (): ReactNode => {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const doc = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!track || !thumb) return;
      const range = doc.scrollHeight - window.innerHeight;
      const height = Math.max(MIN_THUMB, track.clientHeight * (window.innerHeight / doc.scrollHeight));
      const top = range > 0 ? (window.scrollY / range) * (track.clientHeight - height) : 0;
      thumb.style.height = `${height}px`;
      thumb.style.transform = `translateY(${top}px)`;
      setScrollable(range > 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // "Show more" and the scroll-in animations change the page's height
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(schedule);
    observer?.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
    };
  }, []);

  const onThumbDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;
    e.preventDefault();
    e.stopPropagation();
    thumb.setPointerCapture(e.pointerId);
    const doc = document.documentElement;
    const startY = e.clientY;
    const startScroll = window.scrollY;
    const perPixel = (doc.scrollHeight - window.innerHeight) / Math.max(1, track.clientHeight - thumb.offsetHeight);
    const onMove = (move: PointerEvent) => window.scrollTo({ top: startScroll + (move.clientY - startY) * perPixel, behavior: "instant" as ScrollBehavior });
    const onUp = () => {
      thumb.removeEventListener("pointermove", onMove);
      thumb.removeEventListener("pointerup", onUp);
      thumb.removeEventListener("pointercancel", onUp);
    };
    thumb.addEventListener("pointermove", onMove);
    thumb.addEventListener("pointerup", onUp);
    thumb.addEventListener("pointercancel", onUp);
  };

  const onTrackDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const thumb = thumbRef.current?.getBoundingClientRect();
    if (!thumb) return;
    window.scrollBy({ top: (e.clientY < thumb.top ? -0.9 : 0.9) * window.innerHeight });
  };

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      onPointerDown={onTrackDown}
      className={clsx("fixed bottom-[2px] right-[2px] top-[66px] z-50 w-[10px] transition-opacity duration-300", scrollable ? "opacity-100" : "pointer-events-none opacity-0")}
    >
      <div ref={thumbRef} onPointerDown={onThumbDown} className="w-[10px] cursor-pointer touch-none rounded-[10px] bg-[#00000030]"/>
    </div>
  );
};
