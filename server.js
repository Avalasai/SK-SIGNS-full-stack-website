const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || "change-this-admin-key";

const publicDir = path.join(__dirname, "public");
const uploadDir = path.join(publicDir, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const db = new Database(path.join(__dirname, "data", "sk-signs.db"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    business_name TEXT,
    service_required TEXT,
    project_location TEXT,
    message TEXT,
    photo_filename TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const allowedServices = new Set([
  "Graphic Design",
  "Vehicle Wrap & Branding",
  "Wall Graphics",
  "LED Channel Letters",
  "ACP Elevation",
  "Acrylic Sign Boards",
  "3D Letter Signage",
  "LED / Glow Sign Boards",
  "Shop Front Branding",
  "Office / Commercial Branding"
]);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp|jpg)$/i.test(file.mimetype);
    cb(ok ? null : new Error("Only JPG, PNG and WEBP images are allowed."), ok);
  }
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "SK SIGNS API" });
});

app.post("/api/quotes", upload.single("projectPhoto"), (req, res) => {
  const {
    name = "",
    mobile = "",
    businessName = "",
    serviceRequired = "",
    projectLocation = "",
    message = ""
  } = req.body;

  if (!name.trim() || !mobile.trim()) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ ok: false, message: "Name and mobile number are required." });
  }

  if (serviceRequired && !allowedServices.has(serviceRequired)) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ ok: false, message: "Please select a valid service." });
  }

  const stmt = db.prepare(`
    INSERT INTO quotes
    (name, mobile, business_name, service_required, project_location, message, photo_filename)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    name.trim(),
    mobile.trim(),
    businessName.trim(),
    serviceRequired.trim(),
    projectLocation.trim(),
    message.trim(),
    req.file ? req.file.filename : null
  );

  res.status(201).json({
    ok: true,
    message: "Thank you! Your quote request has been submitted.",
    id: result.lastInsertRowid
  });
});

app.get("/api/quotes", (req, res) => {
  const key = req.get("x-admin-key") || req.query.key;
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ ok: false, message: "Unauthorized." });
  }
  const rows = db.prepare("SELECT * FROM quotes ORDER BY id DESC").all();
  res.json({ ok: true, quotes: rows });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ ok: false, message: err.message || "Request failed." });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`SK SIGNS website running at http://localhost:${PORT}`);
});
