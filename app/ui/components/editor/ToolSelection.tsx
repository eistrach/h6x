import { RadioGroup } from "@headlessui/react";
import { PencilSquareIcon, PencilIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export default function ToolSelection({
  isFill,
  toggleFill,
}: {
  isFill: boolean;
  toggleFill: () => void;
}) {
  const defaultStyles = "w-8 h-8 p-1 bg-white";
  const defaultShadowStyles =
    "absolute w-full h-full -z-10 translate-x-1 translate-y-1";
  const checkedShadowStyles = "bg-primary-200";

  return (
    <RadioGroup value={isFill} onChange={toggleFill}>
      <div className="w-full flex items-center justify-center mt-2 py-1 px-4">
        <div className="flex gap-2">
          <RadioGroup.Option value={false}>
            {({ checked }) => (
              <div className="relative flex">
                <div
                  className={clsx(
                    defaultShadowStyles,
                    checked ? checkedShadowStyles : "bg-gray-200"
                  )}
                />
                <PencilIcon className={defaultStyles} />
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value={true}>
            {({ checked }) => (
              <div className="relative flex">
                <div
                  className={clsx(
                    defaultShadowStyles,
                    checked ? checkedShadowStyles : "bg-gray-200"
                  )}
                />
                <PencilSquareIcon className={defaultStyles} />
              </div>
            )}
          </RadioGroup.Option>
        </div>
      </div>
    </RadioGroup>
  );
}
