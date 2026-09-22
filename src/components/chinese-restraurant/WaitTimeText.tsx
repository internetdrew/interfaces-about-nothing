import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type WaitTimeTextProps = {
  text: string;
  announce?: boolean;
};

export default function WaitTimeText({
  text,
  announce = false,
}: WaitTimeTextProps) {
  const reducedMotion = useReducedMotion();

  return (
    <span className="inline-grid">
      <span
        className="sr-only"
        aria-live={announce ? "polite" : undefined}
        aria-atomic="true"
      >
        {text}
      </span>
      {reducedMotion ? (
        <span aria-hidden="true">{text}</span>
      ) : (
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={text}
            aria-hidden="true"
            className="inline-block whitespace-nowrap"
            initial={{ y: 4, filter: "blur(2px)", opacity: 0 }}
            animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
            exit={{ y: -4, filter: "blur(2px)", opacity: 0 }}
            transition={{ type: "tween", duration: 0.15, ease: "easeInOut" }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      )}
    </span>
  );
}
