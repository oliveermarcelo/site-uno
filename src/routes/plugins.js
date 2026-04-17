const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const slugify = require("slugify");
const { auth } = require("../middleware/auth");

const prisma = new PrismaClient();

// GET /api/plugins — public
router.get("/", async (req, res) => {
  try {
    const { module, featured } = req.query;
    const where = { active: true };
    if (module) where.module = module;
    if (featured === "true") where.featured = true;

    const items = await prisma.plugin.findMany({ where, orderBy: { sortOrder: "asc" } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/plugins/modules — public
router.get("/modules", async (req, res) => {
  try {
    const items = await prisma.plugin.findMany({ where: { active: true }, select: { module: true }, distinct: ["module"] });
    res.json(items.map(i => i.module));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ADMIN ───

router.get("/admin/all", auth, async (req, res) => {
  try {
    const items = await prisma.plugin.findMany({ orderBy: { sortOrder: "asc" } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/admin", auth, async (req, res) => {
  try {
    const { name, description, module, icon, active, featured, sortOrder } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const item = await prisma.plugin.create({
      data: { name, slug, description, module, icon, active: active ?? true, featured: featured ?? false, sortOrder: sortOrder ?? 0 },
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/admin/:id", auth, async (req, res) => {
  try {
    const { name, description, module, icon, active, featured, sortOrder } = req.body;
    const data = { name, description, module, icon, active, featured, sortOrder };
    if (name) data.slug = slugify(name, { lower: true, strict: true });

    const item = await prisma.plugin.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/admin/:id", auth, async (req, res) => {
  try {
    await prisma.plugin.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
