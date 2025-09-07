import { build } from "esbuild";
import fs from "fs";
import path from "path";

await build({
  entryPoints: ["src/index.ts"],
  outfile: "bundle/index.js",
  platform: "node",
  target: "node20",
  format: "cjs",
  bundle: true,
  minify: true,
  sourcemap: true,
  legalComments: "none",
  define: { "process.env.NODE_ENV": '"production"' },

  // Alias "@" to src folder
  alias: {
    "@": path.resolve(process.cwd(), "src"),
  },

  // Don't bundle optional Mongo native deps
  external: [
    "kerberos",
    "@mongodb-js/zstd",
    "@aws-sdk/credential-providers",
    "gcp-metadata",
    "snappy",
    "socks",
    "aws4",
    "mongodb-client-encryption",
    "fsevents",
  ],

  logLevel: "info",
});

// ---- Copy .env.production to bundle/.env ----
const srcEnv = path.resolve(process.cwd(), ".env.production");
const destEnv = path.resolve(process.cwd(), "bundle", ".env");

try {
  fs.copyFileSync(srcEnv, destEnv);
  console.log(`✅ Copied ${srcEnv} → ${destEnv}`);
} catch (err) {
  console.warn(`⚠️ Could not copy ${srcEnv}:`, err.message);
}
