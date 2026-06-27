/**
 * Scrollbars — a self-contained replacement for react-custom-scrollbars-2.
 *
 * Ported from the original library source to plain React + TypeScript,
 * removing the `raf`, `dom-css`, and `prop-types` dependencies.
 */

import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// ─── Utilities ────────────────────────────────────────────────────────────────

let cachedScrollbarWidth: number | false = false;

function getScrollbarWidth(cacheEnabled = true): number {
  if (cacheEnabled && cachedScrollbarWidth !== false) return cachedScrollbarWidth;
  if (typeof document !== "undefined") {
    const div = document.createElement("div");
    Object.assign(div.style, {
      width: "100px",
      height: "100px",
      position: "absolute",
      top: "-9999px",
      overflow: "scroll",
      msOverflowStyle: "scrollbar",
    } as CSSProperties);
    document.body.appendChild(div);
    cachedScrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
  } else {
    cachedScrollbarWidth = 0;
  }
  return cachedScrollbarWidth || 0;
}

function getInnerWidth(el: HTMLElement): number {
  const { clientWidth } = el;
  const { paddingLeft, paddingRight } = getComputedStyle(el);
  return clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
}

function getInnerHeight(el: HTMLElement): number {
  const { clientHeight } = el;
  const { paddingTop, paddingBottom } = getComputedStyle(el);
  return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
}

// ─── Default styles ───────────────────────────────────────────────────────────

const containerStyleDefault: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  height: "100%",
};

const viewStyleDefault: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: "scroll",
  WebkitOverflowScrolling: "touch" as never,
};

const trackHorizontalStyleDefault: CSSProperties = {
  position: "absolute",
  height: 6,
};

const trackVerticalStyleDefault: CSSProperties = {
  position: "absolute",
  width: 6,
};

const thumbHorizontalStyleDefault: CSSProperties = {
  position: "relative",
  display: "block",
  height: "100%",
};

const thumbVerticalStyleDefault: CSSProperties = {
  position: "relative",
  display: "block",
  width: "100%",
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScrollValues {
  left: number;
  top: number;
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
  scrollHeight: number;
  clientWidth: number;
  clientHeight: number;
}

export interface RenderElementProps {
  style: CSSProperties;
  [key: string]: unknown;
}

export interface ScrollbarsProps {
  style?: CSSProperties;
  tagName?: string;
  thumbMinSize?: number;
  thumbSize?: number;
  hideTracksWhenNotNeeded?: boolean;
  autoHide?: boolean;
  autoHideTimeout?: number;
  autoHideDuration?: number;
  children?: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderView?: (props: RenderElementProps) => ReactElement<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderTrackHorizontal?: (props: RenderElementProps) => ReactElement<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderTrackVertical?: (props: RenderElementProps) => ReactElement<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderThumbHorizontal?: (props: RenderElementProps) => ReactElement<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderThumbVertical?: (props: RenderElementProps) => ReactElement<any>;
  onScroll?: (event: Event) => void;
  onScrollFrame?: (values: ScrollValues) => void;
  onScrollStart?: () => void;
  onScrollStop?: () => void;
  onUpdate?: (values: ScrollValues) => void;
}

// ─── Default render elements ──────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderViewDefault({ style, ...props }: RenderElementProps): ReactElement<any> {
  return <div style={style} {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderTrackHorizontalDefault({ style, ...props }: RenderElementProps): ReactElement<any> {
  return <div style={{ ...style, right: 2, bottom: 2, left: 2, borderRadius: 3 }} {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderTrackVerticalDefault({ style, ...props }: RenderElementProps): ReactElement<any> {
  return <div style={{ ...style, right: 2, bottom: 2, top: 2, borderRadius: 3 }} {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderThumbHorizontalDefault({ style, ...props }: RenderElementProps): ReactElement<any> {
  return <div style={{ ...style, cursor: "pointer", borderRadius: "inherit", backgroundColor: "rgba(0,0,0,.2)" }} {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderThumbVerticalDefault({ style, ...props }: RenderElementProps): ReactElement<any> {
  return <div style={{ ...style, cursor: "pointer", borderRadius: "inherit", backgroundColor: "rgba(0,0,0,.2)" }} {...props} />;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Scrollbars: React.FC<ScrollbarsProps> = ({
  style,
  tagName = "div",
  thumbMinSize = 30,
  thumbSize,
  hideTracksWhenNotNeeded = false,
  autoHide = false,
  autoHideTimeout = 1000,
  autoHideDuration = 200,
  children,
  renderView = renderViewDefault,
  renderTrackHorizontal = renderTrackHorizontalDefault,
  renderTrackVertical = renderTrackVerticalDefault,
  renderThumbHorizontal = renderThumbHorizontalDefault,
  renderThumbVertical = renderThumbVerticalDefault,
  onScroll,
  onScrollFrame,
  onScrollStart,
  onScrollStop,
  onUpdate,
}) => {
  // Start at 0 so the first client render matches the server (which has no
  // DOM to measure). The real width is measured after mount to avoid a
  // hydration mismatch on the view's margin styles.
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  const viewRef = useRef<HTMLDivElement | null>(null);
  const trackHRef = useRef<HTMLDivElement | null>(null);
  const trackVRef = useRef<HTMLDivElement | null>(null);
  const thumbHRef = useRef<HTMLDivElement | null>(null);
  const thumbVRef = useRef<HTMLDivElement | null>(null);

  // Mutable state (no re-render needed)
  const rafId = useRef<number | undefined>(undefined);
  const hideTracksTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const detectScrollingInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const dragging = useRef(false);
  const scrolling = useRef(false);
  const trackMouseOver = useRef(false);
  const prevPageX = useRef(0);
  const prevPageY = useRef(0);
  const viewScrollLeft = useRef(0);
  const viewScrollTop = useRef(0);
  const lastViewScrollLeft = useRef(0);
  const lastViewScrollTop = useRef(0);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const getValues = useCallback((): ScrollValues => {
    const {
      scrollLeft = 0,
      scrollTop = 0,
      scrollWidth = 0,
      scrollHeight = 0,
      clientWidth = 0,
      clientHeight = 0,
    } = viewRef.current ?? {};
    return {
      left: scrollLeft / (scrollWidth - clientWidth) || 0,
      top: scrollTop / (scrollHeight - clientHeight) || 0,
      scrollLeft,
      scrollTop,
      scrollWidth,
      scrollHeight,
      clientWidth,
      clientHeight,
    };
  }, []);

  const getThumbHorizontalWidth = useCallback((): number => {
    if (!viewRef.current || !trackHRef.current) return 0;
    const { scrollWidth, clientWidth } = viewRef.current;
    const trackWidth = getInnerWidth(trackHRef.current);
    const width = Math.ceil((clientWidth / scrollWidth) * trackWidth);
    if (trackWidth <= width) return 0;
    if (thumbSize) return thumbSize;
    return Math.max(width, thumbMinSize);
  }, [thumbSize, thumbMinSize]);

  const getThumbVerticalHeight = useCallback((): number => {
    if (!viewRef.current || !trackVRef.current) return 0;
    const { scrollHeight, clientHeight } = viewRef.current;
    const trackHeight = getInnerHeight(trackVRef.current);
    const height = Math.ceil((clientHeight / scrollHeight) * trackHeight);
    if (trackHeight <= height) return 0;
    if (thumbSize) return thumbSize;
    return Math.max(height, thumbMinSize);
  }, [thumbSize, thumbMinSize]);

  const getScrollLeftForOffset = useCallback((offset: number): number => {
    if (!viewRef.current || !trackHRef.current) return 0;
    const { scrollWidth, clientWidth } = viewRef.current;
    const trackWidth = getInnerWidth(trackHRef.current);
    const thumbWidth = getThumbHorizontalWidth();
    return (offset / (trackWidth - thumbWidth)) * (scrollWidth - clientWidth);
  }, [getThumbHorizontalWidth]);

  const getScrollTopForOffset = useCallback((offset: number): number => {
    if (!viewRef.current || !trackVRef.current) return 0;
    const { scrollHeight, clientHeight } = viewRef.current;
    const trackHeight = getInnerHeight(trackVRef.current);
    const thumbHeight = getThumbVerticalHeight();
    return (offset / (trackHeight - thumbHeight)) * (scrollHeight - clientHeight);
  }, [getThumbVerticalHeight]);

  // ── Track / thumb update via rAF ─────────────────────────────────────────

  const doUpdate = useCallback((callback?: (values: ScrollValues) => void) => {
    const values = getValues();
    if (scrollbarWidth) {
      const {
        scrollLeft, clientWidth, scrollWidth,
        scrollTop, clientHeight, scrollHeight,
      } = values;

      if (trackHRef.current && thumbHRef.current) {
        const trackW = getInnerWidth(trackHRef.current);
        const thumbW = getThumbHorizontalWidth();
        const thumbX = (scrollLeft / (scrollWidth - clientWidth)) * (trackW - thumbW);
        thumbHRef.current.style.width = `${thumbW}px`;
        thumbHRef.current.style.transform = `translateX(${thumbX}px)`;
        if (hideTracksWhenNotNeeded && trackHRef.current) {
          trackHRef.current.style.visibility = scrollWidth > clientWidth ? "visible" : "hidden";
        }
      }

      if (trackVRef.current && thumbVRef.current) {
        const trackH = getInnerHeight(trackVRef.current);
        const thumbH = getThumbVerticalHeight();
        const thumbY = (scrollTop / (scrollHeight - clientHeight)) * (trackH - thumbH);
        thumbVRef.current.style.height = `${thumbH}px`;
        thumbVRef.current.style.transform = `translateY(${thumbY}px)`;
        if (hideTracksWhenNotNeeded && trackVRef.current) {
          trackVRef.current.style.visibility = scrollHeight > clientHeight ? "visible" : "hidden";
        }
      }
    }
    if (onUpdate) onUpdate(values);
    if (typeof callback === "function") callback(values);
  }, [getValues, getThumbHorizontalWidth, getThumbVerticalHeight, hideTracksWhenNotNeeded, onUpdate, scrollbarWidth]);

  const scheduleUpdate = useCallback((callback?: (values: ScrollValues) => void) => {
    if (rafId.current !== undefined) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      rafId.current = undefined;
      doUpdate(callback);
    });
  }, [doUpdate]);

  // ── Auto-hide helpers ────────────────────────────────────────────────────

  const showTracks = useCallback(() => {
    if (hideTracksTimeout.current !== undefined) clearTimeout(hideTracksTimeout.current);
    if (trackHRef.current) trackHRef.current.style.opacity = "1";
    if (trackVRef.current) trackVRef.current.style.opacity = "1";
  }, []);

  const hideTracks = useCallback(() => {
    if (dragging.current || scrolling.current || trackMouseOver.current) return;
    if (hideTracksTimeout.current !== undefined) clearTimeout(hideTracksTimeout.current);
    hideTracksTimeout.current = setTimeout(() => {
      if (trackHRef.current) trackHRef.current.style.opacity = "0";
      if (trackVRef.current) trackVRef.current.style.opacity = "0";
    }, autoHideTimeout);
  }, [autoHideTimeout]);

  // ── Scroll detection ─────────────────────────────────────────────────────

  const handleScrollStop = useCallback(() => {
    if (onScrollStop) onScrollStop();
    if (autoHide) hideTracks();
  }, [autoHide, hideTracks, onScrollStop]);

  const handleScrollStart = useCallback(() => {
    if (onScrollStart) onScrollStart();
    if (autoHide) showTracks();
  }, [autoHide, showTracks, onScrollStart]);

  const detectScrolling = useCallback(() => {
    if (scrolling.current) return;
    scrolling.current = true;
    handleScrollStart();
    detectScrollingInterval.current = setInterval(() => {
      if (
        lastViewScrollLeft.current === viewScrollLeft.current &&
        lastViewScrollTop.current === viewScrollTop.current
      ) {
        clearInterval(detectScrollingInterval.current);
        scrolling.current = false;
        handleScrollStop();
      }
      lastViewScrollLeft.current = viewScrollLeft.current;
      lastViewScrollTop.current = viewScrollTop.current;
    }, 100);
  }, [handleScrollStart, handleScrollStop]);

  const handleScroll = useCallback((event: Event) => {
    if (onScroll) onScroll(event);
    scheduleUpdate((values) => {
      viewScrollLeft.current = values.scrollLeft;
      viewScrollTop.current = values.scrollTop;
      if (onScrollFrame) onScrollFrame(values);
    });
    detectScrolling();
  }, [detectScrolling, onScroll, onScrollFrame, scheduleUpdate]);

  // ── Dragging ─────────────────────────────────────────────────────────────

  const teardownDragging = useCallback(() => {
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
    document.onselectstart = null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupDragging = useCallback(() => {
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.onselectstart = () => false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Using refs for drag handlers to break circular deps
  const handleDragMoveRef = useRef<(e: MouseEvent) => void>(() => {});
  const handleDragEndRef = useRef<() => void>(() => {});

  function handleDragMove(event: MouseEvent) {
    handleDragMoveRef.current(event);
  }
  function handleDragEnd() {
    handleDragEndRef.current();
  }

  useEffect(() => {
    handleDragMoveRef.current = (event: MouseEvent) => {
      if (prevPageX.current && trackHRef.current && viewRef.current) {
        const { clientX } = event;
        const { left: trackLeft } = trackHRef.current.getBoundingClientRect();
        const thumbWidth = getThumbHorizontalWidth();
        const clickPosition = thumbWidth - prevPageX.current;
        const offset = -trackLeft + clientX - clickPosition;
        viewRef.current.scrollLeft = getScrollLeftForOffset(offset);
      }
      if (prevPageY.current && trackVRef.current && viewRef.current) {
        const { clientY } = event;
        const { top: trackTop } = trackVRef.current.getBoundingClientRect();
        const thumbHeight = getThumbVerticalHeight();
        const clickPosition = thumbHeight - prevPageY.current;
        const offset = -trackTop + clientY - clickPosition;
        viewRef.current.scrollTop = getScrollTopForOffset(offset);
      }
    };

    handleDragEndRef.current = () => {
      dragging.current = false;
      prevPageX.current = 0;
      prevPageY.current = 0;
      teardownDragging();
      if (autoHide) hideTracks();
    };
  }, [autoHide, getScrollLeftForOffset, getScrollTopForOffset, getThumbHorizontalWidth, getThumbVerticalHeight, hideTracks, teardownDragging]);

  const handleDragStart = useCallback((event: MouseEvent) => {
    dragging.current = true;
    event.stopImmediatePropagation();
    setupDragging();
  }, [setupDragging]);

  // ── Track / thumb mouse handlers ─────────────────────────────────────────

  const handleHorizontalTrackMouseDown = useCallback((event: MouseEvent) => {
    event.preventDefault();
    const { target, clientX } = event;
    const { left: targetLeft } = (target as HTMLElement).getBoundingClientRect();
    const thumbWidth = getThumbHorizontalWidth();
    const offset = Math.abs(targetLeft - clientX) - thumbWidth / 2;
    if (viewRef.current) viewRef.current.scrollLeft = getScrollLeftForOffset(offset);
  }, [getScrollLeftForOffset, getThumbHorizontalWidth]);

  const handleVerticalTrackMouseDown = useCallback((event: MouseEvent) => {
    event.preventDefault();
    const { target, clientY } = event;
    const { top: targetTop } = (target as HTMLElement).getBoundingClientRect();
    const thumbHeight = getThumbVerticalHeight();
    const offset = Math.abs(targetTop - clientY) - thumbHeight / 2;
    if (viewRef.current) viewRef.current.scrollTop = getScrollTopForOffset(offset);
  }, [getScrollTopForOffset, getThumbVerticalHeight]);

  const handleHorizontalThumbMouseDown = useCallback((event: MouseEvent) => {
    event.preventDefault();
    handleDragStart(event);
    const { target, clientX } = event;
    const { offsetWidth } = target as HTMLElement;
    const { left } = (target as HTMLElement).getBoundingClientRect();
    prevPageX.current = offsetWidth - (clientX - left);
  }, [handleDragStart]);

  const handleVerticalThumbMouseDown = useCallback((event: MouseEvent) => {
    event.preventDefault();
    handleDragStart(event);
    const { target, clientY } = event;
    const { offsetHeight } = target as HTMLElement;
    const { top } = (target as HTMLElement).getBoundingClientRect();
    prevPageY.current = offsetHeight - (clientY - top);
  }, [handleDragStart]);

  const handleTrackMouseEnter = useCallback(() => {
    trackMouseOver.current = true;
    if (autoHide) showTracks();
  }, [autoHide, showTracks]);

  const handleTrackMouseLeave = useCallback(() => {
    trackMouseOver.current = false;
    if (autoHide) hideTracks();
  }, [autoHide, hideTracks]);

  const handleWindowResize = useCallback(() => {
    getScrollbarWidth(false); // invalidate cache
    scheduleUpdate();
  }, [scheduleUpdate]);

  // ── Lifecycle ────────────────────────────────────────────────────────────

  useEffect(() => {
    const view = viewRef.current;
    const trackH = trackHRef.current;
    const trackV = trackVRef.current;
    const thumbH = thumbHRef.current;
    const thumbV = thumbVRef.current;

    if (!view) return;

    // Measure the native scrollbar width now that the DOM exists, and publish
    // it to state so the view's margin styles update post-hydration.
    const sw = getScrollbarWidth();
    setScrollbarWidth(sw);

    view.addEventListener("scroll", handleScroll);

    if (sw) {
      trackH?.addEventListener("mouseenter", handleTrackMouseEnter);
      trackH?.addEventListener("mouseleave", handleTrackMouseLeave);
      trackH?.addEventListener("mousedown", handleHorizontalTrackMouseDown as EventListener);
      trackV?.addEventListener("mouseenter", handleTrackMouseEnter);
      trackV?.addEventListener("mouseleave", handleTrackMouseLeave);
      trackV?.addEventListener("mousedown", handleVerticalTrackMouseDown as EventListener);
      thumbH?.addEventListener("mousedown", handleHorizontalThumbMouseDown as EventListener);
      thumbV?.addEventListener("mousedown", handleVerticalThumbMouseDown as EventListener);
      window.addEventListener("resize", handleWindowResize);
    }

    scheduleUpdate();

    return () => {
      if (rafId.current !== undefined) cancelAnimationFrame(rafId.current);
      if (hideTracksTimeout.current !== undefined) clearTimeout(hideTracksTimeout.current);
      if (detectScrollingInterval.current !== undefined) clearInterval(detectScrollingInterval.current);

      view.removeEventListener("scroll", handleScroll);

      if (sw) {
        trackH?.removeEventListener("mouseenter", handleTrackMouseEnter);
        trackH?.removeEventListener("mouseleave", handleTrackMouseLeave);
        trackH?.removeEventListener("mousedown", handleHorizontalTrackMouseDown as EventListener);
        trackV?.removeEventListener("mouseenter", handleTrackMouseEnter);
        trackV?.removeEventListener("mouseleave", handleTrackMouseLeave);
        trackV?.removeEventListener("mousedown", handleVerticalTrackMouseDown as EventListener);
        thumbH?.removeEventListener("mousedown", handleHorizontalThumbMouseDown as EventListener);
        thumbV?.removeEventListener("mousedown", handleVerticalThumbMouseDown as EventListener);
        window.removeEventListener("resize", handleWindowResize);
        teardownDragging();
      }
    };
  // We intentionally run this once on mount; handler identity is stable via useCallback.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-run update whenever children change.
  useEffect(() => {
    scheduleUpdate();
  });

  // ── Computed styles ──────────────────────────────────────────────────────

  const containerStyle: CSSProperties = {
    ...containerStyleDefault,
    ...style,
  };

  // The native scrollbar is hidden via CSS (`scrollbars-view`), so it occupies
  // no layout space and needs no negative-margin compensation. Applying margins
  // based on the post-mount scrollbar-width measurement would reflow the content
  // and cause a layout shift (CLS), so we deliberately leave the view flush.
  const viewStyle: CSSProperties = {
    ...viewStyleDefault,
  };

  const autoHideTrackStyle: CSSProperties = autoHide
    ? { transition: `opacity ${autoHideDuration}ms`, opacity: 0 }
    : {};

  const trackHStyle: CSSProperties = {
    ...trackHorizontalStyleDefault,
    ...autoHideTrackStyle,
    ...(!scrollbarWidth ? { display: "none" } : {}),
  };

  const trackVStyle: CSSProperties = {
    ...trackVerticalStyleDefault,
    ...autoHideTrackStyle,
    ...(!scrollbarWidth ? { display: "none" } : {}),
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const viewElement = cloneElement(
    renderView({ style: viewStyle }),
    { ref: (el: HTMLDivElement | null) => { viewRef.current = el; } },
    children,
  );

  const thumbHElement = cloneElement(
    renderThumbHorizontal({ style: thumbHorizontalStyleDefault }),
    { ref: (el: HTMLDivElement | null) => { thumbHRef.current = el; } },
  );

  const trackHElement = cloneElement(
    renderTrackHorizontal({ style: trackHStyle }),
    { ref: (el: HTMLDivElement | null) => { trackHRef.current = el; } },
    thumbHElement,
  );

  const thumbVElement = cloneElement(
    renderThumbVertical({ style: thumbVerticalStyleDefault }),
    { ref: (el: HTMLDivElement | null) => { thumbVRef.current = el; } },
  );

  const trackVElement = cloneElement(
    renderTrackVertical({ style: trackVStyle }),
    { ref: (el: HTMLDivElement | null) => { trackVRef.current = el; } },
    thumbVElement,
  );

  return React.createElement(
    tagName,
    { style: containerStyle },
    viewElement,
    trackHElement,
    trackVElement,
  );
};

export default Scrollbars;

