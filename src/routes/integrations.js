const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const slugify = require("slugify");
const { auth } = require("../middleware/auth");

const prisma = new PrismaClient();

// GET /api/integrations — public
router.get("/", async (req, res) => {
  try {
    const { category, featured } = req.query;
    const where = { active: true };
    if (category) where.category = category;
    if (featured === "true") where.featured = true;

    const items = await prisma.integration.findMany({ where, orderBy: { sortOrder: "asc" } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/integrations/categories — public
router.get("/categories", async (req, res) => {
  try {
    const items = await prisma.integration.findMany({ where: { active: true }, select: { category: true }, distinct: ["category"] });
    res.json(items.map(i => i.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ADMIN ───

router.get("/admin/all", auth, async (req, res) => {
  try {
    const items = await prisma.integration.findMany({ orderBy: { sortOrder: "asc" } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/admin", auth, async (req, res) => {
  try {
    const { name, description, category, icon, website, active, featured, sortOrder } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const item = await prisma.integration.create({
      data: { name, slug, description, category, icon, website, active: active ?? true, featured: featured ?? false, sortOrder: sortOrder ?? 0 },
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/admin/:id", auth, async (req, res) => {
  try {
    const { name, description, category, icon, website, active, featured, sortOrder } = req.body;
    const data = { name, description, category, icon, website, active, featured, sortOrder };
    if (name) data.slug = slugify(name, { lower: true, strict: true });

    const item = await prisma.integration.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/admin/:id", auth, async (req, res) => {
  try {
    await prisma.integration.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
