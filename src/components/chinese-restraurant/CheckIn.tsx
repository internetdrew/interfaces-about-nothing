import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import WaitTimeText from "./WaitTimeText";

interface CheckInProps {
  estimatedWait: string;
  isJoining: boolean;
  partySize: number;
  direction: number;
  changePartySize: (delta: number) => void;
  joinWaitlist: () => void;
}

const CheckIn = ({
  estimatedWait,
  isJoining,
  partySize,
  direction,
  changePartySize,
  joinWaitlist,
}: CheckInProps) => {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flow-root w-88 select-none">
      <div className="m-4 mt-5 flex flex-col text-white">
        <span className="text-xs text-neutral-400">Party name</span>
        <div className="mt-1.5 rounded-lg bg-neutral-800 p-2 text-sm text-white select-none">
          {isJoining ? "Cartwright" : "Costanza"}
        </div>
      </div>

      {/* Party Size and Wait */}
      <div className="m-4 mt-6 flex items-center justify-between gap-16 text-white">
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400">Party size</span>
          <div className="mt-1.5 flex items-center justify-between gap-4">
            <button
              type="button"
              aria-label="Decrease party size"
              disabled={isJoining || partySize <= 1}
              onClick={() => changePartySize(-1)}
              className="grid size-9 place-items-center rounded-lg bg-neutral-700 font-semibold transition-opacity duration-150 disabled:opacity-40"
            >
              -
            </button>
            <span className="relative grid size-9 place-items-center overflow-hidden rounded-lg bg-neutral-800 text-xs tabular-nums">
              <span className="sr-only" aria-live="polite" aria-atomic="true">
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
              disabled={isJoining || partySize >= 10}
              onClick={() => changePartySize(1)}
              className="grid size-9 place-items-center rounded-lg bg-neutral-700 font-semibold transition-opacity duration-150 disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <span className="text-xs text-neutral-400">Estimated wait</span>
          <span className="mt-1.5 flex h-9 items-center rounded-lg bg-neutral-800 px-2 py-0.5 text-xs text-[#f7cc05]">
            <WaitTimeText text={estimatedWait} announce />
          </span>
        </div>
      </div>

      <div className="m-4">
        <button
          type="button"
          onClick={joinWaitlist}
          disabled={isJoining}
          className="mt-4 w-full rounded-xl bg-white py-2 text-sm font-medium text-neutral-950 disabled:opacity-40"
        >
          <WaitTimeText
            text={isJoining ? "Joining the waitlist" : "Join waitlist"}
            announce
          />
        </button>
      </div>
    </div>
  );
};

export default CheckIn;
