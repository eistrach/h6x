import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { z } from "zod";
import { Button } from "~/ui/components/base/Button";
import { Link } from "~/ui/components/base/Link";
import { InputTheme } from "~/ui/components/base/InputTheme";
import { requireUser } from "~/lib/auth/session.server";
import { validateForm } from "~/lib/validation.server";
import {
  SnapItem,
  SnapList,
  useDragToScroll,
  useVisibleElements,
} from "react-snaplist-carousel";
import { createNewGame } from "~/game/game.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { getAllPublishedMaps } from "~/game/map.servert";

const Schema = z.object({
  mapId: z.string().min(1),
  minutesUntilTimeout: z.preprocess(Number, z.number()),
});
export const action = async ({ request }: ActionArgs) => {
  const [user, result] = await Promise.all([
    requireUser(request),
    validateForm(request, Schema),
  ]);

  if (!result.success) {
    return result;
  }

  await createNewGame(user, result.data);

  return redirect(`/games`);
};

export const loader = async ({ request }: LoaderArgs) => {
  await requireUser(request);
  const maps = await getAllPublishedMaps();
  return typedjson({ maps });
};

const CreateGamePage = () => {
  const { maps } = useTypedLoaderData<typeof loader>();
  const mapList = useRef(null);
  const selectedMapIndex = useVisibleElements(
    {
      ref: mapList,
      debounce: 10,
    },
    (elements) => elements[0]
  );

  const selectedMapId = maps[selectedMapIndex]?.id;

  const { isDragging } = useDragToScroll({ ref: mapList });

  return (
    <>
      <motion.div
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
        }}
        className="absolute min-h-screen w-full bg-gray-800/40 z-10 top-0"
      />
      <motion.div
        layoutId="background"
        className="fixed z-50 mt-4 left-0 right-0 top-32 bottom-0 bg-gray-200 rounded-t-xl px-6 py-2.5"
      >
        <Form
          method="post"
          className=" flex flex-col justify-between h-full  gap-2 x"
        >
          <p className="text-xl font-bold">Create Map</p>
          <div className="flex w-full items-center flex-col justify-between h-full">
            <SnapList direction="horizontal" ref={mapList}>
              {" "}
              {maps?.map((map) => (
                <SnapItem
                  key={map.id}
                  snapAlign="center"
                  margin={{
                    left: "14px",
                    right: "14px",
                  }}
                  height="auto"
                  width="auto"
                >
                  <div className="flex flex-col items-center justify-center">
                    {/* <GamePreview
                      cells={map.cells}
                      className="w-64 h-64 bg-gradient-to-br shadow-md from-primary-200/80 to-primary-400/80  rounded-full"
                      cellClassName="stroke-gray-900 fill-white"
                    /> */}
                    <div className="w-64 h-64 bg-gradient-to-br shadow-md from-primary-200/80 to-primary-400/80  rounded-full"></div>
                    <p className="mt-2 font-semibold">{map.name}</p>
                  </div>
                </SnapItem>
              ))}
            </SnapList>

            {selectedMapId && (
              <input type="hidden" name="mapId" value={selectedMapId} />
            )}
            <label>
              Timeout Minutes
              <input
                className="p-2 m-2"
                name="minutesUntilTimeout"
                defaultValue="10"
              />
            </label>
          </div>
          <div className="flex justify-between items-center">
            <Link
              motionProps={{ layoutId: "leftButton" }}
              theme={InputTheme.OutlinedBlack}
              LeftIcon={ArrowLeftIcon}
              to="/games"
            >
              Back
            </Link>
            <Button layoutId="rightButton" type="submit">
              Create
            </Button>
          </div>
        </Form>
      </motion.div>
    </>
  );
};

export default CreateGamePage;
