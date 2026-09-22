import { useMemo, useState } from "react";
import { motion, type Transition } from "motion/react";
import Idle from "./Idle";

type View = "idle" | "check-in";

const layoutTransition = {
  layout: { type: "spring", visualDuration: 0.3, bounce: 0.35 },
} satisfies Transition;

export const ChineseRestaurantExperience = () => {
  const [view, setView] = useState<View>("idle");

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
                  ~10 mins
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
                  <div className="grid size-9 place-items-center rounded-md bg-neutral-700 font-semibold">
                    -
                  </div>
                  <span className="grid size-9 place-items-center rounded-md bg-neutral-800 text-sm">
                    3
                  </span>
                  <div className="grid size-9 place-items-center rounded-md bg-neutral-700 font-semibold">
                    +
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col">
                <span className="text-xs text-neutral-400">Estimated wait</span>
                <span className="mt-1.5 flex h-9 items-center rounded-md bg-neutral-800 px-2 py-0.5 text-xs text-[#f7cc05]">
                  8 - 12 min
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
  }, [view]);

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
