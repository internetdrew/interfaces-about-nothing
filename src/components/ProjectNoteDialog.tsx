import { Dialog } from "@base-ui/react/dialog";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { useState, type ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export function ProjectNoteDialog({ title, children }: Props) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const transition: Transition = {
    duration: shouldReduceMotion ? 0 : 0.24,
    ease: [0.165, 0.84, 0.44, 1],
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={`Read notes for ${title}`}
        className="-ml-2 grid size-11 cursor-pointer place-items-center rounded-md outline-0"
      >
        <NoteIcon />
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal keepMounted>
            <Dialog.Backdrop
              className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-[2px]"
              render={
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0, delay: 0 },
                  }}
                  transition={transition}
                />
              }
            />
            <Dialog.Viewport className="fixed inset-0 z-50 grid place-items-center p-4">
              <Dialog.Popup
                className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col rounded-xl bg-stone-50 p-4 text-neutral-900 shadow-xl ring-[0.5px] ring-stone-400/50 outline-none"
                render={
                  <motion.div
                    style={{ transformOrigin: "50% 100%" }}
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            transform:
                              "translateY(calc(50dvh - 2rem)) perspective(600px) rotateX(-55deg) scale(0.06)",
                          }
                    }
                    animate={{
                      opacity: 1,
                      transform:
                        "translateY(0px) perspective(600px) rotateX(0deg) scale(1)",
                      transition: {
                        duration: shouldReduceMotion ? 0 : 0.5,
                        delay: shouldReduceMotion ? 0 : 0.3,
                        ease: [0.76, 0, 0.24, 1],
                        opacity: {
                          duration: shouldReduceMotion ? 0 : 0.1,
                          delay: shouldReduceMotion ? 0 : 0.3,
                        },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0, delay: 0 },
                    }}
                    transition={transition}
                  />
                }
              >
                <Dialog.Close className="none absolute top-1.5 right-1.5 grid size-11 shrink-0 cursor-pointer place-items-center rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-stone-600/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="size-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Dialog.Close>
                <div className="mt-2.5 mb-3 flex shrink-0 items-center justify-between gap-4">
                  <Dialog.Title className="title text-lg font-semibold">
                    A Note on {title}
                  </Dialog.Title>
                </div>
                <div className="min-h-0 text-sm leading-relaxed font-[460] text-stone-700 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-6 [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:font-semibold [&_li+li]:mt-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p+p]:mt-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
                  {children}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="sig text-[22px] text-stone-700">
                    -Andrew
                  </span>

                  <div className="flex items-center">
                    <a
                      href="https://x.com/internet_drew"
                      className="grid size-11 place-items-center hover:fill-[#1c4b9c]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        className="size-3.5"
                      >
                        <path d="M18.42,14.009L27.891,3h-2.244l-8.224,9.559L10.855,3H3.28l9.932,14.455L3.28,29h2.244l8.684-10.095,6.936,10.095h7.576l-10.301-14.991h0Zm-3.074,3.573l-1.006-1.439L6.333,4.69h3.447l6.462,9.243,1.006,1.439,8.4,12.015h-3.447l-6.854-9.804h0Z"></path>
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/internetdrew/"
                      className="grid size-11 place-items-center hover:fill-[#1c4b9c]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        className="size-4"
                      >
                        <path
                          d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z"
                          fill-rule="evenodd"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

const NoteIcon = () => {
  return (
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
      className="size-4 stroke-stone-600"
      aria-hidden="true"
    >
      <path d="M2 6h4" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
      <path d="M2 18h4" />
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M9.5 8h5" />
      <path d="M9.5 12H16" />
      <path d="M9.5 16H14" />
    </svg>
  );
};
