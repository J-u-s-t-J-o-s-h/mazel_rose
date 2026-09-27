"use client";

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselItem = { id: string };

type Metrics = {
  cardW: number;
  cardH: number;
  step: number;
  radius: number;
  perspective: number;
  scale: number;
};

function metricsFor(width: number, count: number): Metrics {
  const mobile = width < 640;
  const tablet = width < 1024;
  const cardW = mobile ? Math.min(168, Math.max(132, width * 0.44)) : tablet ? 200 : 250;
  const cardH = Math.round(cardW * 1.32);
  const gap = mobile ? 16 : tablet ? 24 : 36;
  const step = count <= 1 ? 0 : Math.min(46, 360 / count);
  const stepRad = (step * Math.PI) / 180;
  const radius = step === 0 ? 0 : (cardW + gap) / (2 * Math.sin(stepRad / 2));
  const perspective = mobile ? 900 : tablet ? 1200 : 1600;
  const scale = radius > 0 && radius < perspective ? perspective / (perspective - radius) : 1;
  return { cardW, cardH, step, radius, perspective, scale };
}

function wrapIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return ((index % count) + count) % count;
}

function shortestDelta(index: number, scroll: number, count: number): number {
  let delta = index - scroll;
  delta = ((delta % count) + count) % count;
  if (delta > count / 2) delta -= count;
  return delta;
}

export function ThreeDCarousel<T extends CarouselItem>({
  items,
  label,
  renderItem,
  renderCaption,
  onActivate,
}: {
  items: T[];
  label: string;
  renderItem: (item: T, active: boolean) => ReactNode;
  renderCaption?: (item: T) => ReactNode;
  onActivate: (index: number) => void;
}) {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(0);
  const scroll = useMotionValue(0);
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const pointer = useRef<{
    id: number;
    x: number;
    y: number;
    scroll: number;
    lastX: number;
    lastTime: number;
    velocity: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);

  const count = items.length;
  const metrics = metricsFor(width || 390, count);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => setWidth(stage.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scroll, "change", (value) => {
    const next = wrapIndex(Math.round(value), count);
    setActive((current) => (current === next ? current : next));
  });

  const spinTo = useCallback(
    (target: number) => {
      animation.current?.stop();
      if (reduceMotion) {
        scroll.set(target);
        return;
      }
      animation.current = animate(scroll, target, {
        type: "spring",
        stiffness: 180,
        damping: 28,
        mass: 0.7,
      });
    },
    [reduceMotion, scroll],
  );

  const stepBy = useCallback(
    (direction: -1 | 1) => {
      if (count <= 1) return;
      spinTo(Math.round(scroll.get()) + direction);
    },
    [count, scroll, spinTo],
  );

  const showFace = useCallback(
    (index: number) => {
      if (count <= 1) return;
      const current = scroll.get();
      spinTo(current + shortestDelta(index, current, count));
    },
    [count, scroll, spinTo],
  );

  if (reduceMotion) {
    return (
      <div aria-label={label} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onActivate(index)}
            className="w-[72%] max-w-xs shrink-0 snap-center text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne sm:w-64"
          >
            <span className="relative block aspect-[3/4] overflow-hidden border border-ivory/15">
              {renderItem(item, true)}
            </span>
            {renderCaption ? <span className="mt-3 block">{renderCaption(item)}</span> : null}
          </button>
        ))}
      </div>
    );
  }

  const activeItem = items[active];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="overflow-x-clip"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          stepBy(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          stepBy(1);
        }
      }}
    >
      <div className="grid grid-cols-[2.75rem_1fr_2.75rem] items-center gap-x-2 gap-y-3 lg:gap-x-4">
        <CarouselButton
          label="Previous"
          onClick={() => stepBy(-1)}
          disabled={count <= 1}
          className="col-start-1 row-start-2 justify-self-end lg:row-start-1 lg:justify-self-center"
        />
        <div
          ref={stageRef}
          className="relative col-span-3 min-h-[18rem] min-w-0 sm:min-h-[22rem] lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:min-h-[26rem]"
          style={{
            height: width ? Math.ceil(metrics.cardH * metrics.scale) + 12 : undefined,
            perspective: `${metrics.perspective}px`,
            touchAction: "pan-y",
          }}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            animation.current?.stop();
            pointer.current = {
              id: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              scroll: scroll.get(),
              lastX: event.clientX,
              lastTime: event.timeStamp,
              velocity: 0,
              moved: false,
            };
          }}
          onPointerMove={(event) => {
            const drag = pointer.current;
            if (!drag || drag.id !== event.pointerId || count <= 1) return;
            const dx = event.clientX - drag.x;
            const dy = event.clientY - drag.y;
            if (!drag.moved && Math.abs(dx) < 8) return;
            if (!drag.moved && Math.abs(dy) > Math.abs(dx)) return;
            drag.moved = true;
            const dt = Math.max(event.timeStamp - drag.lastTime, 16);
            drag.velocity = (event.clientX - drag.lastX) / dt;
            drag.lastX = event.clientX;
            drag.lastTime = event.timeStamp;
            event.currentTarget.setPointerCapture(event.pointerId);
            scroll.set(drag.scroll - dx / Math.max(metrics.cardW * 0.62, 1));
          }}
          onPointerUp={(event) => {
            const drag = pointer.current;
            if (!drag || drag.id !== event.pointerId) return;
            pointer.current = null;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
            if (!drag.moved || count <= 1) return;
            suppressClick.current = true;
            const spacing = Math.max(metrics.cardW * 0.62, 1);
            const projected = scroll.get() - (drag.velocity * 140) / spacing;
            spinTo(Math.round(projected));
          }}
          onPointerCancel={() => {
            pointer.current = null;
          }}
        >
          <div className="absolute left-1/2 top-1/2" style={{ transformStyle: "preserve-3d" }}>
            <Coverflow scroll={scroll} count={count} cardW={metrics.cardW}>
              {items.map((item, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-face={index}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={isActive ? `Open ${label} ${index + 1} of ${count}` : `Show ${label} ${index + 1} of ${count}`}
                    onClick={() => {
                      if (suppressClick.current) {
                        suppressClick.current = false;
                        return;
                      }
                      if (isActive) onActivate(index);
                      else showFace(index);
                    }}
                    className="absolute overflow-hidden border border-ivory/15 bg-wine-black shadow-[0_18px_40px_rgba(0,0,0,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
                    style={{
                      width: metrics.cardW,
                      height: metrics.cardH,
                      left: -metrics.cardW / 2,
                      top: -metrics.cardH / 2,
                    }}
                  >
                    {renderItem(item, isActive)}
                  </button>
                );
              })}
            </Coverflow>
          </div>
          <p className="sr-only" aria-live="polite">
            {active + 1} of {count}
          </p>
        </div>
        <CarouselButton
          label="Next"
          onClick={() => stepBy(1)}
          disabled={count <= 1}
          className="col-start-3 row-start-2 justify-self-start lg:row-start-1 lg:justify-self-center"
        />
      </div>
      {renderCaption && activeItem ? (
        <div className="mx-auto mt-2 max-w-lg px-2 text-center">{renderCaption(activeItem)}</div>
      ) : null}
    </div>
  );
}

function Coverflow({
  scroll,
  count,
  cardW,
  children,
}: {
  scroll: ReturnType<typeof useMotionValue<number>>;
  count: number;
  cardW: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const place = useCallback(
    (value: number) => {
      const root = ref.current;
      if (!root || count <= 0) return;
      const spacing = Math.max(cardW * 0.62, 1);
      for (const node of root.querySelectorAll<HTMLElement>("[data-face]")) {
        const index = Number(node.dataset.face);
        const delta = shortestDelta(index, value, count);
        const distance = Math.abs(delta);
        node.style.transform = `translateX(${delta * spacing}px) translateZ(${-distance * 140}px) rotateY(${delta * -46}deg)`;
        node.style.opacity = distance > 2.2 ? "0" : "1";
        node.style.zIndex = String(100 - Math.round(distance * 10));
        node.style.pointerEvents = distance > 1.2 ? "none" : "auto";
      }
    },
    [cardW, count],
  );

  useMotionValueEvent(scroll, "change", place);
  useLayoutEffect(() => {
    place(scroll.get());
  }, [place, scroll]);

  return (
    <div ref={ref} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

function CarouselButton({
  label,
  onClick,
  disabled,
  className,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  className?: string;
}) {
  const Icon = label === "Previous" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-ivory/30 text-ivory hover:border-brass hover:text-champagne disabled:opacity-40 ${className ?? ""}`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
