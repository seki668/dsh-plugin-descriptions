#!/usr/bin/env node
// 安装 dsh-plugin-descriptions 到 web profile（无需 pnpm）。
// 用法：  node install.mjs            # 安装到默认 web profile
//        node install.mjs --profile test   # 安装到其他 profile
//        node install.mjs --copy-only # 只复制包；之后用 dsh web --patch <本包>/cordis.patch.yml 预览
import { createRequire } from "node:module";
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkgName = "dsh-plugin-descriptions";
const copyOnly = process.argv.includes("--copy-only");
const profileArgIndex = process.argv.indexOf("--profile");
const profileName = profileArgIndex >= 0 ? process.argv[profileArgIndex + 1] : "web";
const dshHome = process.env.DSH_HOME ?? join(homedir(), ".dsh");
const profileDir = join(dshHome, "profiles", profileName);
const packageJsonPath = join(profileDir, "package.json");
const targetDir = join(profileDir, "node_modules", pkgName);

if (!existsSync(packageJsonPath)) {
  console.error(`未找到 web profile：${packageJsonPath}`);
  console.error("请确认 DSH_HOME 正确，或先在 dsh 中启动过一次 web profile。");
  process.exit(1);
}

// 1. 复制插件包到 profile 的 node_modules（Node 解析路径即可找到，无需 pnpm）。
console.log(`[1/3] 复制插件包 -> ${targetDir}`);
rmSync(targetDir, { recursive: true, force: true });
cpSync(here, targetDir, {
  recursive: true,
  filter: (src) => !src.includes("node_modules")
});

// 2. 验证包可以从 profile 解析到（与 dsh 运行时相同的解析锚点）。
try {
  const requireFromProfile = createRequire(pathToFileURL(join(profileDir, "package.json")));
  const resolved = requireFromProfile.resolve(`${pkgName}/package.json`);
  console.log(`[2/3] 解析验证通过：${resolved}`);
} catch (error) {
  console.error("[2/3] 解析验证失败：", error.message);
  process.exit(1);
}

// 3. 在 profile 的 bundles 中注册本包（其 cordis.patch.yml 会自动插入 Loader 条目）。
if (copyOnly) {
  console.log("[3/3] --copy-only：跳过 bundle 注册。");
  console.log(`预览方式：dsh web --patch "${join(here, "cordis.patch.yml")}"`);
} else {
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  pkg.dsh ??= {};
  pkg.dsh.profile ??= {};
  if (!Array.isArray(pkg.dsh.profile.bundles)) pkg.dsh.profile.bundles = [];
  if (!pkg.dsh.profile.bundles.includes(pkgName)) {
    pkg.dsh.profile.bundles.push(pkgName);
    writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
    console.log(`[3/3] 已写入 profile bundles：${pkgName}`);
  } else {
    console.log(`[3/3] profile bundles 已包含 ${pkgName}，跳过写入。`);
  }
}

console.log("");
console.log("安装完成。请**重启 dsh web**（退出后重新运行 dsh web）使插件生效。");
console.log("生效后进入：设置 → 插件 → 「插件说明」标签页。");
