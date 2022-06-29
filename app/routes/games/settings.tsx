import { Listbox } from "@headlessui/react";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { createGame } from "~/domain/game.server";
import { getPublishedMaps } from "~/domain/map.server";
import { requireUser } from "~/session.server";
import { ActionArgs, LoaderArgs, UnpackData } from "~/utils";
import { validateForm } from "~/utils.server";

const SettingsPage = () => {
  return (
    <motion.div
      layoutId="openSettings"
      className="fixed z-50 left-4 right-4 top-16 mt-4 bottom-3 shadow-2xl border-2 border-black bg-primary-200 "
    >
      <Form method="post" className=" flex flex-col  gap-2 ">
        Settings
        <button type="submit">Submit</button>
      </Form>
    </motion.div>
  );
};

export default SettingsPage;
