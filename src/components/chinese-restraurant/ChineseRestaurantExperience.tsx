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
  const leftConfirmation = useRef<HTMLParagraphElement>(null);
  const cohenTimer = useRef<number | null>(null);
  const [queue, setQueue] = useState<QueueParty[]>([]);
  const [waitEstimate, setWaitEstimate] = useState("~20 mins");
  const islandRef = useRef<HTMLDivElement>(null);
  const [{ partySize, direction }, setParty] = useState({
    partySize: 4,
    direction: 1,
  });
  const reducedMotion = useReducedMotion();
  const isCompact = view === "idle" || view === "waiting" || view === "left";
  const hasActiveWaitlist = queue.some((party) => party.isUser);

  useEffect(() => {
    const handleOutsidePointer = (event: PointerEvent) => {
      if (
        view === "idle" ||
        islandRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      setIsJoining(false);
      setView(hasActiveWaitlist ? "waiting" : "idle");
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointer);
  }, [hasActiveWaitlist, view]);

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
      setWaitEstimate(
        partySize > 8 ? "30+ mins" : partySize > 2 ? "~20 mins" : "~10 mins",
      );
      setQueue([
        { id: "murphy", name: "Murphy", size: 4, status: "Seating now" },
        { id: "dennison", name: "Dennison", size: 2, status: "Waiting" },
        { id: "user", name: "Cartwright", size: partySize, isUser: true },
      ]);
      setView("waiting");
      setIsJoining(false);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [isJoining, partySize]);

  useEffect(
    () => () => {
      if (cohenTimer.current !== null) window.clearTimeout(cohenTimer.current);
    },
    [],
  );

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
  const estimatedWait =
    view === "check-in"
      ? partySize > 8
        ? "30+ mins"
        : partySize > 2
          ? "~20 mins"
          : "~10 mins"
      : waitEstimate;

  const openQueue = useCallback(() => {
    setView("queue");
    if (
      cohenTimer.current !== null ||
      queue.some((party) => party.id === "walk-in")
    )
      return;
    cohenTimer.current = window.setTimeout(() => {
      setQueue((parties) => {
        const murphyIndex = parties.findIndex((party) => party.id === "murphy");
        if (murphyIndex < 0 || parties.some((party) => party.id === "walk-in"))
          return parties;
        return [
          ...parties.slice(0, murphyIndex + 1),
          { id: "walk-in", name: "Cohen", size: 1, status: "Next" },
          ...parties.slice(murphyIndex + 1),
        ];
      });
      cohenTimer.current = null;
    }, 3_000);
  }, [queue]);

  return (
    <div className="flex h-96 justify-center">
      <motion.div
        ref={islandRef}
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
            onCheckIn={() =>
              setView(hasActiveWaitlist ? "waiting" : "check-in")
            }
            onOpenQueue={openQueue}
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
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{
                duration: reducedMotion ? 0 : 0.2,
                ease: "easeOut",
              }}
              className="flex h-9 w-56 items-center justify-center px-4 text-xs text-white outline-none"
            >
              You've left the waitlist.
            </motion.p>
          )}
          {!isCompact && (
            <motion.div
              key={view}
              layout="position"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)", pointerEvents: "none" }}
              transition={{
                ...viewTransition,
                opacity: { duration: reducedMotion ? 0 : 0.12 },
                filter: { duration: reducedMotion ? 0 : 0.2, ease: "easeOut" },
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
                    setWaitEstimate("5–10 minutes");
                    setView("waiting");
                  }}
                />
              ) : (
                <Movie
                  onBack={() => setView("queue")}
                  onLeaveQueue={() => {
                    if (cohenTimer.current !== null) {
                      window.clearTimeout(cohenTimer.current);
                      cohenTimer.current = null;
                    }
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
