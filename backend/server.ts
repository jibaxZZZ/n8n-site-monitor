import express, { Request, Response, RequestHandler } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/monitoring", (req, res) => {
  const data = req.body.result;
  fs.writeFileSync("monitoring.json", JSON.stringify(data, null, 2));
  res.status(200).json({ ok: true });
});

app.get("/api/monitoring", (req, res) => {
    const data = fs.readFileSync("monitoring.json", "utf-8");
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });

app.post("/api/update-local-copy", (async (req, res) => {
    const data = req.body.result;

  if (!data) {
    return res.status(400).json({ error: "Missing result" });
  }

  try {
    const filePath = "../frontend/public/data/monitoring.json";
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Copie locale écrite dans ${filePath}`);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("❌ Erreur écriture monitoring.json local:", error);
    res.status(500).json({ error: "Échec écriture monitoring.json" });
  }
}) as RequestHandler);

app.listen(PORT, () => {
  console.log(`🟢 Monitoring API listening on http://localhost:${PORT}`);
});