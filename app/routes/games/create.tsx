import { Listbox } from "@headlessui/react";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";
import { createGame } from "~/domain/game.server";
import { getMaps } from "~/domain/map.server";
import { requireUser } from "~/session.server";
import { ActionArgs, LoaderArgs, UnpackData } from "~/utils";
import { validateForm } from "~/utils.server";

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

type LoaderData = UnpackData<typeof getMaps>;
export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const maps = await getMaps();
  return maps;
};

const CreateGamePage = () => {
  const maps = useLoaderData<LoaderData>();

  console.log(typeof maps);

  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);

  const getMapForId = (id: string | null) => {
    return maps.find((map) => map.id === id);
  };

  return (
    <Form method="post" className="flex flex-col  gap-2 ">
      Create Map{" "}
      <Listbox
        name="selectedMapId"
        value={selectedMapId}
        onChange={setSelectedMapId}
      >
        <Listbox.Button>
          {getMapForId(selectedMapId)?.name || "Select a map"}
        </Listbox.Button>
        <Listbox.Options>
          {maps.map((map) => (
            <Listbox.Option key={map.id} value={map.id}>
              {map.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
      <button type="submit">Submit</button>
    </Form>
  );
};

export default CreateGamePage;