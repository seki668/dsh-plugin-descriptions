#!/usr/bin/env node
// 卸载 dsh-plugin-descriptions：移除 node_modules 副本和 profile bundles 条目。
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const pkgName = "dsh-plugin-descriptions";
const profileArgIndex = process.argv.indexOf("--profile");
const profileName = profileArgIndex >= 0 ? process.argv[profileArgIndex + 1] : "web";
const dshHome = process.env.DSH_HOME ?? join(homedir(), ".dsh");
const profileDir = join(dshHome, "profiles", profileName);
const packageJsonPath = join(profileDir, "package.json");
const targetDir = join(profileDir, "node_modules", pkgName);

if (existsSync(targetDir)) {
  rmSync(targetDir, { recursive: true, force: true });
  console.log(`已删除：${targetDir}`);
} else {
  console.log(`未找到副本：${targetDir}`);
}

if (existsSync(packageJsonPath)) {
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const bundles = pkg?.dsh?.profile?.bundles;
  if (Array.isArray(bundles) && bundles.includes(pkgName)) {
    pkg.dsh.profile.bundles = bundles.filter((name) => name !== pkgName);
    writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
    console.log("已从 profile bundles 移除插件。");
  }
}

console.log("如果曾在 profile 的 cordis.patch.yml 中手工添加过条目，请一并删除：");
console.log("  - id: ui-plugin-guide");
console.log("  name: 'dsh-plugin-descriptions'");
console.log("");
console.log("完成后请重启 dsh web。");
