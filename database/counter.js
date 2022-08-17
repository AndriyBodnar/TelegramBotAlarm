import { state } from "../index.js";
import { setValueCounter } from "./firebaseRequest.js";

export async function counterForDb(name, chatId) {
  if (state.counter === null) state.counter = { name: { value: 0 } };
  if (state.counter[name] === undefined) state.counter[name] = { value: 0 };
  if (state.counter[name][chatId] === undefined)
    state.counter[name][chatId] = 0;

  state.counter[name].value++;
  state.counter[name][chatId]++;
  await setValueCounter(
    state.counter[name],
    name,
    state.counter[name].value,
    chatId,
    state.counter[name][chatId]
  );
}
