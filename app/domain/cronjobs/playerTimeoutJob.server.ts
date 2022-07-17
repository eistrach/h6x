import { kickTimedOutPlayers } from "../timeouts.server";

export const PlayerTimeoutJob = {
  cron: "* */1 * * * *",
  task: () => {
    console.info("Checking for timed out players...");
    return kickTimedOutPlayers();
  },
};
