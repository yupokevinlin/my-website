import React, { useState, useEffect, useCallback, useRef } from "react";

export interface ImageCarouselProps {
  images: Array<string>;
}

const ChevronLeft: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" style={{ width: "55%", height: "55%" }}>
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
  </svg>
);

const ChevronRight: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" style={{ width: "55%", height: "55%" }}>
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = images.length;

  const goTo = useCallback((i: number) => setCurrent(i), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);

  // Auto-advance — timer resets on every slide change so user interactions delay it too
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const id = setTimeout(next, 10000);
    return () => clearTimeout(id);
  }, [current, isPaused, next, total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const arrowBaseStyle: React.CSSProperties = {
    appearance: "none",
    WebkitAppearance: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    borderRadius: "50%",
    backgroundColor: "var(--primary-main)",
    color: "#ffffff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 2,
    transition: "filter 150ms ease",
  };

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {/* ── Slide area ────────────────────────────────────────────── */}
      <div
        className="relative w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/*
          CSS-grid stacking: all images share the same grid cell so the
          container naturally takes the height of the tallest image.
          Slides fade in/out via opacity — no absolute positioning needed.
        */}
        <div style={{ display: "grid" }}>
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={i === current ? `Slide ${i + 1} of ${total}` : ""}
              aria-hidden={i !== current ? true : undefined}
              className="w-full h-auto block"
              style={{
                gridColumn: "1",
                gridRow: "1",
                opacity: i === current ? 1 : 0,
                transition: "opacity 350ms ease-in-out",
                pointerEvents: i === current ? "auto" : "none",
              }}
            />
          ))}
        </div>

        {/* Prev / Next circular primary-colour buttons */}
        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              className="btn-base"
              style={{ ...arrowBaseStyle, left: "8px", width: "clamp(28px, 7vw, 40px)", height: "clamp(28px, 7vw, 40px)" }}
              onClick={prev}
              onMouseEnter={e => { e.currentTarget.style.filter = "brightness(0.85)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ""; }}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              className="btn-base"
              style={{ ...arrowBaseStyle, right: "8px", width: "clamp(28px, 7vw, 40px)", height: "clamp(28px, 7vw, 40px)" }}
              onClick={next}
              onMouseEnter={e => { e.currentTarget.style.filter = "brightness(0.85)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ""; }}
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>

      {/* ── Pip indicators — paper-coloured band below the image ──── */}
      {/*   Placed outside the slide so they never sit on dark photos  */}
      {total > 1 && (
        <div
          className="flex flex-row items-center justify-center w-full h-[5vw] sm:h-[24px] md:h-[27px] lg:h-[30px]"
          style={{ backgroundColor: "var(--bg-paper)" }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              className="carousel-pip rounded-full transition-[background-color] duration-200 h-[1.6vw] w-[1.6vw] mx-[0.8vw] sm:h-[10px] sm:w-[10px] sm:mx-[5px] md:h-[11px] md:w-[11px] md:mx-[5.5px] lg:h-3 lg:w-3 lg:mx-[6px]"
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                backgroundColor: i === current ? "var(--primary-main)" : "var(--secondary-light)",
              }}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
