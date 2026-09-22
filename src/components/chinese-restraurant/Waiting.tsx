import { motion, useReducedMotion, type Transition } from "motion/react";

type WaitingProps = {
  showAhead: boolean;
  estimatedWait: string;
  layoutTransition: Transition;
  onOpenQueue: () => void;
};

export default function Waiting({
  showAhead,
  estimatedWait,
  layoutTransition,
  onOpenQueue,
}: WaitingProps) {
  const reducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      autoFocus
      onClick={onOpenQueue}
      aria-label={`Open queue, 4 ahead, estimated wait ${estimatedWait}`}
      className="relative flex h-9 cursor-pointer items-center justify-between gap-12 rounded-full pr-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
    >
      <span className="flex items-center gap-2">
        <motion.span
          layoutId="hunan-icon"
          transition={layoutTransition}
          style={{
            display: "grid",
            placeItems: "center",
            backgroundColor: "white",
            borderRadius: 4,
            width: 16,
            height: 16,
          }}
          className="ml-2 text-center text-[4px] leading-tight font-medium text-[#ee182d]"
        >
          HU
          <br />
          NAN
        </motion.span>
        <motion.span
          initial={false}
          animate={{
            y: showAhead || reducedMotion ? 0 : -4,
            opacity: showAhead ? 1 : 0,
          }}
          transition={{
            type: "tween",
            duration: reducedMotion ? 0 : 0.18,
            ease: "easeOut",
          }}
          className="text-[10px] text-white"
        >
          4 ahead
        </motion.span>
      </span>
      <motion.span
        layoutId="wait-time"
        transition={layoutTransition}
        className="text-[10px] whitespace-nowrap text-[#f7cc05]"
      >
        {estimatedWait}
      </motion.span>
    </button>
  );
}
