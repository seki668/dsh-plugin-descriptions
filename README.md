# dsh-plugin-descriptions

给 dsh Web 的「插件」设置区新增一个 **插件说明** 标签页，在官方「插件列表」的基础上为每个已安装的 Cordis 插件展示功能说明、完整包名、entryId 与挂载状态，并按功能域分组；支持搜索、分类过滤和启用状态过滤。

说明来源按以下优先级自动选择，**无需为每个插件预先登记**：

1. 内置中文说明（随插件发布，覆盖常用插件）
2. 插件包自带的 `package.json` `description`（运行时自动读取，通常是英文）
3. “暂无说明”

官方插件列表只投影 `entryId / moduleName / enabled / fiberPhase`，本插件不修改任何官方包，只新增一个并存的标签页。

## 特性

- 位置：设置 → 插件 → 「插件说明」（排在官方「插件列表」之前，官方页不受影响）
- 卡片信息：短名、启用/停用标签、挂载状态点、完整包名、功能说明、说明来源（内置说明 / 自动读取）、entryId、Cordis 状态
- 分组：基础框架与运行时 / LLM 与模型 / 会话与持久化 / 设置、凭据与存储 / 沙箱与权限 / 技能与指令 / 目标与计划 / 压缩与输出治理 / 子代理与工作流 / 模型可用工具 / Web 服务端 / 浏览器界面 / 第三方扩展 / 其他
- 搜索：匹配名称、包名、说明文本与分类名
- 过滤：分类下拉 + 全部/已启用/已停用
- 自动元数据：宿主端在请求时遍历当前 Loader 条目并解析各插件包的 `package.json`，因此任何已安装的插件都会自动带上它自己的描述

## 环境要求

- dsh（DeepSeek Harness）`0.1.0-rc.6`，web profile（在本版本上开发与验证）
- 安装脚本只需 Node.js（dsh 运行环境自带），无需 pnpm
- 已在 Windows 上验证；安装脚本使用 `node:path` / `node:os` 等跨平台 API，其它平台同样可用

## 安装

1. 获取代码：

   ```powershell
   git clone https://github.com/seki668/dsh-plugin-descriptions.git
   cd dsh-plugin-descriptions
   ```

   如果通过 ZIP 下载，解压后同样在包根目录执行后续命令。

2. 安装（复制插件包并注册到 web profile 的 bundles，无需 pnpm）：

   ```powershell
   node install.mjs
   ```

   安装到其它 profile：

   ```powershell
   node install.mjs --profile <profile-name>
   ```

3. 重启 `dsh web` 后，进入 设置 → 插件 → 「插件说明」。

> 首次安装或卸载 Web 客户端插件需要重启 dsh，原因见下方「常见问题」。

### 卸载

```powershell
node uninstall.mjs
```

### 只预览、不修改 profile 配置

```powershell
node install.mjs --copy-only
dsh web --patch ".\cordis.patch.yml"
```

## 更新

```powershell
cd dsh-plugin-descriptions
git pull
node install.mjs
```

更新后重启 `dsh web`。

## 自动说明机制

- **描述**：宿主侧注册 `GET /api/dsh-plugin-descriptions`，在每次请求时遍历当前 Loader 条目，解析每个包根（支持 `@scope/name/subpath`，跳过 `cordis:` 内置项），读取该包 `package.json` 的 `name / version / description`。因此任何已安装的插件——无论它是在你安装本插件之前还是之后装上的——都会自动显示包自带描述，无需修改本插件。
- **分类**：先用 `CATEGORY_OVERRIDES` 精确匹配，再按包名前缀规则自动归类（如 `dsh-tool-*` → 模型可用工具、`dsh-client-ui-*` → 浏览器界面、`@linxin666/*` → 第三方扩展）；无法识别时归入「其他 / 未收录」。
- **中文覆盖**：内置中文表只作为优先级更高的覆盖层。未覆盖的插件照常显示包自带描述，并在卡片上标注「自动读取」；覆盖过的显示「内置说明」。

## 工作原理

1. `package.json` 声明 `dsh.client`（platform: web + 依赖注入图）；宿主侧 `lib/index.js` 注册包元数据路由。
2. `cordis.patch.yml` 通过 `dsh.bundle.patch` 向 Loader 插入条目（id `ui-plugin-guide`）；安装脚本把包名加入 profile 的 `dsh.profile.bundles`，组合器自动应用该补丁。
3. `dsh-client-modules` 扫描该条目，把 `lib/client.js` 作为浏览器插件加入 `__DSH_BOOT__`，经 `/plugins/<包名>/client.js` 提供。
4. 浏览器端注入 `slots / locale / remote.pluginInventory`，向 `settings.plugins.tab` 注册 id 为 `guide` 的标签页；清单来自官方只读 Remote `pluginInventory.list()`，说明按「内置中文 → 宿主元数据 → 暂无说明」合并。

## 常见问题

### dsh 基于 Cordis、支持热插拔，为什么安装/更新本插件要重启？

Cordis 核心确实支持运行时热插拔，本页的数据读取也完全是实时的：官方插件清单 Remote 和 `/api/dsh-plugin-descriptions` 都在请求时解析，不缓存包信息。**dsh 运行时热挂载/卸载的插件，刷新本页即可看到变化。**

需要重启的只有以下场景，限制来自 dsh 的 Web 客户端插件装载链路（`dsh-client-modules`），而非 Cordis 核心或本插件：

1. **首次安装/卸载本插件，或安装任何新的 Web 客户端插件包**：`dsh-client-modules` 对每个包的 `dsh.client` 元数据做进程内缓存（包括“不是客户端插件”的否定结论）且不提供全量重扫，新包必须重启才能进入 `__DSH_BOOT__`。
2. **更新本插件自己的代码**：客户端 bundle 的内容修订号只在开发模式 watcher（`dsh-client-hmr`，由 `pnpm run dev:web` 驱动）触发 rebuild 时更新；普通运行没有 watcher，因此改完 `lib/client.js` 或宿主侧 `lib/index.js` 后需要重启。
3. **安装其它新的 Web 客户端插件**：与第 1 条同一机制。

### 需要给某个插件补充中文说明怎么办？

在 `lib/client.js` 的 `DESCRIPTIONS`（按包名）或 `ENTRY_NOTES`（按 entryId，用于同名模块多条目）中加一条，重新执行 `node install.mjs` 并重启。不加也完全可用，页面会显示该插件的包自带描述。

## 目录结构

```
dsh-plugin-descriptions/
├─ package.json        # dsh.client / dsh.bundle 声明
├─ cordis.patch.yml    # Loader 补丁（插入宿主条目）
├─ lib/
│  ├─ index.js         # 宿主侧：包元数据 HTTP 路由
│  └─ client.js        # 浏览器端：UI + 内置说明 + 自动元数据合并
├─ install.mjs         # 安装脚本
├─ uninstall.mjs       # 卸载脚本
└─ test/smoke.mjs      # 无浏览器冒烟测试
```

## 维护内置说明

- `DESCRIPTIONS`：按包名维护中文说明
- `ENTRY_NOTES`：按 entryId 维护同名模块多条目时的精确说明
- `CATEGORY_OVERRIDES`：按包名显式指定分类；其余按前缀规则自动归类（见 `categoryOf()`）
- `CATEGORY_ORDER`：分类显示顺序，labelKey 对应 locale 字典的 `cat*` 文案

## 限制

- 自动描述来自各插件包 `package.json` 的 `description`（通常是英文）；没有该字段或无法解析的插件显示“暂无说明”。
- 不修改、不替换官方「插件列表」标签页，两个标签页并存。
- 与 dsh 的兼容性按 `0.1.0-rc.6` 验证；官方 Remote 协议或槽位 API 变化时可能需要适配。

## License

MIT
