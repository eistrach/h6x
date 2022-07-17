export const PlayerTimeoutJob = {
  cron: "*/60 * * * * *",
  task: () => {
    console.info("Checking for timed out players");
  },
};
