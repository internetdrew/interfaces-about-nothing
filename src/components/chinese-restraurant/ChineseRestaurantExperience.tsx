import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import CheckIn from "./CheckIn";
import Movie from "./Movie";
import TableOpened from "./TableOpened";
import Queue, { type QueueParty } from "./Queue";
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
  const [hasRejoined, setHasRejoined] = useState(false);
  const leftConfirmation = useRef<HTMLParagraphElement>(null);
  const [queueOpenedAt, setQueueOpenedAt] = useState<number | null>(null);
  const [queue, setQueue] = useState<QueueParty[]>([]);
  const [{ partySize, direction }, setParty] = useState({
    partySize: 4,
    direction: 1,
  });
  const reducedMotion = useReducedMotion();
  const isCompact = view === "idle" || view === "waiting" || view === "left";

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
      setQueue([
        { id: "murphy", name: "Murphy", size: 4, status: "Seating now" },
        { id: "dennison", name: "Dennison", size: 2, status: "Waiting" },
        { id: "user", name: "Cartwright", size: partySize, isUser: true },
      ]);
      setQueueOpenedAt(null);
      setView("waiting");
      setIsJoining(false);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [isJoining, partySize]);

  // Start once on the first queue opening; closing or reopening won't reset it.
  useEffect(() => {
    if (queueOpenedAt === null) return;
    const timer = window.setTimeout(
      () => {
        setQueue((parties) => {
          if (parties.some((party) => party.id === "walk-in")) return parties;
          const murphyIndex = parties.findIndex(
            (party) => party.id === "murphy",
          );
          if (murphyIndex < 0) return parties;
          const insertIndex = murphyIndex + 1;
          return [
            ...parties.slice(0, insertIndex),
            { id: "walk-in", name: "Cohen", size: 1, status: "Next" },
            ...parties.slice(insertIndex),
          ];
        });
      },
      Math.max(0, queueOpenedAt + 3_000 - Date.now()),
    );
    return () => window.clearTimeout(timer);
  }, [queueOpenedAt]);

  useEffect(() => {
    if (view !== "left") return;
    leftConfirmation.current?.focus({ preventScroll: true });
    // Let the contraction finish, then leave a quiet beat before the news.
    const timer = window.setTimeout(() => setView("table-opened"), 3_300);
    return () => window.clearTimeout(timer);
  }, [view]);

  const aheadCount = Math.max(
    0,
    queue.findIndex((party) => party.isUser),
  );

  const changePartySize = useCallback((delta: number) => {
    setParty((previous) => {
      const partySize = Math.min(10, Math.max(1, previous.partySize + delta));
      return partySize === previous.partySize
        ? previous
        : { partySize, direction: delta };
    });
  }, []);
  const estimatedWait = hasRejoined
    ? "5–10 minutes"
    : partySize > 8
      ? "30+ mins"
      : partySize > 2
        ? "~20 mins"
        : "~10 mins";

  return (
    <div className="flex h-96 justify-center">
      <motion.div
        layout
        whileTap={{
          scale: isCompact && view !== "left" && !reducedMotion ? 0.95 : 1,
        }}
        style={{ borderRadius: isCompact ? 18 : 28, minWidth: 96 }}
        transition={viewTransition}
        className="relative h-fit overflow-hidden bg-black"
      >
        {view !== "left" && view !== "table-opened" && (
          <RestaurantHeader
            view={view}
            estimatedWait={estimatedWait}
            aheadCount={aheadCount}
            viewTransition={viewTransition}
            reducedMotion={reducedMotion}
            onCheckIn={() => setView("check-in")}
            onOpenQueue={() => {
              if (!hasRejoined)
                setQueueOpenedAt((openedAt) => openedAt ?? Date.now());
              setView("queue");
            }}
          />
        )}
        {/* Pop details out of flow so their fade doesn't delay the collapse. */}
        <AnimatePresence initial={false} mode="popLayout">
          {view === "left" && (
            <motion.p
              key="left"
              ref={leftConfirmation}
              tabIndex={-1}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.12 }}
              className="flex h-9 w-56 items-center justify-center px-4 text-xs text-white outline-none"
            >
              You’ve left the waitlist.
            </motion.p>
          )}
          {!isCompact && (
            <motion.div
              key={view}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, pointerEvents: "none" }}
              transition={{
                ...viewTransition,
                opacity: { duration: reducedMotion ? 0 : 0.12 },
              }}
            >
              {view === "check-in" ? (
                <CheckIn
                  estimatedWait={estimatedWait}
                  isJoining={isJoining}
                  partySize={partySize}
                  direction={direction}
                  changePartySize={changePartySize}
                  joinWaitlist={joinWaitlist}
                />
              ) : view === "queue" ? (
                <Queue
                  parties={queue}
                  estimatedWait={estimatedWait}
                  onCheckTiming={() => setView("movie")}
                />
              ) : view === "table-opened" ? (
                <TableOpened
                  onRejoin={() => {
                    setQueue((parties) => [
                      ...parties.filter((party) => !party.isUser),
                      {
                        id: "user",
                        name: "Cartwright",
                        size: partySize,
                        isUser: true,
                      },
                    ]);
                    setHasRejoined(true);
                    setView("waiting");
                  }}
                />
              ) : (
                <Movie
                  onBack={() => setView("queue")}
                  onLeaveQueue={() => {
                    setQueueOpenedAt(null);
                    setQueue((parties) =>
                      parties.filter((party) => !party.isUser),
                    );
                    setIsJoining(false);
                    setView("left");
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
