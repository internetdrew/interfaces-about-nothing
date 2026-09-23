import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const HOLD_DURATION = 1200;

export default function HoldToLeaveButton({
  onConfirm,
}: {
  onConfirm: () => void;
}) {
  const [holding, setHolding] = useState(false);
  const [label, setLabel] = useState("Hold to leave waitlist");
  const [labelPhase, setLabelPhase] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const labelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completed = useRef(false);
  const reducedMotion = useReducedMotion();

  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (labelTimer.current) clearTimeout(labelTimer.current);
    labelTimer.current = null;
    setLabelPhase("");
    setLabel("Hold to leave waitlist");
    setHolding(false);
  }, []);

  useEffect(
    () => () => {
      cancel();
      if (labelTimer.current) clearTimeout(labelTimer.current);
    },
    [cancel],
  );

  const start = () => {
    if (completed.current || timer.current) return;
    if (labelTimer.current) clearTimeout(labelTimer.current);
    if (reducedMotion) {
      setLabel("Keep holding…");
    } else {
      setLabelPhase("is-exit");
      labelTimer.current = setTimeout(() => {
        setLabel("Keep holding…");
        setLabelPhase("is-enter-start");
        requestAnimationFrame(() => setLabelPhase(""));
      }, 150);
    }
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      completed.current = true;
      setHolding(false);
      onConfirm();
    }, HOLD_DURATION);
  };
  return (
    <button
      type="button"
      aria-label="Hold to leave waitlist"
      onPointerDown={(event) => {
        if (event.isPrimary && event.button === 0) start();
      }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onBlur={cancel}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          if (!event.repeat) start();
        }
        if (event.key === "Escape") cancel();
      }}
      onKeyUp={(event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          cancel();
        }
      }}
      onContextMenu={(event) => event.preventDefault()}
      className="relative min-h-11 flex-1 touch-pan-y overflow-hidden rounded-xl bg-[#ff453a] px-4 py-2.5 text-sm font-medium select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <span className={`t-text-swap ${labelPhase}`}>{label}</span>
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{
          clipPath: holding ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
        }}
        transition={{
          duration: reducedMotion ? 0 : holding ? HOLD_DURATION / 1000 : 0.12,
          ease: holding ? "linear" : "easeOut",
        }}
        className="pointer-events-none absolute inset-0 grid place-items-center bg-[#b9251c]"
      >
        {label}
      </motion.span>
    </button>
  );
}
