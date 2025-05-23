# 📡 n8n Uptime Monitor Dashboard

A lightweight, fully open-source uptime monitoring dashboard powered by **n8n**, **React**, and **Node.js**.

## 🚀 Features

### 🌐 Frontend (React + Vite + TailwindCSS + Recharts + Framer Motion)
- Add/remove monitored sites dynamically
- Persist settings via `localStorage`
- Interactive dashboard with:
  - Card per site: status 🟢/🔴, response time, latest HTTP code
  - Historical chart (last 7 checks)
  - Filterable and sortable table view
  - Dark mode 🌑
- Manual export of `monitoring.json`
- On-demand refresh of data

### 🧠 Backend (Node.js + Express)
- `POST /api/monitoring`: receives updated monitoring results (multi-tenant via `clientId`)
- `GET /api/monitoring?clientId=...`: returns JSON for the frontend
- `POST /api/update-local-copy`: writes updated JSON to `frontend/public/data/monitoring-<clientId>.json` (for n8n access)

### 🔁 n8n Workflow (importable via n8n Hub)
- Runs on a `Cron` trigger
- Fetches monitored sites from backend
- Measures availability with `HTTP Request`
- Logs response time and status
- Posts updated monitoring result to backend

## 📦 Getting Started

```bash
# Clone the repo
https://github.com/jibaxZZZ/n8n-site-monitor

# Launch the backend
cd backend
npm install
npm run dev

# Launch the frontend
cd ../frontend
npm install
npm run dev
```

## 🌍 Deployment

	•	Frontend: Vercel or Netlify
	•	Backend: Fly.io or Render
	•	n8n: Dockerized or hosted via n8n.cloud

## 📄 License

MIT

👨‍💻 Built by @JibaxZZZ

🎯 Inspired by the idea of simple, free, visual monitoring for anyone — without relying on paid APIs.
