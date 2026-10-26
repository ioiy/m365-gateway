# M365-Gateway 快速部署指南

## 一键部署（3 步完成）

### 第 1 步：克隆代码

```bash
git clone https://github.com/ioiy/m365-gateway.git
cd m365-gateway
```

### 第 2 步：配置（只需一次）

```bash
./deploy.sh setup
```

按提示填写 4 项必填信息：

| # | 需要填写 | 从哪里获取 |
|---|---------|-----------|
| 1 | Cloudflare API Token | Cloudflare 控制台 → My Profile → API Tokens → Create Token |
| 2 | Cloudflare Account ID | Cloudflare 控制台 → 任意域名 → 右侧 Overview → Account ID |
| 3 | Worker 名称 | 自定义，如 `my-m365-gateway` |
| 4 | M365 Client ID | Azure Portal → App Registrations → Application (client) ID |

域名和 KV ID 选填，首次部署留空即可。

### 第 3 步：部署

```bash
./deploy.sh
```

完成。终端会显示管理后台地址和初始管理员密码。

---

## 一键升级（1 步完成）

```bash
git pull && ./deploy.sh
```

配置已保存在 `.deploy.env`，无需重新填写。

---

## 部署后

1. 打开管理后台（终端输出的地址，如 `https://api.example.com/`）
2. 用初始密码登录，立即修改密码
3. 添加 Microsoft 365 账号（按页面引导完成 OAuth 授权）
4. 创建 API Key，用于客户端调用

## 客户端调用示例

```bash
curl https://api.example.com/v1/chat/completions \
  -H "Authorization: Bearer 你的API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"hello"}]}'
```

---

## 常见问题

**Q: 升级后数据会丢失吗？**
不会。KV 和 Durable Objects 的数据独立持久化，升级只替换 Worker 代码。

**Q: 忘了初始密码怎么办？**
重新运行 `./deploy.sh setup`，或用 `--reset-admin-password` 参数：
```bash
node deploy-cloudflare.mjs --update --reset-admin-password --yes \
  --account-id "你的ID" --name "你的Worker名" \
  --client-id "你的ClientID" --kv-id "你的KVID"
```

**Q: 想换域名怎么办？**
```bash
./deploy.sh setup   # 重新配置，填入新域名
./deploy.sh         # 重新部署
```

**Q: 支持哪些客户端？**
任何兼容 OpenAI API 的客户端：Dify、LangChain、OpenWebUI、ChatBox、Cursor 等。
