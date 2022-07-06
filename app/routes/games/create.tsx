import { ArrowLeftIcon } from "@heroicons/react/solid";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { Button } from "~/components/base/Button";
import { Link } from "~/components/base/Link";
import { InputTheme } from "~/components/base/InputTheme";
import { createGame } from "~/domain/game.server";
import { getPublishedMaps } from "~/domain/map.server";
import { requireUser } from "~/auth/session.server";
import { ActionArgs, LoaderArgs, UnpackData } from "~/utils";
import { validateForm } from "~/utils.server";
import { Carousel } from "react-responsive-carousel";
import GamePreview from "~/components/map/GamePreview";
import carouselStyles from "react-responsive-carousel/lib/styles/carousel.min.css";
import { LinksFunction } from "@remix-run/react/routeModules";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: carouselStyles },
];

const Schema = z.object({
  selectedMapId: z.string().min(1),
});
export const action = async ({ request }: ActionArgs) => {
  const [user, result] = await Promise.all([
    requireUser(request),
    validateForm(request, Schema),
  ]);

  if (!result.success) {
    return result;
  }

  await createGame(user.id, result.data.selectedMapId);
  return redirect(`/games`);
};

type LoaderData = UnpackData<typeof getPublishedMaps>;
export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const maps = await getPublishedMaps();
  return maps;
};

const CreateGamePage = () => {
  const maps = useLoaderData<LoaderData>();
  const [selectedMapId, setSelectedMapId] = useState<string | null>(
    maps ? maps[0].id : null
  );

  const getMapForId = (id: string | null) => {
    return maps?.find((map) => map.id === id) || null;
  };

  const handleCarouselChange = (index: number) => {
    const mapId = maps?.[index].id;
    setSelectedMapId(mapId);
  };

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
          <div>
            <Carousel
              onChange={handleCarouselChange}
              showIndicators={false}
              showStatus={false}
              showArrows={true}
            >
              {maps?.map((map) => (
                <div key={map.id} className="p-10">
                  <GamePreview
                    cells={map.cells}
                    className="bg-gradient-to-br shadow-md from-primary-200/80 to-primary-400/80  rounded-full"
                    cellClassName="stroke-gray-900 fill-white"
                  />
                  <p className="mt-2 font-semibold">{map.name}</p>
                </div>
              ))}
            </Carousel>
            {selectedMapId && (
              <input type="hidden" name="selectedMapId" value={selectedMapId} />
            )}
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
