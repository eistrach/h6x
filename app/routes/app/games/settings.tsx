import { ArrowLeftIcon } from "@heroicons/react/solid";
import { Form } from "@remix-run/react";
import { motion } from "framer-motion";
import { Button } from "~/ui/components/base/Button";
import { InputTheme } from "~/ui/components/base/InputTheme";
import { Link } from "~/ui/components/base/Link";

const SettingsPage = () => {
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
          className=" flex flex-col justify-between h-full  gap-2 "
        >
          <p className="text-xl font-bold">Settings</p>
          <div className="flex justify-between items-center">
            <Link
              motionProps={{ layoutId: "leftButton" }}
              theme={InputTheme.OutlinedBlack}
              LeftIcon={ArrowLeftIcon}
              to="/app/games"
            >
              Back
            </Link>
            <Button layoutId="rightButton" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </motion.div>
    </>
  );
};

export default SettingsPage;
