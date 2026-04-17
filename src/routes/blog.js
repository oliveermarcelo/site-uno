const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const slugify = require("slugify");
const { auth } = require("../middleware/auth");

const prisma = new PrismaClient();

// GET /api/blog — public, published only
router.get("/", async (req, res) => {
  try {
    const { tag, limit } = req.query;
    const where = { published: true };
    if (tag) where.tag = tag;

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
      select: { id: true, title: true, slug: true, excerpt: true, tag: true, coverImage: true, createdAt: true },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/blog/:slug — public
router.get("/:slug", async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
    if (!post || !post.published) return res.status(404).json({ error: "Post não encontrado" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ADMIN ROUTES (auth required) ───

// GET /api/blog/admin/all — all posts including drafts
router.get("/admin/all", auth, async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/blog/admin
router.post("/admin", auth, async (req, res) => {
  try {
    const { title, excerpt, content, tag, coverImage, published } = req.body;
    const slug = slugify(title, { lower: true, strict: true });
    const post = await prisma.blogPost.create({
      data: { title, slug, excerpt, content, tag, coverImage, published: published || false },
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/blog/admin/:id
router.put("/admin/:id", auth, async (req, res) => {
  try {
    const { title, excerpt, content, tag, coverImage, published } = req.body;
    const data = { title, excerpt, content, tag, coverImage, published };
    if (title) data.slug = slugify(title, { lower: true, strict: true });

    const post = await prisma.blogPost.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/blog/admin/:id
router.delete("/admin/:id", auth, async (req, res) => {
  try {
    await prisma.blogPost.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
