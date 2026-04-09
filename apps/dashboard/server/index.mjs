import express from "express";
import cors from "cors";
import {
  deleteRowById,
  getRowById,
  initDb,
  listRows,
  upsertRow,
} from "./sqlite.mjs";

const PORT = Number(process.env.PORT || 8787);

const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" }));

function writeStdout(message) {
  process.stdout.write(`${message}\n`);
}

function writeStderr(message, error) {
  const details = error instanceof Error ? error.stack ?? error.message : String(error);
  process.stderr.write(`${message}${details ? `\n${details}` : ""}\n`);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "pinetar-sqlite-api" });
});

function notFound(res, entity, id) {
  res.status(404).json({ error: `${entity} not found: ${id}` });
}

app.get("/api/decks", async (_req, res) => {
  const rows = await listRows("decks");
  res.json(rows);
});

app.get("/api/decks/:id", async (req, res) => {
  const row = await getRowById("decks", req.params.id);
  if (!row) return notFound(res, "Deck", req.params.id);
  res.json(row);
});

app.post("/api/decks", async (req, res) => {
  const now = new Date().toISOString();
  const row = {
    ...req.body,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await upsertRow("decks", row);
  res.status(201).json(row);
});

app.put("/api/decks/:id", async (req, res) => {
  const existing = await getRowById("decks", req.params.id);
  if (!existing) return notFound(res, "Deck", req.params.id);
  const row = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };
  await upsertRow("decks", row);
  res.json(row);
});

app.delete("/api/decks/:id", async (req, res) => {
  const existing = await getRowById("decks", req.params.id);
  if (!existing) return notFound(res, "Deck", req.params.id);
  await deleteRowById("decks", req.params.id);
  res.status(204).end();
});

app.get("/api/assets", async (_req, res) => {
  const rows = await listRows("assets");
  res.json(rows);
});

app.get("/api/assets/:id", async (req, res) => {
  const row = await getRowById("assets", req.params.id);
  if (!row) return notFound(res, "Asset", req.params.id);
  res.json(row);
});

app.post("/api/assets", async (req, res) => {
  const now = new Date().toISOString();
  const row = {
    ...req.body,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await upsertRow("assets", row);
  res.status(201).json(row);
});

app.delete("/api/assets/:id", async (req, res) => {
  const existing = await getRowById("assets", req.params.id);
  if (!existing) return notFound(res, "Asset", req.params.id);
  await deleteRowById("assets", req.params.id);
  res.status(204).end();
});

app.get("/api/financial-models", async (_req, res) => {
  const rows = await listRows("financial_models");
  res.json(rows);
});

app.get("/api/financial-models/:id", async (req, res) => {
  const row = await getRowById("financial_models", req.params.id);
  if (!row) return notFound(res, "Financial model", req.params.id);
  res.json(row);
});

app.post("/api/financial-models", async (req, res) => {
  const now = new Date().toISOString();
  const row = {
    ...req.body,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await upsertRow("financial_models", row);
  res.status(201).json(row);
});

app.put("/api/financial-models/:id", async (req, res) => {
  const existing = await getRowById("financial_models", req.params.id);
  if (!existing) return notFound(res, "Financial model", req.params.id);
  const row = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };
  await upsertRow("financial_models", row);
  res.json(row);
});

app.delete("/api/financial-models/:id", async (req, res) => {
  const existing = await getRowById("financial_models", req.params.id);
  if (!existing) return notFound(res, "Financial model", req.params.id);
  await deleteRowById("financial_models", req.params.id);
  res.status(204).end();
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      writeStdout(`SQLite API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    writeStderr("Failed to initialize SQLite API", err);
    process.exit(1);
  });
