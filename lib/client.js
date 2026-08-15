window.__ModuleLoader__.load({
	id: "dsh-plugin-descriptions",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		var react = require("react");

		//#region locale dictionaries
		const NS = "settings.pluginGuide";
		const zh = {
			tab: "插件说明",
			loading: "正在读取插件…",
			error: "暂时无法读取插件。",
			retry: "重试",
			search: "搜索插件或说明",
			heading: "插件说明",
			filterAll: "全部",
			filterEnabled: "已启用",
			filterDisabled: "已停用",
			enabledTag: "已启用",
			disabledTag: "已停用",
			empty: "暂无插件。",
			emptySearch: "没有匹配的插件。",
			entry: "条目",
			unknown: "暂无说明（未收录的自定义/第三方插件）。",
			unobserved: "未挂载",
			pending: "等待依赖",
			loadingPhase: "加载中",
			active: "已挂载",
			failed: "挂载失败",
			unloading: "卸载中",
			categoryAll: "全部分类",
			catFramework: "基础框架与运行时",
			catLlm: "LLM 与模型",
			catSession: "会话与持久化",
			catStorage: "设置、凭据与存储",
			catSandbox: "沙箱与权限",
			catSkills: "技能与指令",
			catGoals: "目标与计划",
			catCompaction: "压缩与输出治理",
			catSubagents: "子代理与工作流",
			catModelTools: "模型可用工具",
			catHost: "Web 服务端",
			catClient: "浏览器界面",
			catThirdParty: "第三方扩展",
			catOther: "其他 / 未收录"
		};
		const en = {
			tab: "Plugin guide",
			loading: "Reading plugins…",
			error: "Plugins are temporarily unavailable.",
			retry: "Retry",
			search: "Search plugins or descriptions",
			heading: "Plugin guide",
			filterAll: "All",
			filterEnabled: "Enabled",
			filterDisabled: "Disabled",
			enabledTag: "Enabled",
			disabledTag: "Disabled",
			empty: "No plugins are available.",
			emptySearch: "No matching plugins.",
			entry: "Entry",
			unknown: "No description available (third-party or custom plugin).",
			unobserved: "Not mounted",
			pending: "Waiting for dependencies",
			loadingPhase: "Loading",
			active: "Mounted",
			failed: "Mount failed",
			unloading: "Unloading",
			categoryAll: "All categories",
			catFramework: "Core framework & runtime",
			catLlm: "LLM & models",
			catSession: "Sessions & persistence",
			catStorage: "Settings, credentials & storage",
			catSandbox: "Sandbox & permissions",
			catSkills: "Skills & instructions",
			catGoals: "Goals & planning",
			catCompaction: "Compaction & output policy",
			catSubagents: "Subagents & workflows",
			catModelTools: "Model-facing tools",
			catHost: "Web host",
			catClient: "Browser UI",
			catThirdParty: "Third-party",
			catOther: "Other"
		};
		//#endregion

		//#region description data (dsh 0.1.0-rc.6, web profile)
		const DESCRIPTIONS = {
			"@deepseek-ai/cordis-plugin-timer": "定时器服务，供其他插件使用",
			"@deepseek-ai/cordis-plugin-hmr": "开发用热模块替换（Host 侧；Web 组合已停用）",
			"@deepseek-ai/dsh-llm": "provider 无关的 LLM 服务接口/抽象",
			"@deepseek-ai/dsh-session": "事件溯源会话存储核心",
			"@deepseek-ai/dsh-typert-registry": "生成的包反射与 Zod schema 运行时注册表（RPC 元数据基础）",
			"@deepseek-ai/dsh-typert-loader": "把 Typert 生成的包贡献接入 Cordis Loader",
			"@deepseek-ai/dsh-api-gateway": "Typert Remote Host 分发器 + 客户端 API 端点（浏览器调用 Host 的总线）",
			"@deepseek-ai/dsh-session-title": "会话标题服务与标题提供者注册表",
			"@deepseek-ai/dsh-session-title-first-prompt-llm": "用首条消息让 LLM 生成会话标题",
			"@deepseek-ai/dsh-user-questions": "向用户提问能力抽象（ask_user_question 通道）",
			"@deepseek-ai/dsh-agent": "Agent 接口、注册表、启动器作用域与事件词汇",
			"@deepseek-ai/dsh-agent-default-model": "新建 Agent 的默认模型选择（当前 deepseek-v4-flash）",
			"@deepseek-ai/dsh-jobs-local": "后台任务注册表（进程本地实现）",
			"@deepseek-ai/dsh-llm-retry": "按 provider 路由的 LLM 请求重试策略",
			"@deepseek-ai/dsh-settings-file": "用户设置后端（settings.yaml，热更新）",
			"@deepseek-ai/dsh-credentials-local": "凭据后端（.credentials.yaml + 环境变量）",
			"@deepseek-ai/dsh-llm-pi-ai": "pi-ai 多供应商 LLM 适配器（默认休眠，Models 页配置后启用）",
			"@deepseek-ai/dsh-session-persistence-jsonl": "会话 JSONL 持久化到 ~/.dsh/sessions",
			"@deepseek-ai/dsh-attachment-local": "图片等附件的私有内容寻址本地存储",
			"@deepseek-ai/dsh-session-query-sqlite": "SQLite FTS5 会话全文搜索（当前 openAt: never，搜索关闭）",
			"@deepseek-ai/dsh-session-projection": "会话投影注册表（从日志派生当前状态）",
			"@deepseek-ai/dsh-session-telemetry-otel": "OpenTelemetry 会话遥测后端（默认 DISABLED）",
			"@deepseek-ai/dsh-subprocess-local": "子进程管理（进程组、输出缓存、强制终止）",
			"@deepseek-ai/dsh-sandbox-local": "进程沙箱后端（按平台探测，失败即拒绝）",
			"@deepseek-ai/dsh-sandbox-policy": "每次调用的沙箱模式解析（read-only / workspace-write / danger-full-access）",
			"@deepseek-ai/dsh-bash-sandbox": "bash 执行器的沙箱实现（Windows 上停用）",
			"@deepseek-ai/dsh-pwsh-sandbox": "PowerShell 执行器的沙箱实现（Windows 上启用）",
			"@deepseek-ai/dsh-user-approval": "用户审批通道与策略（ask / never）",
			"@deepseek-ai/dsh-permission-presets": "权限预设（只读 / 工作区写入 / 完全访问）",
			"@deepseek-ai/dsh-shell-env": "管理注入 shell 的 DSH_* 环境变量",
			"@deepseek-ai/dsh-tool-bash": "模型可用的 bash 工具（Web 中由 Agent 预设挂载）",
			"@deepseek-ai/dsh-tool-pwsh": "模型可用的 PowerShell 工具（Web 中由 Agent 预设挂载）",
			"@deepseek-ai/dsh-tool-jobs": "模型可用的后台任务控制工具 job_list / job_output / job_kill",
			"@deepseek-ai/dsh-fs-observation-policy": "文件读取状态观察、读后编辑检查、版本保护写",
			"@deepseek-ai/dsh-tool-fs": "模型可用的 read / write / edit 文件工具",
			"@deepseek-ai/dsh-tool-fs-search": "模型可用的 glob / grep 文件搜索工具",
			"@deepseek-ai/dsh-agent-instructions": "加载 AGENTS.md / CLAUDE.md 工作区指令",
			"@deepseek-ai/dsh-skill": "技能（skill）提供者注册表",
			"@deepseek-ai/dsh-skill-filesystem": "从本地文件系统发现/加载技能",
			"@deepseek-ai/dsh-skill-badge": "内置 dsh badge 技能（停用）",
			"@deepseek-ai/dsh-tool-skill": "模型可用的 skill 加载工具",
			"@deepseek-ai/dsh-commands": "人类斜杠命令注册表",
			"@deepseek-ai/dsh-command-feedback": "/feedback 反馈命令",
			"@deepseek-ai/dsh-goal": "同会话目标（goal）状态与生命周期服务",
			"@deepseek-ai/dsh-goal-round-driver": "目标自动续跑轮次驱动（防并发/竞态）",
			"@deepseek-ai/dsh-command-goal": "/goal 目标命令",
			"@deepseek-ai/dsh-plan-mode": "计划模式（规则注入、/plan、经评审退出）",
			"@deepseek-ai/dsh-token-meter": "可重放感知的 token 计量服务",
			"@deepseek-ai/dsh-compaction-basic": "token 阈值驱动的压缩策略 + LLM 摘要",
			"@deepseek-ai/dsh-command-compact": "/compact 手动压缩会话命令",
			"@deepseek-ai/dsh-subagent": "子代理抽象与命名 provider 注册表",
			"@deepseek-ai/dsh-subagent-spawn-in-process": "进程内 spawn 子代理后端（全新上下文）",
			"@deepseek-ai/dsh-subagent-fork-in-process": "进程内 fork 子代理后端（继承父会话历史）",
			"@deepseek-ai/dsh-tool-subagent-control": "模型可用的子代理控制工具",
			"@deepseek-ai/dsh-tool-subagent": "模型可用的子代理委托工具",
			"@deepseek-ai/dsh-tool-subagent-report": "子代理向父级报告的 report 工具（仅子作用域）",
			"@deepseek-ai/dsh-workflow-worker-thread": "worker 线程 workflow 编排引擎",
			"@deepseek-ai/dsh-tool-workflow": "模型可用的 workflow 编排工具",
			"@deepseek-ai/dsh-tool-call-timeout-policy": "工具调用超时策略（超时返回 TOOL_TIMEOUT）",
			"@deepseek-ai/dsh-spill-local": "超大工具输出落盘存储（会话私有文件）",
			"@deepseek-ai/dsh-spill-policy": "超长文本结果替换为保留预览 + spill 文件路径",
			"@deepseek-ai/dsh-session-checkpoint-policy": "模型请求前、工具副作用前写持久化检查点",
			"@deepseek-ai/dsh-compaction-tool-result-pruner": "超长工具结果的头/中/尾裁剪",
			"@deepseek-ai/dsh-tool-todo": "模型可用的 todo_write 待办工具",
			"@deepseek-ai/dsh-tool-goal": "模型可用的 goal 工具",
			"@deepseek-ai/dsh-tool-ralph": "模型可用的全新 agent 循环 ralph 工具",
			"@deepseek-ai/dsh-tool-str-replace-editor": "模型可用的 view / create / str_replace / insert 编辑器工具",
			"@deepseek-ai/dsh-repeat-tool-reminder": "模型重复调用同一工具时的提醒（3/5/8 次阈值）",
			"@deepseek-ai/dsh-web": "Web 能力抽象（搜索/抓取 provider 注册）",
			"@deepseek-ai/dsh-web-search-deepseek": "DeepSeek 搜索 provider（web_search 服务端检索）",
			"@deepseek-ai/dsh-tool-web": "模型可用的 web_search / web_fetch（fetch 默认关）",
			"@deepseek-ai/dsh-tools": "工具注册表与执行管线（所有模型工具的总入口）",
			"@deepseek-ai/dsh-system-prompt": "系统提示词组装注册表 + persona",
			"@deepseek-ai/dsh-agent-loop": "具体 agent 循环插件（Web 下由 Agent 预设按会话创建）",
			"@deepseek-ai/dsh-fs-sandbox": "沙箱化文件系统（读放行，写/编辑按模式限制）",
			"@deepseek-ai/dsh-llm-deepseek": "DeepSeek chat-completions LLM 适配器",
			"@deepseek-ai/dsh-code-runtime-worker-thread": "代码执行能力（worker 线程实现）",
			"@deepseek-ai/dsh-storage": "存储中心（命名后端注册 + data form）",
			"@deepseek-ai/dsh-storage-json": "JSON 文件 KV 后端（~/.dsh/storages）",
			"@deepseek-ai/dsh-storage-domain": "schema 校验、发事件的域数据层",
			"@deepseek-ai/dsh-message-feedback": "消息点赞/备注的数据侧实现",
			"@deepseek-ai/dsh-session-log-export": "/export 会话日志导出 + 下载对话框",
			"@deepseek-ai/dsh-workspace": "工作区实体注册（路径 ↔ 会话绑定）",
			"@deepseek-ai/dsh-session-projection-cache": "投影缓存（持久化检查点 + 日志尾部重放）",
			"@deepseek-ai/dsh-session-stats": "整段日志的对话数/耗时统计（聊天统计条）",
			"@deepseek-ai/dsh-host-directory-picker-auto": "自适应目录选择器（原生系统选择器/内置浏览）",
			"@deepseek-ai/dsh-host-plugin-inventory": "“插件列表”页的数据源：只读 Loader 状态投影",
			"@deepseek-ai/dsh-host-apiproxy": "API 网关 Host 侧（浏览器所有 Remote 调用）",
			"@deepseek-ai/dsh-cordis-host-runner": "动态插件包注册、Host 侧沙箱生命周期",
			"@deepseek-ai/dsh-web-app/startup": "Web 启动参数与 webStartup 服务（host/port/trustedHosts）",
			"@deepseek-ai/dsh-host-webserver": "HTTP/WebSocket 路由注册 + 静态资源服务",
			"@deepseek-ai/dsh-web-app": "Web 运行时粘合（前端 dist、web 提示词、打印 URL）",
			"@deepseek-ai/dsh-client-hmr": "客户端脚本热更新（开发用，平时空闲）",
			"@deepseek-ai/dsh-client-modules": "浏览器插件模块系统 + __DSH_BOOT__ 入口图",
			"@deepseek-ai/dsh-client-connection": "HTTP/WebSocket 客户端连接层与重连",
			"@deepseek-ai/dsh-api-remotes": "浏览器 Remote 组合（goal、pluginInventory 等）",
			"@deepseek-ai/dsh-client-runtime": "客户端核心服务（SlotRegistry、SessionRuntime）",
			"@deepseek-ai/dsh-cordis-client-runner": "浏览器端动态双面插件执行",
			"@deepseek-ai/dsh-client-ui-theme": "主题（亮/暗/系统 + CSS 令牌）",
			"@deepseek-ai/dsh-client-locale": "中/英文语言切换",
			"@deepseek-ai/dsh-client-ui-layout": "三栏主框架、拖拽与面板状态",
			"@deepseek-ai/dsh-client-ui-sidebar": "侧边栏会话树、搜索、状态点",
			"@deepseek-ai/dsh-client-ui-settings": "设置域基座与插槽契约",
			"@deepseek-ai/dsh-client-ui-settings-general": "通用设置 + 新手引导",
			"@deepseek-ai/dsh-client-ui-settings-models": "Models 模型设置页",
			"@deepseek-ai/dsh-client-ui-settings-plugin-inventory": "官方“插件列表”标签页（只读，只显示短名/状态）",
			"@deepseek-ai/dsh-client-ui-settings-plugins": "插件设置分区与可配置卡片",
			"@deepseek-ai/dsh-client-ui-conversation": "对话域（聊天流、输入框、消息详情）",
			"@deepseek-ai/dsh-client-ui-tool": "工具调用树渲染",
			"@deepseek-ai/dsh-client-ui-cordis": "cordis_define 动态插件卡片（运行/停止）",
			"@deepseek-ai/dsh-client-ui-workflow-run": "workflow 运行的会话节点",
			"@deepseek-ai/dsh-client-ui-deliverables": "最终回复“生成文件”尾注与文件引用点击",
			"@deepseek-ai/dsh-client-ui-workspace": "工作区选择器",
			"@deepseek-ai/dsh-client-ui-input-trigger": "/ 与 @ 输入触发管线",
			"@deepseek-ai/dsh-client-ui-commands": "/ 命令面板",
			"@deepseek-ai/dsh-client-ui-skill": "@ 技能引用 + 技能工具行",
			"@deepseek-ai/dsh-client-ui-subagent": "子代理目录、@ 引用、续聊路由",
			"@deepseek-ai/dsh-client-ui-jobs": "会话头部后台任务列表",
			"@deepseek-ai/dsh-client-ui-goal": "输入框上方 GoalBar",
			"@deepseek-ai/dsh-client-ui-message-feedback": "消息点赞/点踩 + 备注",
			"@deepseek-ai/dsh-client-ui-model-selection": "/model 模型选择",
			"@deepseek-ai/dsh-client-ui-permission-presets": "/permission 权限弹窗 + 新会话默认权限",
			"@deepseek-ai/dsh-client-ui-agent-preset": "Agent 预设选择与组合编辑器",
			"@deepseek-ai/dsh-client-ui-plan": "计划模式输入控件与 /plan",
			"@deepseek-ai/dsh-client-ui-user-questions": "用户提问 UI（ask_user_question）",
			"@deepseek-ai/dsh-client-ui-trajectory": "轨迹事件账本与时序总览",
			"@deepseek-ai/dsh-agent-presets": "每会话 agent 预设组合（默认 standard）",
			"@linxin666/dsh-web-ui-all": "全家桶聚合/兼容桥接包（装一个等于全装）",
			"@linxin666/dsh-client-ui-web-ui-settings": "第三方插件家族的开关与配置表单卡片",
			"@linxin666/dsh-client-ui-aionui-panel": "右侧 AionUI 风格 Explorer + Preview 面板",
			"@linxin666/dsh-client-ui-task-board": "看板任务管理（可下发 dsh 会话执行）",
			"@linxin666/dsh-client-ui-git-graph": "会话头部 git 分支选择器 + Git 图",
			"@linxin666/dsh-pet": "鲸鱼娘桌面宠物（响应模型活动、投喂/抚摸）",
			"@linxin666/dsh-remote-web-ui": "手机扫码配对远程控制 Web GUI",
			"@linxin666/dsh-live-stats": "实时 token 估算与生成吞吐",
			"@linxin666/dsh-ssh": "SSH 远程操作全家桶（exec/PTY/SFTP/隧道/集群 + 模型工具）",
			"@linxin666/dsh-client-ui-skin-center": "皮肤中心（试穿/预览/一键应用/恢复）"
		};

		// 同名模块会有多个 loader 条目，按 entryId 给出更精确的说明。
		const ENTRY_NOTES = {
			"tool-subagent-control": "send_message / interrupt_agent 控制工具（本条目）",
			"tool-subagent-list-agents": "list_agents 工具（本条目）",
			"tool-subagent": "subagent（spawn）委托工具（本条目）",
			"tool-subagent-fork": "subagent_fork（继承历史）委托工具（本条目）"
		};

		// 分类：先查显式覆盖表，其余按包名前缀推断；未命中归入 other。
		const CATEGORY_OVERRIDES = {
			"@deepseek-ai/dsh-llm": "llm",
			"@deepseek-ai/dsh-token-meter": "llm",
			"@deepseek-ai/dsh-agent-default-model": "llm",
			"@deepseek-ai/dsh-session": "session",
			"@deepseek-ai/dsh-attachment-local": "session",
			"@deepseek-ai/dsh-message-feedback": "session",
			"@deepseek-ai/dsh-settings-file": "storage",
			"@deepseek-ai/dsh-credentials-local": "storage",
			"@deepseek-ai/dsh-workspace": "storage",
			"@deepseek-ai/dsh-bash-sandbox": "sandbox",
			"@deepseek-ai/dsh-pwsh-sandbox": "sandbox",
			"@deepseek-ai/dsh-fs-sandbox": "sandbox",
			"@deepseek-ai/dsh-fs-observation-policy": "sandbox",
			"@deepseek-ai/dsh-user-approval": "sandbox",
			"@deepseek-ai/dsh-permission-presets": "sandbox",
			"@deepseek-ai/dsh-tool-skill": "skills",
			"@deepseek-ai/dsh-agent-instructions": "skills",
			"@deepseek-ai/dsh-tool-goal": "goals",
			"@deepseek-ai/dsh-plan-mode": "goals",
			"@deepseek-ai/dsh-tool-todo": "goals",
			"@deepseek-ai/dsh-command-goal": "goals",
			"@deepseek-ai/dsh-command-compact": "compaction",
			"@deepseek-ai/dsh-tool-call-timeout-policy": "compaction",
			"@deepseek-ai/dsh-repeat-tool-reminder": "compaction",
			"@deepseek-ai/dsh-tool-subagent-control": "subagents",
			"@deepseek-ai/dsh-tool-subagent": "subagents",
			"@deepseek-ai/dsh-tool-subagent-report": "subagents",
			"@deepseek-ai/dsh-tool-workflow": "subagents",
			"@deepseek-ai/dsh-tool-ralph": "subagents",
			"@deepseek-ai/dsh-web": "modelTools",
			"@deepseek-ai/dsh-web-search-deepseek": "modelTools",
			"@deepseek-ai/dsh-cordis-host-runner": "host",
			"@deepseek-ai/dsh-code-runtime-worker-thread": "host",
			"@deepseek-ai/dsh-web-app": "host",
			"@deepseek-ai/dsh-web-app/startup": "host",
			"@deepseek-ai/dsh-agent-presets": "host",
			"@deepseek-ai/dsh-api-remotes": "client",
			"@deepseek-ai/dsh-cordis-client-runner": "client",
			"@deepseek-ai/dsh-user-questions": "framework",
			"@deepseek-ai/dsh-command-feedback": "framework",
			"@deepseek-ai/dsh-tools": "framework",
			"@deepseek-ai/dsh-agent": "framework",
			"@deepseek-ai/dsh-agent-loop": "framework",
			"@deepseek-ai/dsh-system-prompt": "framework",
			"@deepseek-ai/dsh-commands": "framework",
			"@deepseek-ai/dsh-shell-env": "framework",
			"@deepseek-ai/dsh-subprocess-local": "framework",
			"@deepseek-ai/dsh-jobs-local": "framework",
			"@deepseek-ai/dsh-api-gateway": "framework"
		};

		const CATEGORY_ORDER = [
			["framework", "catFramework"],
			["llm", "catLlm"],
			["session", "catSession"],
			["storage", "catStorage"],
			["sandbox", "catSandbox"],
			["skills", "catSkills"],
			["goals", "catGoals"],
			["compaction", "catCompaction"],
			["subagents", "catSubagents"],
			["modelTools", "catModelTools"],
			["host", "catHost"],
			["client", "catClient"],
			["thirdParty", "catThirdParty"],
			["other", "catOther"]
		];

		// 仅用于搜索命中分类名；界面文案走 locale 字典。
		const CATEGORY_LABELS = {
			zh: {
				framework: "基础框架与运行时",
				llm: "LLM 与模型",
				session: "会话与持久化",
				storage: "设置、凭据与存储",
				sandbox: "沙箱与权限",
				skills: "技能与指令",
				goals: "目标与计划",
				compaction: "压缩与输出治理",
				subagents: "子代理与工作流",
				modelTools: "模型可用工具",
				host: "Web 服务端",
				client: "浏览器界面",
				thirdParty: "第三方扩展",
				other: "其他"
			},
			en: {
				framework: "Core framework",
				llm: "LLM & models",
				session: "Sessions",
				storage: "Settings & storage",
				sandbox: "Sandbox & permissions",
				skills: "Skills & instructions",
				goals: "Goals & planning",
				compaction: "Compaction & output",
				subagents: "Subagents & workflows",
				modelTools: "Model-facing tools",
				host: "Web host",
				client: "Browser UI",
				thirdParty: "Third-party",
				other: "Other"
			}
		};

		function categoryOf(entry) {
			const name = entry.moduleName;
			if (Object.hasOwn(CATEGORY_OVERRIDES, name)) return CATEGORY_OVERRIDES[name];
			if (name.startsWith("@linxin666/")) return "thirdParty";
			if (name.startsWith("@deepseek-ai/dsh-client-")) return "client";
			if (name.startsWith("@deepseek-ai/dsh-tool-")) return "modelTools";
			if (name.startsWith("@deepseek-ai/dsh-host-")) return "host";
			if (name.startsWith("@deepseek-ai/dsh-session-")) return "session";
			if (name.startsWith("@deepseek-ai/dsh-storage")) return "storage";
			if (name.startsWith("@deepseek-ai/dsh-sandbox-")) return "sandbox";
			if (name.startsWith("@deepseek-ai/dsh-llm")) return "llm";
			if (name.startsWith("@deepseek-ai/dsh-skill")) return "skills";
			if (name.startsWith("@deepseek-ai/dsh-goal")) return "goals";
			if (name.startsWith("@deepseek-ai/dsh-command-")) return "framework";
			if (name.startsWith("@deepseek-ai/dsh-compaction-")) return "compaction";
			if (name.startsWith("@deepseek-ai/dsh-spill-")) return "compaction";
			if (name.startsWith("@deepseek-ai/dsh-subagent")) return "subagents";
			if (name.startsWith("@deepseek-ai/dsh-workflow")) return "subagents";
			if (name.startsWith("@deepseek-ai/dsh-typert") || name.startsWith("@deepseek-ai/dsh-api-gateway")) return "framework";
			if (name.startsWith("@deepseek-ai/cordis-plugin-")) return "framework";
			return "other";
		}
		//#endregion

		//#region helpers
		const PHASE_KEYS = {
			pending: "pending",
			loading: "loadingPhase",
			active: "active",
			failed: "failed",
			unloading: "unloading"
		};

		function shortName(moduleName) {
			return (moduleName.startsWith("@") ? moduleName.slice(moduleName.indexOf("/") + 1) : moduleName)
				.replace(/^cordis:/, "")
				.replace(/^cordis-plugin-/, "")
				.replace(/^dsh-(?:host-|client-)?/, "");
		}

		function descriptionOf(entry, t) {
			if (ENTRY_NOTES[entry.entryId] !== void 0) return ENTRY_NOTES[entry.entryId];
			if (DESCRIPTIONS[entry.moduleName] !== void 0) return DESCRIPTIONS[entry.moduleName];
			return t("unknown");
		}

		function matches(entry, normalizedQuery) {
			if (normalizedQuery.length === 0) return true;
			const category = categoryOf(entry);
			return [
				entry.moduleName,
				entry.entryId,
				shortName(entry.moduleName),
				DESCRIPTIONS[entry.moduleName] ?? "",
				CATEGORY_LABELS.zh[category] ?? "",
				CATEGORY_LABELS.en[category] ?? ""
			].some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
		}

		function phaseLabel(phase, t) {
			return phase === null || phase === void 0 ? t("unobserved") : t(PHASE_KEYS[phase] ?? "unobserved");
		}

		function phaseColor(phase) {
			switch (phase) {
				case "active": return "#22c55e";
				case "loading": return "#3b82f6";
				case "failed": return "#ef4444";
				default: return "#9ca3af";
			}
		}
		//#endregion

		//#region component
		const styles = {
			section: { width: "100%", maxWidth: 860, color: "var(--dsw-alias-label-primary)", display: "flex", flexDirection: "column", gap: 14 },
			status: { margin: 0, color: "var(--dsw-alias-label-tertiary)", fontSize: 13, lineHeight: "20px" },
			error: { margin: 0, color: "var(--dsw-alias-state-error-primary)", display: "flex", alignItems: "center", gap: 10 },
			retry: { border: "1px solid var(--dsw-alias-border-l2)", background: "transparent", color: "var(--dsw-alias-label-primary)", borderRadius: 6, padding: "4px 10px", font: "inherit", cursor: "pointer" },
			searchLabel: { display: "flex", alignItems: "center", position: "relative" },
			searchInput: { width: "100%", height: 36, borderRadius: 8, border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-1)", color: "var(--dsw-alias-label-primary)", padding: "0 12px", fontSize: 13, font: "inherit" },
			headingRow: { display: "flex", alignItems: "baseline", gap: 7, padding: "0 2px" },
			heading: { margin: 0, fontSize: 13, fontWeight: 600, lineHeight: "20px" },
			count: { color: "var(--dsw-alias-label-tertiary)", fontSize: 12, lineHeight: "18px", fontVariantNumeric: "tabular-nums" },
			filterRow: { display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" },
			filterButton: { border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-1)", color: "var(--dsw-alias-label-secondary)", borderRadius: 6, padding: "3px 10px", font: "inherit", fontSize: 12, lineHeight: "18px", cursor: "pointer" },
			filterButtonActive: { borderColor: "var(--dsw-alias-state-business-primary)", color: "var(--dsw-alias-state-business-primary)", background: "color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent)" },
			filterSelect: { height: 26, borderRadius: 6, border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-1)", color: "var(--dsw-alias-label-secondary)", padding: "0 8px", font: "inherit", fontSize: 12, lineHeight: "18px", cursor: "pointer" },
			group: { display: "flex", flexDirection: "column", gap: 8 },
			groupHead: { display: "flex", alignItems: "baseline", gap: 7, padding: "0 2px" },
			groupTitle: { margin: 0, fontSize: 12, fontWeight: 600, lineHeight: "18px", color: "var(--dsw-alias-label-tertiary)" },
			cards: { listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 },
			card: { border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-3)", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 6, minWidth: 0 },
			cardHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
			title: { fontSize: 13, fontWeight: 600, lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
			trailing: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0 },
			tag: { fontSize: 11, lineHeight: "16px", border: "1px solid var(--dsw-alias-border-l2)", borderRadius: 4, padding: "1px 6px", color: "var(--dsw-alias-label-tertiary)", whiteSpace: "nowrap" },
			moduleName: { fontSize: 11, lineHeight: "16px", color: "var(--dsw-alias-label-tertiary)", wordBreak: "break-all" },
			desc: { margin: 0, fontSize: 12.5, lineHeight: "18px", color: "var(--dsw-alias-label-secondary)" },
			footer: { display: "flex", justifyContent: "space-between", gap: 8, fontSize: 11, lineHeight: "16px", color: "var(--dsw-alias-label-tertiary)" }
		};

		function renderEntryCard(entry, tt) {
			const enabled = entry.enabled;
			return react.createElement("li", { key: entry.entryId, style: styles.card, "data-plugin-entry": entry.entryId },
				react.createElement("div", { style: styles.cardHead },
					react.createElement("strong", { style: styles.title, title: entry.moduleName }, shortName(entry.moduleName)),
					react.createElement("span", { style: styles.trailing },
						react.createElement("span", {
							"aria-hidden": true,
							style: { width: 8, height: 8, borderRadius: "50%", backgroundColor: phaseColor(entry.fiberPhase), flexShrink: 0 }
						}),
						react.createElement("span", { style: styles.tag }, enabled ? tt("enabledTag") : tt("disabledTag"))
					)
				),
				react.createElement("code", { style: styles.moduleName }, entry.moduleName),
				react.createElement("p", { style: styles.desc }, descriptionOf(entry, tt)),
				react.createElement("div", { style: styles.footer },
					react.createElement("span", { title: tt("entry") }, entry.entryId),
					react.createElement("span", null, phaseLabel(entry.fiberPhase, tt))
				)
			);
		}

		function PluginGuideTab({ list, t }) {
			const tt = t ?? ((key) => key);
			const [request, setRequest] = react.useState(0);
			const [query, setQuery] = react.useState("");
			const [filter, setFilter] = react.useState("all");
			const [category, setCategory] = react.useState("all");
			const [state, setState] = react.useState({ status: "loading" });
			react.useEffect(() => {
				let current = true;
				Promise.resolve().then(() => list()).then((snapshot) => {
					if (current) setState({ status: "ready", snapshot });
				}, () => {
					if (current) setState({ status: "error" });
				});
				return () => {
					current = false;
				};
			}, [list, request]);
			const normalizedQuery = query.trim().toLocaleLowerCase();
			const filteredEntries = react.useMemo(() => {
				if (state.status !== "ready") return [];
				return state.snapshot.entries.filter((entry) => {
					if (filter === "enabled" && !entry.enabled) return false;
					if (filter === "disabled" && entry.enabled) return false;
					if (category !== "all" && categoryOf(entry) !== category) return false;
					return matches(entry, normalizedQuery);
				});
			}, [state, normalizedQuery, filter, category]);
			const groupedEntries = react.useMemo(() => CATEGORY_ORDER.map(([key, labelKey]) => {
				const items = filteredEntries.filter((entry) => categoryOf(entry) === key);
				return { key, labelKey, items };
			}).filter((group) => group.items.length > 0), [filteredEntries]);
			const retry = () => {
				setState({ status: "loading" });
				setRequest((value) => value + 1);
			};
			const filterOptions = [
				["all", "filterAll"],
				["enabled", "filterEnabled"],
				["disabled", "filterDisabled"]
			];
			return react.createElement("div", { style: styles.section, "aria-busy": state.status === "loading" },
				state.status === "loading" ? react.createElement("p", { style: styles.status }, tt("loading")) : null,
				state.status === "error" ? react.createElement("div", { style: styles.error, role: "alert" },
					react.createElement("p", { style: { margin: 0 } }, tt("error")),
					react.createElement("button", { type: "button", style: styles.retry, onClick: retry }, tt("retry"))
				) : null,
				state.status === "ready" ? react.createElement(react.Fragment, null,
					react.createElement("label", { style: styles.searchLabel },
						react.createElement("input", {
							type: "search",
							style: styles.searchInput,
							value: query,
							placeholder: tt("search"),
							"aria-label": tt("search"),
							onChange: (event) => setQuery(event.currentTarget.value)
						})
					),
					react.createElement("div", { style: styles.headingRow },
						react.createElement("h3", { style: styles.heading }, tt("heading")),
						react.createElement("span", { style: styles.count }, filteredEntries.length)
					),
					react.createElement("div", { style: styles.filterRow },
						react.createElement("select", {
							style: styles.filterSelect,
							value: category,
							"aria-label": tt("categoryAll"),
							onChange: (event) => setCategory(event.currentTarget.value)
						},
							react.createElement("option", { value: "all" }, tt("categoryAll")),
							CATEGORY_ORDER.map(([key, labelKey]) => react.createElement("option", { key, value: key }, tt(labelKey)))
						),
						filterOptions.map(([value, key]) => react.createElement("button", {
							key: value,
							type: "button",
							style: filter === value ? { ...styles.filterButton, ...styles.filterButtonActive } : styles.filterButton,
							onClick: () => setFilter(value)
						}, tt(key)))
					),
					state.snapshot.entries.length === 0 ? react.createElement("p", { style: styles.status }, tt("empty")) : null,
					groupedEntries.length > 0 ? groupedEntries.map((group) => react.createElement("section", { key: group.key, style: styles.group },
						react.createElement("div", { style: styles.groupHead },
							react.createElement("h4", { style: styles.groupTitle }, tt(group.labelKey)),
							react.createElement("span", { style: styles.count }, group.items.length)
						),
						react.createElement("ul", { style: styles.cards },
							group.items.map((entry) => renderEntryCard(entry, tt))
						)
					)) : react.createElement("p", { style: styles.status }, tt("emptySearch"))
				) : null
			);
		}
		//#endregion

		//#region plugin apply
		const inject = ["slots", "locale", "remote", "remote.pluginInventory"];
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-plugin-descriptions: dictionaries");
			const t = ctx.locale.bind(NS);
			const list = async () => {
				const result = await ctx.remote.pluginInventory.list();
				if (!result.ok) throw new Error(`pluginInventory.list failed: ${result.error.code}: ${result.error.message}`);
				return result.value;
			};
			const injected = () => ({ list });
			ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
				name: "settings.plugins.tab",
				id: "guide",
				order: 5,
				label: () => t("tab"),
				locale: NS,
				inject: injected
			}, PluginGuideTab));
		}
		exports.NS = NS;
		exports.apply = apply;
		exports.inject = inject;
		exports.__debug = { shortName, descriptionOf, matches, categoryOf, renderEntryCard, DESCRIPTIONS, ENTRY_NOTES, CATEGORY_ORDER, CATEGORY_OVERRIDES };
		return module.exports;
		//#endregion
	}
});
