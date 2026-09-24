import { useEffect, useRef } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import WaitTimeText from "./WaitTimeText";

export type RestaurantView =
  "idle" | "check-in" | "waiting" | "queue" | "movie" | "left" | "table-opened";

type RestaurantHeaderProps = {
  view: RestaurantView;
  estimatedWait: string;
  aheadCount: number;
  viewTransition: Transition;
  reducedMotion: boolean | null;
  onCheckIn: () => void;
  onOpenQueue: () => void;
};

export default function RestaurantHeader({
  view,
  estimatedWait,
  aheadCount,
  viewTransition,
  reducedMotion,
  onCheckIn,
  onOpenQueue,
}: RestaurantHeaderProps) {
  const compactButton = useRef<HTMLButtonElement>(null);
  const isCompact = view === "idle" || view === "waiting";
  const isWaiting = view === "waiting";
  const isCheckIn = view === "check-in";
  const isMovie = view === "movie";
  const fadeDuration = reducedMotion ? 0 : 0.12;

  useEffect(() => {
    if (isWaiting) compactButton.current?.focus({ preventScroll: true });
  }, [isWaiting]);

  return (
    <motion.div
      layout
      transition={viewTransition}
      style={{
        width: isCompact ? (isWaiting ? 172 : 152) : 352,
        height: isCompact ? 36 : 64,
      }}
      className="relative flex items-center"
    >
      <motion.div
        layout
        transition={viewTransition}
        style={{
          width: isCompact ? 16 : 32,
          height: isCompact ? 16 : 32,
          marginLeft: isCompact ? 8 : 16,
          borderRadius: isCompact ? 4 : 12,
          backgroundColor: isMovie ? "#ff453a" : "#ffffff",
          color: isMovie ? "#ffffff" : "#ee182d",
        }}
        className="grid shrink-0 place-items-center bg-white text-center leading-tight font-semibold text-[#ee182d]"
      >
        <motion.span
          layout="position"
          transition={viewTransition}
          style={{ fontSize: isMovie ? 13 : isCompact ? 4 : 8 }}
        >
          {isMovie ? (
            "P9"
          ) : (
            <>
              HU
              <br />
              NAN
            </>
          )}
        </motion.span>
      </motion.div>
      <AnimatePresence initial={false} mode="popLayout">
        {!isCompact && (
          <motion.div
            key={view}
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              ...viewTransition,
              opacity: { duration: fadeDuration },
            }}
            className="ml-2 text-xs leading-tight"
          >
            <span className="font-medium text-white">
              {isCheckIn
                ? "Join the waitlist"
                : isMovie
                  ? "Can we still make it?"
                  : "The Queue"}
            </span>
            <br />
            <span className="text-neutral-400">
              {isCheckIn
                ? "Hunan Fifth Avenue"
                : isMovie
                  ? "Plan 9 from Outer Space"
                  : "Last updated just now"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="popLayout">
        {isWaiting && (
          <motion.span
            key="ahead"
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                opacity: {
                  duration: reducedMotion ? 0 : 0.08,
                  delay: 0,
                  ease: "easeOut",
                },
              },
            }}
            transition={{
              ...viewTransition,
              opacity: {
                duration: reducedMotion ? 0 : 0.14,
                delay: reducedMotion ? 0 : 0.2,
              },
            }}
            className="ml-2 text-[13px] whitespace-nowrap text-white"
          >
            {aheadCount} ahead
          </motion.span>
        )}
      </AnimatePresence>
      <motion.div
        layout="position"
        transition={viewTransition}
        style={{
          marginRight: isCompact ? 8 : 16,
          display: isMovie ? "none" : undefined,
        }}
        className="relative ml-auto flex flex-col text-xs leading-tight"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {isCheckIn && (
            <motion.span
              key="wait-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: fadeDuration }}
              className="text-neutral-400"
            >
              Wait time
            </motion.span>
          )}
        </AnimatePresence>
        <motion.span
          layout="position"
          transition={viewTransition}
          style={{
            fontSize: isCompact ? 10 : 12,
            visibility: view === "queue" || isMovie ? "hidden" : "visible",
          }}
          className="block whitespace-nowrap text-[#f7cc05]"
        >
          <WaitTimeText text={view === "idle" ? "~10" : estimatedWait} />
        </motion.span>
      </motion.div>
      {isCompact && (
        <button
          ref={compactButton}
          type="button"
          onClick={isWaiting ? onOpenQueue : onCheckIn}
          aria-label={
            isWaiting
              ? `Open queue, ${aheadCount} ahead, estimated wait ${estimatedWait}`
              : "Join the waitlist"
          }
          className="absolute inset-0 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
        />
      )}
    </motion.div>
  );
}
