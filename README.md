# dsh-plugin-descriptions

给 dsh Web 的「插件」设置区新增一个 **插件说明** 标签页：在官方「插件列表」的基础上，为每个 Cordis 插件显示一句话中文功能说明、完整包名、entryId 和挂载状态，并按功能域分组展示；支持搜索和分类/启用状态过滤。

官方列表（`@deepseek-ai/dsh-client-ui-settings-plugin-inventory`）只投影 `entryId / moduleName / enabled / fiberPhase`，没有描述字段，本插件在浏览器端用一张内置对照表补齐说明，不修改任何官方包。

## 效果

- 位置：设置 → 插件 → 「插件说明」（排在官方「插件列表」前面，官方页不受影响）
- 每个卡片：短名、启用/停用标签、挂载状态点、完整包名、中文说明、entryId、Cordis 状态
- 分组：基础框架与运行时 / LLM 与模型 / 会话与持久化 / 设置、凭据与存储 / 沙箱与权限 / 技能与指令 / 目标与计划 / 压缩与输出治理 / 子代理与工作流 / 模型可用工具 / Web 服务端 / 浏览器界面 / 第三方扩展 / 其他
- 支持：搜索（名称/包名/说明/分类名）、分类下拉过滤、全部/已启用/已停用过滤

## 安装（无需 pnpm）

在本机 PowerShell（普通终端即可）里运行：

```powershell
cd dsh-plugin-descriptions
node install.mjs
```

然后**重启 dsh web**（退出当前 `dsh web` 后重新启动）。插件集变更需要重启才会被 `dsh-client-modules` 扫描到。

卸载：

```powershell
cd dsh-plugin-descriptions
node uninstall.mjs
```

同样需要重启 dsh web。

### 只想预览、不改配置

```powershell
node install.mjs --copy-only
dsh web --patch ".\cordis.patch.yml"
```

重启后生效；下次正常启动 `dsh web` 时不加载该插件。

## 工作原理

1. `package.json` 声明 `dsh.client`（platform: web + 依赖注入图），宿主侧 `lib/index.js` 是无行为占位。
2. `cordis.patch.yml` 通过 `dsh.bundle.patch` 向 Loader 插入一个条目（id `ui-plugin-guide`，name 为本包名）；安装脚本把包名加入 profile 的 `dsh.profile.bundles`，组合器会自动应用该补丁。
3. `dsh-client-modules` 扫描到本条目后，把 `lib/client.js` 作为浏览器插件加入 `__DSH_BOOT__`，并通过 `/plugins/<包名>/client.js` 提供。
4. 浏览器端插件注入 `slots / locale / remote.pluginInventory`，向 `settings.plugins.tab` 注册 id 为 `guide` 的标签页；数据仍来自官方只读 Remote `pluginInventory.list()`，说明由内置 `DESCRIPTIONS` 表按 `moduleName` 匹配，个别同名模块按 `entryId` 精确区分。

## 目录结构

```
dsh-plugin-descriptions/
├─ package.json        # dsh.client / dsh.bundle 声明
├─ cordis.patch.yml    # Loader 补丁（插入宿主条目）
├─ lib/
│  ├─ index.js         # 宿主侧空实现
│  └─ client.js        # 浏览器端插件（UI + 说明数据）
├─ install.mjs         # 安装脚本
├─ uninstall.mjs       # 卸载脚本
└─ test/smoke.mjs      # 无浏览器冒烟测试
```

## 更新说明数据

- `DESCRIPTIONS`：按包名维护中文说明
- `ENTRY_NOTES`：按 entryId 维护同名模块多条目时的精确说明
- `CATEGORY_OVERRIDES`：按包名显式指定分类；其余按包名前缀自动归类（规则见 `categoryOf()`）
- `CATEGORY_ORDER`：分类的显示顺序，labelKey 对应 locale 字典里的 `cat*` 文案

改完需要重新执行 `node install.mjs` 并重启 dsh web。

## 限制

- 说明数据为内置静态表，收录 dsh 0.1.0-rc.6 web profile 的官方条目和当前安装的 @linxin666 全家桶；未来新增的插件若不在表内，会显示“暂无说明”。
- 官方 Remote 接口没有描述字段，本插件不改数据协议，因此无法自动读取包 `package.json` 的描述（那是浏览器拿不到的信息）。
- 未修改、未替换官方「插件列表」标签页，两个标签页可以并存。
