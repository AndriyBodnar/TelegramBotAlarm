import ESBuild from "esbuild";
import moment from "moment";
import path from "path";
import { fileURLToPath } from "url";
moment.locale("en-sg");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mode = process.env.MODE || "development";

const isDev = mode === "development";
const isProd = mode === "production";
const hashTimeFolder = moment().format("LLL");

function resolveRoot(...segments) {
  return path.resolve(__dirname, "..", "..", ...segments);
}

ESBuild.build({
  outdir: resolveRoot(
    `build/${hashTimeFolder
      .split(",")
      .join("")
      .split(" ")
      .join("-")
      .split(":")
      .join("-")}`
  ),
  entryPoints: [resolveRoot("index.js")],
  entryNames: "[dir]/bundle.[name]-[hash]",
  bundle: true,
  minify: isProd,
  platform: "node",
  sourcemap: isDev,
  //   target: ["esnext", "node16.15.0"],
  loader: {
    ".png": "file",
    ".svg": "file",
    ".jpg": "file",
    ".ttf": "file",
    ".node": "file",
    ".data": "base64",
    ".png": "dataurl",
  },
});
