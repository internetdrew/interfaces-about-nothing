import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type QueueParty = {
  id: string;
  name: string;
  size: number;
  isUser?: boolean;
  status?: "Seating now" | "Waiting" | "Next";
};

type QueueProps = {
  parties: QueueParty[];
  estimatedWait: string;
  onCheckTiming: () => void;
};

export default function Queue({
  parties,
  estimatedWait,
  onCheckTiming,
}: QueueProps) {
  const reducedMotion = useReducedMotion();
  const aheadCount = Math.max(
    0,
    parties.findIndex((party) => party.isUser),
  );

  return (
    <div className="flow-root w-88 select-none">
      <p className="sr-only" role="status" aria-atomic="true">
        {aheadCount} parties ahead of you.
      </p>
      <ol
        aria-label="Restaurant waitlist"
        className="relative mx-4 mb-4 flex flex-col gap-2"
      >
        <AnimatePresence initial={false}>
          {parties.map((party, index) => (
            <motion.li
              key={party.id}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                layout: { duration: reducedMotion ? 0 : 0.25, ease: "easeOut" },
                opacity: { duration: reducedMotion ? 0 : 0.15 },
              }}
              className={`flex items-center gap-3 rounded-lg px-3 py-1 text-xs text-white`}
            >
              <span
                className={`w-3 tabular-nums ${party.isUser && "text-[#f7cc05]"}`}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className="flex flex-1 flex-col">
                <span
                  className={`font-medium ${party.isUser && "text-[#f7cc05]"}`}
                >
                  {party.name}
                </span>
                <span className="text-neutral-400">Party of {party.size}</span>
              </span>
              <span
                className={`shrink-0 text-right ${party.isUser ? "text-[#f7cc05]" : "text-neutral-400"}`}
              >
                {party.isUser ? estimatedWait : party.status}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      <div className="mx-4 mb-4 flex items-center justify-between gap-3">
        <span className="text-xs text-neutral-400">
          Movie starts in <span className="text-white">28 mins</span>
        </span>
        <button
          type="button"
          onClick={onCheckTiming}
          className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Check timing
        </button>
      </div>
    </div>
  );
}
