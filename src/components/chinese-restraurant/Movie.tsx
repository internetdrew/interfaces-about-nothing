type MovieProps = {
  onBack: () => void;
  onLeaveQueue: () => void;
};

export default function Movie({ onBack, onLeaveQueue }: MovieProps) {
  return (
    <div className="flow-root w-88 text-white">
      <div className="relative mx-4 mt-5 flex items-center justify-between gap-3">
        <div className="text-center">
          <p className="text-xs text-neutral-400">Est. seating</p>
          <p className="text-2xl leading-tight tabular-nums">7:42</p>
        </div>
        <span
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 text-xl text-neutral-600"
        >
          →
        </span>
        <div className="text-center">
          <p className="text-xs text-neutral-400">Movie starts</p>
          <p className="text-2xl leading-tight tabular-nums">8:00</p>
        </div>
      </div>
      <p className="mx-4 mt-4 mb-6 rounded-xl bg-[#250b08] p-3 text-xs leading-relaxed text-[#ff9b90]">
        <span className="text-white">Probably not.</span> With a 12-minute trip,
        you’d have about 6 minutes to eat.
      </p>
      <div className="mx-4 mb-4 flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl bg-neutral-800 px-4 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onLeaveQueue}
          className="min-h-11 flex-1 rounded-xl bg-[#ff453a] px-4 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Leave waitlist
        </button>
      </div>
    </div>
  );
}
