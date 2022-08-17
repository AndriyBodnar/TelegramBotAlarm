import { deadStat } from "./deadStat.js";

export function callDeadStat(text, chatId, msgId) {
  if (text.includes("/deadstat")) {
    return deadStat(chatId, msgId);
  }
}
