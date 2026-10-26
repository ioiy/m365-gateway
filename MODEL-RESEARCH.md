# 新模型接入调查（2026-10）

状态：`gpt-6-sol` 与 `gpt-6.1-sol` 已按本调查接入模型目录，标记 `tenant_dependent`，待本项目串行线上回归确认后转为常规可用。Claude 付费 scenario 模型与 UBB 模型仍未接入。

## Microsoft 365 官方发布时间线

| 日期 | 模型 | 渠道 | 依据 |
| --- | --- | --- | --- |
| 2026-07 | GPT-5.5 Instant、Claude Opus 4.8、Claude Opus 5 / Sonnet 5（7 月下旬） | Microsoft 365 Copilot | M365 Roadmap |
| 2026-09-14/22 | Claude Opus 5.5、GPT-6 Sol | Word/Excel/PowerPoint/Chat/Cowork/Studio | M365 Roadmap、Copilot 官方博客 |
| 2026-09-30 | GPT-6.1 Sol、Claude Sonnet 5.5 | Cowork/Studio 先行，Word/Excel/PowerPoint/Chat 随后 | MC1483844 |
| 2026-11（预期） | GPT-6 Astra、Claude Fable 5.1 作为 UBB 模型 GA | Copilot Chat 与 Word/Excel/PowerPoint 模型选择器 | MC1519122 |

管理前提：Claude 模型要求租户启用 Anthropic 子处理器；GPT-6.1 Sol 在部分界面要求启用 OpenAI 子处理器（Azure 承载的 OpenAI 模型不受该开关影响）。

## ChatHub tone 实测结论（included scenario = 本网关所用 `OfficeWebIncludedCopilot` + `Starter`）

| tone | 结论 |
| --- | --- |
| `Gpt_6_Sol_Reasoning` | 在 included scenario 全账号可用；Web 端显示为 "GPT 6.0 Sol" |
| `Gpt_61_Sol_Reasoning` | 在 included scenario 全账号可用；Web 端显示为 "GPT-6.1 Sol"；其余 `Gpt_61_*` 兄弟 tone 全部被拒绝 |
| `Gpt_6_Sol_Chat` | 被接受但实际服务 GPT-5 Chat 模型，**禁止映射** |
| `Gpt_6_Chat` | 直接被 tone 校验拒绝；`Gpt_6_Reasoning` 仅付费 scenario 可用 |
| `Claude_Sonnet` | included scenario 现服务 Sonnet 4.6（2026-09 前为 4.5）；付费 scenario 服务 Sonnet 5.5。同一 tone，网关无需改接口 |
| `Claude_Sonnet_5` | 2026-10-06 起独立 tone；included 服务 Sonnet 4.6，付费服务 Sonnet 5 |
| `Claude_Opus` | 仅付费 scenario（`OfficeWebPaidCopilot`）稳定服务 Opus 5.5；included 场景在非高级账号是"注册但死"路由 |
| Claude Fable 5.1 | 无已验证 tone；UBB GA 预计 2026-11，暂不接入 |

tone 校验存在三种结果：正常服务（`contentOrigin: "DeepLeo"`）、校验拒绝（`Failed to invoke 'Chat'`）、注册但死路由（约 1.6 秒返回占位句 + `BotConnection`）。"没有报错"不等于路由可用。

## 接入决策

- 接入 `gpt-6-sol`、`gpt-6.1-sol`：与网关固定 included scenario 匹配，社区多源探测一致确认可用；保守标记 `tenant_dependent`。
- 两个 Sol 路由都是纯推理路由：模型目录与工具路由器（`toolRouterTone`）必须避免降级到 Chat tone。
- 暂不接入 `claude-opus`、`claude-sonnet-5.5`、`gpt-6-reasoning`：需要付费 scenario 或高级账号，网关当前不发送该 scenario，接入需先验证计费与限流影响。
- 暂不接入 `claude-fable-5.1`、`gpt-6-astra` 的 UBB 计费路径：UBB 2026-11 才 GA，且 `gpt-6-astra` 现有 tone 已在本项目 CF2 验收。

## 待办

1. 在候选环境用 `M365_TEST_MODELS=gpt-6-sol,gpt-6.1-sol` 跑 `scripts/full-functional.mjs` 串行回归。
2. 确认租户 OpenAI 子处理器开关对 GPT-6.1 Sol 的影响。
3. 付费 scenario（`OfficeWebPaidCopilot`）接入评估：Opus 5.5 / Sonnet 5.5 / GPT-6 Reasoning 的优先访问计量（80/日、150/周量级）与 429 映射。

## 参考来源

- MC1483844：GPT 6.1 Sol and Claude Sonnet 5.5 beginning to roll out today（2026-09-30，更新于 2026-10-22）
- MC1519122：UBB models（GPT-6 Astra、Claude Fable 5.1）in Chat and Word/Excel/PowerPoint（2026-10-21）
- Microsoft Learn：Choose a model for Copilot Cowork（2026-09-14）
- Microsoft 365 Roadmap 与 Copilot 官方博客 "More Models, One Copilot"（2026-09-22）
- m365-copilot-proxy tone 探测文档（2026-10-06 更新）
