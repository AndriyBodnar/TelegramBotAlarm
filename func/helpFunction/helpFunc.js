import axios from "axios";
import fs from "fs";

export const randomNumber = (start, end) => {
  return +(Math.random() * (end - start) + start).toFixed(0);
};

export function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

export async function axiosHelp(url) {
  let { data } = await axios
    .get(url)
    .catch((e) => console.log("AXIOS HELP", e));
  return data;
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

export function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
}

// const imageRef = ref(storage, "image/deadstat.png");
// var base64str = base64_encode(`assets/img/deadstat.png`);
// console.log(base64str);
// uploadString(imageRef, base64str, "base64").then((snapshot) => {
//   getDownloadURL(snapshot.ref).then((url) => {
//     console.log(url);
//   });
//   console.log("Uploaded a base64url string!");
// });
