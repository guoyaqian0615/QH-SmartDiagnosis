import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const projectRoot = process.cwd();
const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");
const buildDistDir = path.join(projectRoot, ".next");

try {
  fs.rmSync(buildDistDir, { recursive: true, force: true });
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code !== "ENOENT") {
    throw error;
  }
}

execFileSync(process.execPath, [nextBin, "build"], {
  cwd: projectRoot,
  stdio: "inherit",
  env: process.env,
});
