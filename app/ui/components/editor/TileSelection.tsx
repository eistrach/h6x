import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { Tool } from "~/routes/app/editor/$id";

import CellPreview from "../map/CellPreview";
import CellView from "../map/CellView";

export default function TileSelection({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
}) {
  const defaultStyles = "w-8 h-8 rounded-full";
  const defaultShadowStyles =
    "absolute w-full h-full -z-10 translate-x-1 translate-y-1 rounded-full";
  const checkedShadowStyles = "bg-primary-200";

  return (
    <RadioGroup value={selectedTool} onChange={setSelectedTool}>
      <div className="w-full flex items-center justify-center mt-2 py-1 px-4">
        <div className="flex gap-2">
          <RadioGroup.Option value="add">
            {({ checked }) => (
              <div className="relative flex">
                <div
                  className={clsx(
                    defaultShadowStyles,
                    checked ? checkedShadowStyles : "bg-gray-200"
                  )}
                />
                <div className={clsx(defaultStyles, "bg-gray-700")} />
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="remove">
            {({ checked }) => (
              <div className="relative flex">
                <div
                  className={clsx(
                    defaultShadowStyles,
                    checked ? checkedShadowStyles : "bg-gray-200"
                  )}
                />
                <div className={clsx(defaultStyles, "bg-white")} />
              </div>
            )}
          </RadioGroup.Option>
        </div>
      </div>
    </RadioGroup>
  );
}
