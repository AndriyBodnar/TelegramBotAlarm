import axios from "axios";

export const randomNumber = (start, end) => {
  return +(Math.random() * (end - start) + start).toFixed(0);
};


export function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

export async function axiosHelp(url) {
  let { data } = await axios.get(url);
  return data;
}

export async function setHourFunc(func, hours, min) {
  var now = new Date();
  var ms =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      min,
      0,
      0
    ) - now;
  if (ms < 0) {
    ms += 86400000;
  }

  setTimeout(func, ms);
}

export function getWatch(min) {
  switch (true) {
    case min === 0 || min < 5:
      return "🕛";
    case min === 5 || min < 10:
      return "🕐";
    case min === 10 || min < 15:
      return "🕑";
    case min === 15 || min < 20:
      return "🕒";
    case min === 20 || min < 25:
      return "🕓";
    case min === 25 || min < 30:
      return "🕔";
    case min === 30 || min < 35:
      return "🕕";
    case min === 35 || min < 40:
      return "🕖";
    case min === 40 || min < 45:
      return "🕗";
    case min === 45 || min < 50:
      return "🕘";
    case min === 50 || min < 55:
      return "🕙";
    case min === 55 || min < 60:
      return "🕚";
  }
}
