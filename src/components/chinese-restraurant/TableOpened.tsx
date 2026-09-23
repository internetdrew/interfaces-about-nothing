import { useEffect, useRef, useState } from "react";

type TableOpenedProps = {
  onRejoin: () => void;
  onExpire: () => void;
};

export default function TableOpened({ onRejoin, onExpire }: TableOpenedProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) onExpire();
  }, [onExpire, secondsLeft]);

  return (
    <div className="flex min-h-44 w-88 flex-col items-center px-4 pt-5 pb-4 text-center text-white">
      <div
        className="mb-2 grid size-11 place-items-center rounded-full bg-[#071d0d] text-[#22d65c]"
        aria-hidden="true"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 3v6a3 3 0 0 0 6 0V3M8 3v18M19 3c-3 0-4 4-4 7v3h4M19 3v18" />
        </svg>
      </div>
      <h2
        ref={heading}
        tabIndex={-1}
        className="text-2xl font-medium tracking-tight outline-none"
      >
        A table just opened.
      </h2>
      <p className="mt-1 text-sm text-neutral-400">It would’ve been yours.</p>
      <button
        type="button"
        onClick={onRejoin}
        className="mt-6 min-h-11 w-full rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <span>Rejoin waitlist · </span>
        <span
          key={secondsLeft}
          className="t-digit-group is-animating tabular-nums"
          aria-live="polite"
          aria-label={`${secondsLeft} seconds`}
        >
          <span className="t-digit">{secondsLeft}</span>
        </span>
      </button>
    </div>
  );
}
