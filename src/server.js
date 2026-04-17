const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");
const integrationRoutes = require("./routes/integrations");
const pluginRoutes = require("./routes/plugins");

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === "production";

// Em produção serve os arquivos otimizados do build; em dev serve direto de public/
const publicDir = isProd
  ? path.join(__dirname, "..", "dist", "public")
  : path.join(__dirname, "..", "public");

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Cache headers para assets estáticos em produção
const staticOptions = isProd
  ? { maxAge: "7d", etag: true, lastModified: true }
  : {};

// Static files
app.use(express.static(publicDir, staticOptions));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/integrations", integrationRoutes);
app.use("/api/plugins", pluginRoutes);

// Admin panel
app.get("/admin*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "admin", "index.html"));
});

// Frontend - serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n🚀 UNO ERP Site rodando em http://localhost:${PORT}`);
  console.log(`📋 Admin panel: http://localhost:${PORT}/admin`);
  console.log(`📡 API: http://localhost:${PORT}/api\n`);
});
