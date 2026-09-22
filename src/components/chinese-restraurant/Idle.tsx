import { motion, type Transition } from "motion/react";

type IdleProps = {
  onCheckIn: () => void;
  layoutTransition: Transition;
};

const Idle = ({ onCheckIn, layoutTransition }: IdleProps) => {
  return (
    <div
      className="relative mr-2 flex h-9 cursor-pointer items-center justify-between gap-24"
      onClick={onCheckIn}
    >
      <motion.div
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
      </motion.div>

      <motion.span
        layoutId="wait-time"
        transition={layoutTransition}
        className="text-[10px] text-[#f7cc05]"
      >
        ~10
      </motion.span>
    </div>
  );
};

export default Idle;
