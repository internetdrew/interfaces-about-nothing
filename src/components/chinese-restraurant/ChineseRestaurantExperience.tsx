import { useCallback, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import Idle from "./Idle";
import WaitTimeText from "./WaitTimeText";

type View = "idle" | "check-in";

const layoutTransition = {
  layout: { type: "spring", visualDuration: 0.3, bounce: 0.35 },
} satisfies Transition;

export const ChineseRestaurantExperience = () => {
  const [view, setView] = useState<View>("idle");
  const [{ partySize, direction }, setParty] = useState({
    partySize: 2,
    direction: 1,
  });
  const reducedMotion = useReducedMotion();

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
          <div className="select-none">
            <div
              className="my-2.5 flex items-center gap-2"
              style={{ minWidth: "22rem" }}
            >
              <motion.div
                layoutId="hunan-icon"
                transition={layoutTransition}
                style={{
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: "white",
                  borderRadius: 4,
                }}
                className="ml-3 size-8 text-center text-[8px] leading-tight font-semibold text-[#ee182d]"
              >
                HU
                <br />
                NAN
              </motion.div>

              <div className="text-xs leading-tight">
                <span className="font-medium text-white">
                  Join the waitlist
                </span>
                <br />
                <span className="text-neutral-400">Hunan Fifth Avenue</span>
              </div>

              <div className="mr-3 ml-auto flex flex-col text-xs leading-tight text-white">
                <span className="text-neutral-400">Wait time</span>
                <motion.span
                  layoutId="wait-time"
                  transition={layoutTransition}
                  className="text-[#f7cc05]"
                >
                  <WaitTimeText text={estimatedWait} />
                </motion.span>
              </div>
            </div>

            <fieldset className="m-3 mt-8 flex flex-col text-white">
              <label htmlFor="name" className="text-xs text-neutral-400">
                Party name
              </label>
              <input
                type="text"
                className="mt-1.5 rounded-md bg-neutral-800 p-2 text-white select-none placeholder:text-sm"
                placeholder="What's your name?"
              />
            </fieldset>

            {/* Party Size and Wait */}
            <div className="m-3 mt-6 flex items-center justify-between gap-16 text-white">
              <div className="flex flex-col">
                <span className="text-xs text-neutral-400">Party size</span>
                <div className="mt-1.5 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    aria-label="Decrease party size"
                    disabled={partySize <= 1}
                    onClick={() => changePartySize(-1)}
                    className="grid size-9 place-items-center rounded-md bg-neutral-700 font-semibold transition-opacity duration-150 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="relative grid size-9 place-items-center overflow-hidden rounded-md bg-neutral-800 text-xs tabular-nums">
                    <span
                      className="sr-only"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {partySize}
                    </span>
                    <AnimatePresence initial={false} custom={direction}>
                      <motion.span
                        key={partySize}
                        aria-hidden="true"
                        custom={direction}
                        className="absolute inset-0 grid place-items-center"
                        variants={{
                          enter: (direction: number) => ({
                            y: reducedMotion ? 0 : -direction * 12,
                            filter: reducedMotion ? "blur(0px)" : "blur(2px)",
                            opacity: 0,
                          }),
                          visible: { y: 0, filter: "blur(0px)", opacity: 1 },
                          exit: (direction: number) => ({
                            y: reducedMotion ? 0 : direction * 12,
                            filter: reducedMotion ? "blur(0px)" : "blur(2px)",
                            opacity: 0,
                          }),
                        }}
                        initial="enter"
                        animate="visible"
                        exit="exit"
                        transition={{
                          y: {
                            type: "spring",
                            visualDuration: 0.2,
                            bounce: 0.35,
                          },
                          opacity: { duration: 0.15 },
                          filter: { duration: 0.15 },
                        }}
                      >
                        {partySize}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <button
                    type="button"
                    aria-label="Increase party size"
                    disabled={partySize >= 10}
                    onClick={() => changePartySize(1)}
                    className="grid size-9 place-items-center rounded-md bg-neutral-700 font-semibold transition-opacity duration-150 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col">
                <span className="text-xs text-neutral-400">Estimated wait</span>
                <span className="mt-1.5 flex h-9 items-center rounded-md bg-neutral-800 px-2 py-0.5 text-xs text-[#f7cc05]">
                  <WaitTimeText text={estimatedWait} announce />
                </span>
              </div>
            </div>

            <div className="m-3">
              <button className="mt-4 w-full rounded-md bg-white py-2 text-sm font-medium text-neutral-950">
                Join waitlist
              </button>
            </div>
          </div>
        );
      case "idle":
        return (
          <Idle
            onCheckIn={() => setView("check-in")}
            layoutTransition={layoutTransition}
          />
        );
    }
  }, [
    view,
    partySize,
    estimatedWait,
    direction,
    reducedMotion,
    changePartySize,
  ]);

  return (
    <div className="flex h-72 justify-center">
      <motion.div
        layout
        whileTap={{ scale: view === "idle" ? 0.95 : 1 }}
        layoutDependency={view}
        style={{
          borderRadius: view === "idle" ? 9999 : 18,
          minWidth: 96,
        }}
        transition={layoutTransition}
        className="h-fit overflow-hidden bg-black"
      >
        {content}
      </motion.div>
    </div>
  );
};
