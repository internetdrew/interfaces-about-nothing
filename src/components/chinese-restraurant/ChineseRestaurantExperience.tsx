import { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import CheckIn from "./CheckIn";
import RestaurantHeader, { type RestaurantView } from "./RestaurantHeader";

const expandedTransition = {
  layout: { type: "spring", visualDuration: 0.3, bounce: 0.35 },
} satisfies Transition;
const compactTransition = {
  layout: { type: "spring", visualDuration: 0.28, bounce: 0.1 },
} satisfies Transition;
const reducedTransition = { layout: { duration: 0 } } satisfies Transition;

export const ChineseRestaurantExperience = () => {
  const [view, setView] = useState<RestaurantView>("idle");
  const [isJoining, setIsJoining] = useState(false);
  const [{ partySize, direction }, setParty] = useState({
    partySize: 2,
    direction: 1,
  });
  const reducedMotion = useReducedMotion();
  const isCompact = view === "idle" || view === "waiting";
  const isCheckIn = view === "check-in";
  const viewTransition = reducedMotion
    ? reducedTransition
    : isCompact
      ? compactTransition
      : expandedTransition;

  const joinWaitlist = useCallback(() => {
    if (!isJoining) setIsJoining(true);
  }, [isJoining]);

  useEffect(() => {
    if (!isJoining) return;
    const timer = window.setTimeout(() => {
      setView("waiting");
      setIsJoining(false);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [isJoining]);

  const changePartySize = useCallback((delta: number) => {
    setParty((previous) => {
      const partySize = Math.min(10, Math.max(1, previous.partySize + delta));
      return partySize === previous.partySize
        ? previous
        : { partySize, direction: delta };
    });
  }, []);
  const estimatedWait =
    partySize > 8 ? "30+ mins" : partySize > 2 ? "~20 mins" : "~10 mins";
  const fadeDuration = reducedMotion ? 0 : 0.12;

  return (
    <div className="flex h-72 justify-center">
      <motion.div
        layout
        layoutDependency={view}
        whileTap={{ scale: isCompact && !reducedMotion ? 0.95 : 1 }}
        style={{ borderRadius: isCompact ? 18 : 28, minWidth: 96 }}
        transition={viewTransition}
        className="relative h-fit overflow-hidden bg-black"
      >
        <RestaurantHeader
          view={view}
          estimatedWait={estimatedWait}
          viewTransition={viewTransition}
          reducedMotion={reducedMotion}
          onCheckIn={() => setView("check-in")}
          onOpenQueue={() => setView("queue")}
        />
        {/* Pop the form out of flow so its fade doesn't delay the collapse. */}
        <AnimatePresence initial={false} mode="popLayout">
          {isCheckIn && (
            <motion.div
              key="details"
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, pointerEvents: "none" }}
              transition={{
                ...viewTransition,
                opacity: { duration: fadeDuration },
              }}
            >
              <CheckIn
                estimatedWait={estimatedWait}
                isJoining={isJoining}
                partySize={partySize}
                direction={direction}
                changePartySize={changePartySize}
                joinWaitlist={joinWaitlist}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
