import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

const external = [
  "axios",
  "chalk",
  "https-proxy-agent",
  "marked",
  "matrix-js-sdk",
  "node-fetch",
  "readline",
  "socks-proxy-agent",
  "fs",
  "path",
  "url",
  "worker_threads",
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
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "named",
    },
    external,
    plugins: [resolve({ preferBuiltins: true }), commonjs(), json()],
  },
  // Minified ESM build
  {
    input: "index.js",
    output: {
      file: "dist/index.esm.min.js",
      format: "es",
      exports: "named",
    },
    external,
    plugins: [resolve({ preferBuiltins: true }), commonjs(), json(), terser()],
  },
  // Minified CommonJS build
  {
    input: "index.js",
    output: {
      file: "dist/index.cjs.min.js",
      format: "cjs",
      exports: "named",
    },
    external,
    plugins: [resolve({ preferBuiltins: true }), commonjs(), json(), terser()],
  },
];
