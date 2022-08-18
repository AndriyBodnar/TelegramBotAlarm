import pkg from "canvas";
import "dotenv/config";
import { bot, state } from "../../index.js";
import { parse } from "node-html-parser";
import { setValueFirebase } from "../../database/firebaseRequest.js";
import { axiosHelp } from "../helpFunction/helpFunc.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../database/firebase.js";
import { counterForDb } from "../../database/counter.js";

const { createCanvas, loadImage, registerFont } = pkg;

export async function deadStat(chatId, msgId) {
  await counterForDb(deadStat.name, chatId).catch((e) => console.log(e));

  let response = await axiosHelp(process.env.URL_DEADSTAT);
  let parser = parse(response).querySelector(`.casualties`);
  let dead = state.dead;
  dead["Оновлено"] = parse(response)
    .querySelector(`span.black`)
    .textContent.toString();

  if (state.deadState.value !== dead["Оновлено"]) {
    bot.sendChatAction(chatId, "upload_photo");
    await setValueFirebase(
      state.deadState,
      "value",
      dead["Оновлено"],
      "deadState"
    );

    dead["Особовийсклад"]["count"] = parser
      .querySelectorAll(`li`)
      [parser.querySelectorAll(`li`).length - 1].textContent.split(", ")
      .slice(0, 1)
      .join("")
      .split(" ")
      .slice(3, 6)[0];

    dead["Особовийсклад"]["add"] = parser
      .querySelectorAll(`li`)
      [parser.querySelectorAll(`li`).length - 1].textContent.split(", ")
      .slice(0, 1)
      .join("")
      .split(" ")
      .slice(3, 6)[2];

    for (let i = 0; i < parser.querySelectorAll(`li`).length - 1; i++) {
      dead[
        parser
          .querySelectorAll(`li`)
          [i].textContent.toString()
          .split("—")[0]
          .split(" ")
          .join("")
          .trim()
      ] = { count: null, add: null };
      if (
        parser
          .querySelectorAll(`li`)
          [i].textContent.toString()
          .split("—")[1]
          .trim()
          .split(" ").length > 1
      ) {
        dead[
          parser
            .querySelectorAll(`li`)
            [i].textContent.toString()
            .split("—")[0]
            .split(" ")
            .join("")
            .trim()
        ]["count"] = parser
          .querySelectorAll(`li`)
          [i].textContent.toString()
          .split("—")[1]
          .trim()
          .split(" ")[0];
        dead[
          parser
            .querySelectorAll(`li`)
            [i].textContent.toString()
            .split("—")[0]
            .split(" ")
            .join("")
            .trim()
        ]["add"] = parser
          .querySelectorAll(`li`)
          [i].textContent.toString()
          .split("—")[1]
          .trim()
          .split(" ")[1];
      } else {
        dead[
          parser
            .querySelectorAll(`li`)
            [i].textContent.toString()
            .split("—")[0]
            .split(" ")
            .join("")
            .trim()
        ]["count"] = parser
          .querySelectorAll(`li`)
          [i].textContent.toString()
          .split("—")[1]
          .trim()
          .split(" ")[0];
      }
    }

    function getAddCount(info) {
      return !!dead[info]["add"] ? dead[info]["add"] : "";
    }

    const width = 1150;
    const height = 850;

    registerFont("assets/fonts/Montserrat-Regular.ttf", {
      family: "Montserrat",
    });

    registerFont("assets/fonts/Anton-Regular.ttf", {
      family: "Montserrat",
    });
    registerFont("assets/fonts/Exo2-Regular.ttf", {
      family: "Exo 2",
    });

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    context.fillStyle = "#F5FAFA";
    context.fillRect(0, 0, width, height);

    context.textBaseline = "top";
    context.textAlign = "center";
    context.fillStyle = "#000";

    context.font = `sans-serif 25pt Montserrat`;
    let text = "Alarm bot";
    const textWidth = context.measureText(text).width;

    context.fillRect(150 - textWidth / 2 - 10, 45, textWidth + 20, 60);
    context.fillStyle = "#FFFFFF";

    context.fillText(text, 150, 50);

    context.fillStyle = "#000";
    context.fillText("Втрати свинособак", 222, 110);
    context.fillRect(
      55,
      160,
      context.measureText("Втрати свинособак").width + 137,
      4
    );

    context.fillText("Оновлено:", 950, 50);
    context.font = `sans-serif 40pt Exo 2`;
    context.fillText(dead["Оновлено"], 950, 90);

    context.fillStyle = "#000";
    context.fillRect(350, 200, 5, 600);
    context.fillRect(720, 200, 5, 600);

    context.font = `sans-serif 35pt Exo 2`;

    context.fillText(dead["Особовийсклад"]["count"], 265, 210);
    context.fillText(dead["Літаки"]["count"], 265, 370);
    context.fillText(dead["Танки"]["count"], 265, 530);
    context.fillText(dead["ББМ"]["count"], 265, 680);
    context.fillText(dead["РСЗВ"]["count"], 630, 210);
    context.fillText(dead["БПЛА"]["count"], 630, 370);
    context.fillText(dead["Гелікоптери"]["count"], 630, 530);
    context.fillText(dead["ЗасобиППО"]["count"], 630, 680);
    context.fillText(dead["Автомобілітаавтоцистерни"]["count"], 1040, 210);
    context.fillText(dead["Крилатіракети"]["count"], 1040, 370);
    context.fillText(dead["Гармати"]["count"], 1040, 530);
    context.fillText(dead["Кораблі(катери)"]["count"], 1040, 680);

    context.fillStyle = "red";
    context.font = `sans-serif 23pt Exo 2`;

    context.fillText(getAddCount("Особовийсклад"), 265, 265);
    context.fillText(getAddCount("Літаки"), 265, 425);
    context.fillText(getAddCount("Танки"), 265, 585);
    context.fillText(getAddCount("ББМ"), 265, 735);
    context.fillText(getAddCount("РСЗВ"), 630, 265);
    context.fillText(getAddCount("БПЛА"), 630, 425);
    context.fillText(getAddCount("Гелікоптери"), 630, 585);
    context.fillText(getAddCount("ЗасобиППО"), 630, 735);
    context.fillText(getAddCount("Автомобілітаавтоцистерни"), 1040, 265);
    context.fillText(getAddCount("Крилатіракети"), 1040, 425);
    context.fillText(getAddCount("Гармати"), 1040, 585);
    context.fillText(getAddCount("Кораблі(катери)"), 1040, 735);

    await loadImage(
      "https://firebasestorage.googleapis.com/v0/b/alarmbot-867dc.appspot.com/o/icon%2FiconPigDog.jpg?alt=media&token=3ead10e3-66fb-4960-845c-dc62c629dc32"
    ).then((img) => {
      context.drawImage(img, 390, 110, 137, 42);
    });

    await loadImage(
      "https://firebasestorage.googleapis.com/v0/b/alarmbot-867dc.appspot.com/o/icon%2F1-removebg-preview.png?alt=media&token=35e5c775-7737-4355-834f-8b62ea383dd7"
    ).then((img) => {
      context.drawImage(img, 50, 215, 149, 562);
    });
    await loadImage(
      "https://firebasestorage.googleapis.com/v0/b/alarmbot-867dc.appspot.com/o/icon%2F2-removebg-preview.png?alt=media&token=a8a17f72-c6ad-4ba8-82c4-7ddfe03902ee"
    ).then((img) => {
      context.drawImage(img, 370, 215, 178, 562);
    });
    await loadImage(
      "https://firebasestorage.googleapis.com/v0/b/alarmbot-867dc.appspot.com/o/icon%2F3-removebg-preview.png?alt=media&token=8414e17f-70f1-4be0-a641-dd0cc078408f"
    ).then((img) => {
      context.drawImage(img, 740, 215, 236, 562);
      let fileBuffer = canvas.toBuffer();

      const imageRef = ref(
        storage,
        `image/deadstat/deadstat_${dead["Оновлено"].split(".").join("")}.png`
      );

      uploadBytes(imageRef, fileBuffer).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          messageDeadStat(chatId, msgId, url);

          setValueFirebase(state.deadState, "url", url, "deadState");
        });
      });

      //fs.writeFileSync("assets/img/deadstat.png", fileBuffer);
    });
  } else {
    await messageDeadStat(chatId, msgId, state.deadState.url);
  }
}

function messageDeadStat(chatId, msgId, url) {
  return bot
    .sendPhoto(chatId, url, {
      reply_to_message_id: msgId,
    })
    .catch((e) => {
      console.log(e);
      bot.sendMessage(
        chatId,
        `Через високу інтенсивність боїв підрахунок ускладнено. 
🏃🏃🏃@Omnia_purple🏃🏃🏃 `,
        {
          reply_to_message_id: msgId,
        }
      );
    });
}
