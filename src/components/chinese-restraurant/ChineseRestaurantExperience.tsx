import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import Idle from "./Idle";
import Waiting from "./Waiting";
import Queue from "./Queue";
import CheckIn from "./CheckIn";

type View = "idle" | "check-in" | "waiting" | "queue";

const layoutTransition = {
  layout: { type: "spring", visualDuration: 0.3, bounce: 0.35 },
} satisfies Transition;

const reducedLayoutTransition = {
  layout: { duration: 0 },
} satisfies Transition;

export const ChineseRestaurantExperience = () => {
  const [view, setView] = useState<View>("idle");
  const [isJoining, setIsJoining] = useState(false);
  const [waitingSettled, setWaitingSettled] = useState(false);
  const [{ partySize, direction }, setParty] = useState({
    partySize: 2,
    direction: 1,
  });
  const reducedMotion = useReducedMotion();
  const isCompact = view === "idle" || view === "waiting";
  const viewTransition = reducedMotion
    ? reducedLayoutTransition
    : layoutTransition;

  const joinWaitlist = useCallback(() => {
    if (isJoining) return;
    setWaitingSettled(false);
    setIsJoining(true);
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

  const content = useMemo(() => {
    switch (view) {
      case "check-in":
        return (
          <CheckIn
            viewTransition={viewTransition}
            estimatedWait={estimatedWait}
            isJoining={isJoining}
            partySize={partySize}
            direction={direction}
            changePartySize={changePartySize}
            joinWaitlist={joinWaitlist}
          />
        );
      case "idle":
        return (
          <Idle
            onCheckIn={() => setView("check-in")}
            layoutTransition={viewTransition}
          />
        );
      case "waiting":
        return (
          <Waiting
            showAhead={waitingSettled || !!reducedMotion}
            estimatedWait={estimatedWait}
            layoutTransition={viewTransition}
            onOpenQueue={() => setView("queue")}
          />
        );
      case "queue":
        return <Queue />;
    }
  }, [
    view,
    partySize,
    estimatedWait,
    direction,
    reducedMotion,
    changePartySize,
    isJoining,
    joinWaitlist,
    viewTransition,
    waitingSettled,
  ]);

  return (
    <div className="flex h-72 justify-center">
      <motion.div
        layout
        whileTap={{ scale: isCompact && !reducedMotion ? 0.95 : 1 }}
        layoutDependency={view}
        onLayoutAnimationComplete={() => {
          if (view === "waiting") setWaitingSettled(true);
        }}
        style={{
          borderRadius: isCompact ? 9999 : 18,
          minWidth: 96,
        }}
        transition={viewTransition}
        className="h-fit overflow-hidden bg-black"
      >
        {content}
      </motion.div>
    </div>
  );
};
