/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "../base/Link";
import AwardSvg from "../svg/AwardSvg";
import { InputTheme } from "../base/InputTheme";
import { EmojiSadIcon } from "@heroicons/react/solid";
import { ClientOnly } from "remix-utils";
import Confetti from "react-dom-confetti";

const confettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 20,
  elementCount: 50,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: "10px",
  height: "10px",
  perspective: "500px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};

export default function GameFinishedOverlay({
  won,
  lost,
}: {
  won: boolean;
  lost: boolean;
}) {
  const [showConfetti, setShowConfetti] = useState(false);
  const title = won ? "Congratulations!" : "Try again!";
  const description = won
    ? "You have destroyed all your enemies."
    : "Unfortunately you were destroyed.";

  useEffect(() => {
    setShowConfetti(true);
  }, [won]);

  console.log(showConfetti);
  return (
    <Transition.Root show={won || lost} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className=" mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary-100">
                    <ClientOnly fallback={<div />}>
                      {() => (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center items-start">
                          <Confetti
                            active={showConfetti}
                            config={confettiConfig}
                          />
                        </div>
                      )}
                    </ClientOnly>
                    {won ? (
                      <>
                        <AwardSvg
                          className="h-10 w-10 fill-primary-600 stroke-primary-600"
                          aria-hidden="true"
                        />
                      </>
                    ) : (
                      <EmojiSadIcon
                        className="h-10 w-10  text-primary-600 "
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl leading-6 font-medium text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-lg text-gray-500">{description}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6  ">
                  <Link to="/app/games" theme={InputTheme.Stretched}>
                    Go back
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
function useRef(arg0: null) {
  throw new Error("Function not implemented.");
}
