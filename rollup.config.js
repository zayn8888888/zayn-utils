import { nodeResolve as resolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

const external = [
  "axios",
  "chalk",
  "https-proxy-agent",
  "marked",
  "matrix-js-sdk",
  "matrix-js-sdk/lib/logger.js",
  "node-fetch",
  "readline",
  "socks-proxy-agent",
  "fs",
  "path",
  "url",
  "worker_threads",
  "puppeteer-extra",
  "puppeteer",
  "puppeteer-extra-plugin-stealth",
  "windows-shortcuts",
  "puppeteer-core",
];

export default [
  // ESM build
  {
    input: "index.js",
    output: {
      file: "dist/index.esm.js",
      format: "es",
      exports: "named",
    },
    external,
    plugins: [resolve({ preferBuiltins: true }), commonjs(), json()],
  },
  // CommonJS build
  {
    input: "index.js",
    output: {
      file: "dist/index.cjs",
      format: "cjs",
      exports: "named",
    },
    external,
    plugins: [resolve({ preferBuiltins: true }), commonjs(), json()],
  },
];
