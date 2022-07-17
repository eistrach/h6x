import { PlayerTimeoutJob } from "./PlayerTimeoutJob.server";
import CronJob from "node-cron";

export const CronJobs = [PlayerTimeoutJob];

let started = false;

export const startCronjobs = () => {
  if (started) return;
  started = true;
  console.log("Scheduling cronjobs");
  CronJobs.forEach((cronjob) => {
    const scheduledJob = CronJob.schedule(cronjob.cron, cronjob.task);
    scheduledJob.start();
  });
};
