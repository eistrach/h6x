import { PlayerTimeoutJob } from "./playerTimeoutJob.server";
import CronJob from "node-cron";

export const CronJobs = [PlayerTimeoutJob];

let started = false;

export const startCronjobs = () => {
  if (started) return;
  started = true;
  console.log("Scheduling cronjobs");
  CronJobs.forEach((cronjob) => {
    const scheduledJob = CronJob.schedule(cronjob.cron, async () => {
      try {
        await cronjob.task();
      } catch (e) {
        console.error(e);
      }
    });
    scheduledJob.start();
  });
};
