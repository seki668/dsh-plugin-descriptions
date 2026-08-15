// 无浏览器的冒烟测试：用伪 React 与伪 ctx 验证 client.js 的
// 注册逻辑、说明匹配、搜索过滤和一次渲染。
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const clientUrl = pathToFileURL(join(here, "..", "lib", "client.js"));

let captured = null;
globalThis.window = {
  __ModuleLoader__: {
    load(spec) {
      captured = spec;
    }
  }
};

await import(clientUrl.href);
if (!captured || captured.id !== "dsh-plugin-descriptions") {
  throw new Error("未捕获到模块加载声明");
}

// 单遍渲染的伪 React：足够跑通 hooks 和 createElement 树。
const react = {
  Fragment: Symbol("Fragment"),
  useState(init) {
    let value = typeof init === "function" ? init() : init;
    return [value, (next) => { value = typeof next === "function" ? next(value) : next; }];
  },
  useEffect() {},
  useMemo(fn) { return fn(); },
  createElement(type, props, ...children) {
    const next = { ...(props ?? {}), children: children.length <= 1 ? children[0] : children };
    if (type === react.Fragment) return next.children;
    if (typeof type === "function") return type(next);
    return { type, props: next };
  }
};

const plugin = captured.factory((id) => {
  if (id === "react") return react;
  throw new Error(`unexpected require: ${id}`);
});

if (typeof plugin.apply !== "function" || !Array.isArray(plugin.inject)) {
  throw new Error("插件导出缺少 apply/inject");
}

// 伪造 ctx 并执行 apply。
const calls = { dictionaries: null, slot: null, register: null };
const ctx = {
  effect(fn) { fn(); return () => {}; },
  locale: {
    register(ns, dict) { calls.dictionaries = { ns, dict }; },
    bind(ns) { return (key) => `${ns}.${key}`; }
  },
  slots: {
    inject(slot, fn) { calls.slot = slot; return fn(); },
    register(spec, component) { calls.register = { spec, component }; return () => {}; }
  },
  remote: {
    pluginInventory: {
      list: async () => ({ ok: true, value: { entries: [] } })
    }
  }
};
plugin.apply(ctx);

if (calls.dictionaries?.ns !== plugin.NS) throw new Error("locale 字典未注册");
if (calls.slot !== "settings.plugins.tab") throw new Error("未注入设置页标签插槽");
if (calls.register?.spec?.id !== "guide" || calls.register?.spec?.order !== 5) {
  throw new Error(`标签注册参数错误: ${JSON.stringify(calls.register?.spec)}`);
}

// 渲染单张卡片（把卡片渲染器拆成纯函数后，无需真实 effect/reconciler 即可验证）。
const snapshot = {
  entries: [
    { entryId: "session", moduleName: "@deepseek-ai/dsh-session", enabled: true, fiberPhase: "active" },
    { entryId: "tool-subagent-fork", moduleName: "@deepseek-ai/dsh-tool-subagent", enabled: false, fiberPhase: null },
    { entryId: "someone", moduleName: "some-unknown-plugin", enabled: true, fiberPhase: "pending" }
  ]
};
const cardText = snapshot.entries.map((entry) => JSON.stringify(plugin.__debug.renderEntryCard(entry, (key) => key))).join("\n");
for (const expected of ["事件溯源会话存储核心", "subagent_fork（继承历史）", "unknown"]) {
  if (!cardText.includes(expected)) throw new Error(`渲染结果缺少：${expected}`);
}
if (!plugin.__debug.matches(snapshot.entries[0], "会话")) throw new Error("matches 未命中说明文本");
if (!plugin.__debug.matches(snapshot.entries[0], "会话与持久化")) throw new Error("matches 未命中分类名");
if (plugin.__debug.shortName("@deepseek-ai/dsh-host-apiproxy") !== "apiproxy") {
  throw new Error("shortName 行为与官方不一致");
}

// 分类覆盖检查：所有内置说明条目都必须归入已知分类。
const distribution = new Map();
for (const moduleName of Object.keys(plugin.__debug.DESCRIPTIONS)) {
  const category = plugin.__debug.categoryOf({ moduleName, entryId: moduleName });
  distribution.set(category, (distribution.get(category) ?? 0) + 1);
  if (category === "other") throw new Error(`未分类的已知插件：${moduleName}`);
}
if (plugin.__debug.categoryOf(snapshot.entries[0]) !== "session") throw new Error("分类断言 1 失败");
if (plugin.__debug.categoryOf(snapshot.entries[1]) !== "subagents") throw new Error("分类断言 2 失败");
if (plugin.__debug.categoryOf(snapshot.entries[2]) !== "other") throw new Error("分类断言 3 失败");

// 宿主元数据：模拟 /api/dsh-plugin-descriptions 返回一个未来新增插件的 package.json 描述。
globalThis.fetch = async (url) => {
  if (url !== "/api/dsh-plugin-descriptions") throw new Error(`unexpected fetch url: ${url}`);
  return {
    ok: true,
    json: async () => ({
      descriptions: {
        "some-unknown-plugin": { package: "some-unknown-plugin", version: "1.0.0", description: "A brand new plugin" }
      }
    })
  };
};
await plugin.__debug.loadHostDescriptions();
const future = { entryId: "future", moduleName: "some-unknown-plugin", enabled: true, fiberPhase: "active" };
if (plugin.__debug.descriptionOf(future, (key) => key) !== "A brand new plugin") {
  throw new Error("未自动读取宿主端描述");
}
if (plugin.__debug.sourceOf(future) !== "auto") throw new Error("自动描述来源判断错误");
if (!plugin.__debug.matches(future, "brand new")) throw new Error("搜索未命中自动描述");
const futureCard = JSON.stringify(plugin.__debug.renderEntryCard(future, (key) => key));
if (!futureCard.includes("A brand new plugin") || !futureCard.includes("sourceAuto")) {
  throw new Error("自动描述未渲染到卡片");
}

console.log("smoke test OK");
console.log(`  注册标签: ${calls.register.spec.id} (order ${calls.register.spec.order})`);
console.log(`  说明条目数: ${Object.keys(plugin.__debug.DESCRIPTIONS).length}`);
console.log(`  分类分布: ${[...distribution.entries()].map(([k, v]) => `${k}=${v}`).join(", ")}`);
