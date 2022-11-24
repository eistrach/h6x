import { prisma } from "~/lib/db.server";
import { kickPlayer } from "./game/kickPlayer/index.server";

export const kickTimedOutPlayers = async () => {
  const timeouts = await prisma.playerTimeout.findMany({
    include: {
      player: true,
      game: true,
    },
  });

  const now = new Date();

  let kicked = 0;
  for (const timeout of timeouts) {
    if (now > timeout.timeoutAt) {
      try {
        await kickPlayer(timeout.game.id, timeout.player.id);
        console.log(`Kicked ${timeout.player.id} from ${timeout.game.id}`);
        kicked++;
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (kicked) {
    console.info(`Kicked ${kicked} players`);
  }
};
