// 宿主侧：提供 /api/dsh-plugin-descriptions 元数据接口。
// 每次请求时遍历当前 Loader 条目，解析每个插件包自己的 package.json，
// 把 name/version/description 返回给浏览器端。任何已安装的插件无需
// 修改本包即可自动获得 package.json 里的英文描述（内置中文表仍优先）。
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROUTE_PATH = "/api/dsh-plugin-descriptions";
const inject = ["webServer", "loader"];

/** 从模块说明符中取包根名：`@scope/name/subpath` → `@scope/name`。 */
function rootPackageName(specifier) {
	if (specifier.startsWith("@")) {
		const [scope, name] = specifier.split("/");
		return `${scope}/${name}`;
	}
	return specifier.split("/")[0];
}

/** 从给定文件向上查找最近的 package.json。 */
function nearestPackageJson(startFile) {
	let dir = dirname(startFile);
	while (true) {
		const candidate = join(dir, "package.json");
		if (existsSync(candidate)) return candidate;
		const parent = dirname(dir);
		if (parent === dir) return null;
		dir = parent;
	}
}

/** 解析一个 loader 条目的包元数据；失败返回 null。 */
function readPackageMeta(requireFn, specifier) {
	if (typeof specifier !== "string" || specifier.length === 0) return null;
	if (specifier.startsWith("cordis:")) return null;
	const root = rootPackageName(specifier);
	try {
		const pkgPath = requireFn.resolve(`${root}/package.json`);
		const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
		return {
			package: root,
			version: typeof pkg.version === "string" ? pkg.version : "",
			description: typeof pkg.description === "string" ? pkg.description : ""
		};
	} catch {
		// exports 可能没有暴露 ./package.json：退化为解析入口后向上查找。
	}
	try {
		const entryPath = requireFn.resolve(root);
		const pkgPath = nearestPackageJson(entryPath);
		if (pkgPath === null) return null;
		const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
		return {
			package: root,
			version: typeof pkg.version === "string" ? pkg.version : "",
			description: typeof pkg.description === "string" ? pkg.description : ""
		};
	} catch {
		return null;
	}
}

function writeJson(res, status, body) {
	const payload = JSON.stringify(body);
	res.writeHead(status, {
		"content-type": "application/json; charset=utf-8",
		"cache-control": "no-store",
		"referrer-policy": "no-referrer"
	});
	res.end(payload);
}

function apply(ctx) {
	const requireFn = ctx.baseUrl === void 0 ? null : createRequire(ctx.baseUrl);
	const handler = (req, res) => {
		if (req.method !== "GET") {
			writeJson(res, 405, { error: "method not allowed: " + (req.method ?? "") });
			return;
		}
		const descriptions = {};
		if (requireFn !== null) {
			for (const entry of ctx.loader.entries()) {
				const name = entry.options?.name;
				const meta = readPackageMeta(requireFn, name);
				if (meta !== null) descriptions[name] = meta;
			}
		}
		writeJson(res, 200, { descriptions });
	};
	ctx.effect(() => ctx.webServer.register({
		kind: "exact",
		path: ROUTE_PATH,
		handler
	}), "dsh-plugin-descriptions: host metadata route");
}

export { apply, inject };
