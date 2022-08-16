import axios from "axios";
import { bot } from "../../index.js";

export async function getInfoFirebase(state, prop) {
  await axios
    .get(
      `https://alarmbot-867dc-default-rtdb.europe-west1.firebasedatabase.app/${prop}.json`,
      {
        headers: {
          Connection: "keep-alive",
          "Accept-Encoding": "",
        },
      }
    )
    .then((res) => {
      state[prop] = res.data;
    });
}

export async function addChatFirebase(state, obl, chatId = null) {
  console.log(state[obl]);
  await axios.put(
    `https://alarmbot-867dc-default-rtdb.europe-west1.firebasedatabase.app/chatsID.json`,

    state[obl] == null
      ? { ...state, [`${obl}`]: [chatId] }
      : { ...state, [`${obl}`]: [...state[obl], chatId] },
    {
      headers: {
        Connection: "keep-alive",
        "Accept-Encoding": "",
      },
    }
  );
}

export async function deleteChatFirebase(state, obl, arr) {
  await axios.put(
    `https://alarmbot-867dc-default-rtdb.europe-west1.firebasedatabase.app/chatsID.json`,

    { ...state, [`${obl}`]: arr },
    {
      headers: {
        Connection: "keep-alive",
        "Accept-Encoding": "",
      },
    }
  );
}

export async function setValueEnableAlarm(state, a, b) {
  await axios.put(
    `https://alarmbot-867dc-default-rtdb.europe-west1.firebasedatabase.app/enableAlarm.json`,
    { ...state, [a]: b },
    {
      headers: {
        Connection: "keep-alive",
        "Accept-Encoding": "",
      },
    }
  );
}

export async function commandsFirebase(state) {
  await getInfoFirebase(state, "commands");
  await bot.setMyCommands(state.commands);
}
