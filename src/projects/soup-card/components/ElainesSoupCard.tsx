import { useId, useRef, useState } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import SoupCardBack from "./SoupCardBack";
import elaine from "../images/elaine.webp";
import "./ElainesSoupCard.css";

const fields = [
  { label: "Name", writing: "Elaine Benes" },
  { label: "Member No.", writing: "EB-0716" },
  { label: "Member since", writing: "1995" },
];

// Near-critical damping keeps pointer tracking responsive without a wobbling settle.
const tiltSpring = { stiffness: 300, damping: 30, mass: 0.6 };
const maxTilt = 7.5;

const ElainesSoupCard = () => {
  const steamClipId = useId();
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const showFlipHint = !hasFlipped && !reduceMotion;
  const rotateX = useSpring(0, tiltSpring);
  const rotateY = useSpring(0, tiltSpring);

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const updateTilt = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      reduceMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      !surfaceRef.current
    )
      return;

    // Measure the stationary surface so rotation cannot feed back into pointer input.
    const rect = surfaceRef.current.getBoundingClientRect();
    const x = Math.max(
      -1,
      Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
    );
    const y = Math.max(
      -1,
      Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1),
    );

    rotateX.set(-y * maxTilt);
    rotateY.set(x * maxTilt);
  };

  return (
    <div
      ref={surfaceRef}
      className="soup-card-surface cursor-pointer"
      onPointerEnter={updateTilt}
      onPointerMove={updateTilt}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
    >
      <motion.div
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
        }}
        className="soup-card-tilt"
      >
        <motion.div
          className="soup-card-rotor"
          initial={{ rotateY: 0 }}
          animate={{
            rotateY: showFlipHint ? [0, -7, 7, 0] : isFlipped ? 180 : 0,
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : showFlipHint
                ? {
                    type: "tween",
                    duration: 0.9,
                    ease: "easeInOut",
                    times: [0, 0.3, 0.65, 1],
                    delay: 5,
                    repeat: Infinity,
                    repeatDelay: 4.1,
                  }
                : {
                    type: "spring",
                    stiffness: 140,
                    damping: 22,
                    mass: 0.8,
                    // An opposing impulse creates the wind-up within the same spring.
                    velocity: isFlipped ? -1200 : 1200,
                  }
          }
        >
          <div
            className="soup-card soup-card-face rounded-2xl"
            aria-hidden={isFlipped}
            inert={isFlipped}
          >
            <div className="soup-card-content">
              <header>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="soup-card-icon lucide lucide-soup preview-icon size-6"
                    aria-hidden="true"
                  >
                    <defs>
                      <clipPath id={steamClipId} clipPathUnits="userSpaceOnUse">
                        <rect x="0" y="-8" width="24" height="19" />
                      </clipPath>
                    </defs>
                    <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
                    <path d="M7 21h10" />
                    <path d="M19.5 12 22 6" />
                    <g clipPath={`url(#${steamClipId})`}>
                      <path
                        className="soup-steam soup-steam-right"
                        d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62"
                      />
                      <path
                        className="soup-steam soup-steam-center"
                        d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62"
                      />
                      <path
                        className="soup-steam soup-steam-left"
                        d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62"
                      />
                    </g>
                  </svg>
                  <span className="soup-title text-2xl font-bold tracking-wide sm:text-3xl">
                    Hot Soup
                  </span>
                </div>
                <p className="soup-membership text-xs font-semibold sm:text-sm">
                  Membership Card
                </p>
              </header>

              <div className="soup-card-stamp">
                <p className="soup-card-stamp-title">Probationary</p>
                <p className="soup-card-stamp-note">Bread privileges withheld.</p>
              </div>

              <div className="mt-auto">
                {fields.map((field) => (
                  <div
                    key={field.label}
                    className="soup-card-field flex items-center gap-1.5"
                  >
                    <span className="soup-mono text-sm font-medium capitalize">
                      {field.label}:
                    </span>
                    <div className="flex-1 border-b border-stone-500 text-center">
                      <p className="soup-writing text-2xl">{field.writing}</p>
                    </div>
                  </div>
                ))}
                <p className="soup-card-footer soup-mono text-[8px] font-medium sm:text-xs">
                  Present before ordering or <strong>no soup for you</strong>!
                </p>
              </div>
            </div>

            <div className="soup-card-photo-frame">
              <img
                className="soup-card-portrait"
                src={elaine.src}
                width={elaine.width}
                height={elaine.height}
                alt="Elaine Benes"
                decoding="async"
              />
            </div>
          </div>
          <div
            className="soup-card soup-card-face soup-card-back rounded-2xl"
            aria-hidden={!isFlipped}
            inert={!isFlipped}
          >
            <SoupCardBack />
          </div>
        </motion.div>
      </motion.div>
      <button
        type="button"
        className="soup-card-flip-button"
        aria-label={
          isFlipped
            ? "Show front of membership card"
            : "Show back of membership card"
        }
        aria-pressed={isFlipped}
        onClick={() => {
          setHasFlipped(true);
          setIsFlipped((flipped) => !flipped);
        }}
      />
    </div>
  );
};

export default ElainesSoupCard;
