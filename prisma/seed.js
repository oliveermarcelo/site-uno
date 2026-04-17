const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@unoerp.com.br" },
    update: {},
    create: { name: "Administrador", email: "admin@unoerp.com.br", password: hash, role: "admin" },
  });

  // Blog posts
  const posts = [
    {
      title: "Como a Inteligência Artificial está transformando a gestão de PMEs",
      slug: "ia-transformando-gestao-pmes",
      excerpt: "Descubra como empresas brasileiras estão usando IA preditiva para antecipar demanda e reduzir custos operacionais.",
      content: "<p>A inteligência artificial deixou de ser uma promessa futurista para se tornar uma ferramenta essencial na gestão empresarial...</p>",
      tag: "IA",
      published: true,
    },
    {
      title: "5 sinais de que sua empresa precisa de um ERP especializado",
      slug: "5-sinais-empresa-precisa-erp",
      excerpt: "Planilhas, retrabalho e falta de visibilidade são sintomas. Veja como um ERP resolve cada um deles.",
      content: "<p>Se sua empresa ainda depende de planilhas para controlar estoque, finanças ou vendas, é hora de repensar...</p>",
      tag: "Gestão",
      published: true,
    },
    {
      title: "PCP na prática: como planejar a produção com eficiência",
      slug: "pcp-planejamento-producao-eficiencia",
      excerpt: "Do MRP ao controle de ordens de produção — como a indústria pode reduzir perdas e aumentar a produtividade.",
      content: "<p>O Planejamento e Controle de Produção (PCP) é o coração da operação industrial...</p>",
      tag: "Indústria",
      published: true,
    },
  ];
  for (const post of posts) {
    await prisma.blogPost.upsert({ where: { slug: post.slug }, update: {}, create: post });
  }

  // Integrations
  const integrations = [
    { name: "Mercado Livre", slug: "mercado-livre", description: "Integração completa com o maior marketplace da América Latina.", category: "Marketplace", active: true, featured: true, sortOrder: 1 },
    { name: "Shopee", slug: "shopee", description: "Sincronize produtos, estoque e pedidos com a Shopee.", category: "Marketplace", active: true, featured: true, sortOrder: 2 },
    { name: "Amazon", slug: "amazon", description: "Gestão centralizada de vendas na Amazon Brasil.", category: "Marketplace", active: true, featured: false, sortOrder: 3 },
    { name: "Tray", slug: "tray", description: "Integração nativa com a plataforma Tray Commerce.", category: "E-commerce", active: true, featured: true, sortOrder: 4 },
    { name: "VTEX", slug: "vtex", description: "Conecte seu ERP ao ecossistema VTEX.", category: "E-commerce", active: true, featured: false, sortOrder: 5 },
    { name: "Nuvemshop", slug: "nuvemshop", description: "Sincronização automática com Nuvemshop.", category: "E-commerce", active: true, featured: true, sortOrder: 6 },
    { name: "RD Station", slug: "rd-station", description: "Integre marketing e vendas com RD Station.", category: "Marketing", active: true, featured: true, sortOrder: 7 },
    { name: "Google Ads", slug: "google-ads", description: "Acompanhe ROI de campanhas direto no ERP.", category: "Marketing", active: true, featured: false, sortOrder: 8 },
    { name: "Correios", slug: "correios", description: "Cálculo de frete e rastreamento automático.", category: "Logística", active: true, featured: true, sortOrder: 9 },
    { name: "Jadlog", slug: "jadlog", description: "Integração com Jadlog para envios e rastreio.", category: "Logística", active: true, featured: false, sortOrder: 10 },
    { name: "Domínio Contábil", slug: "dominio-contabil", description: "Exportação automática para Domínio Sistemas.", category: "Contábil", active: true, featured: true, sortOrder: 11 },
    { name: "Fortes Contábil", slug: "fortes-contabil", description: "Integração com Fortes Tecnologia.", category: "Contábil", active: true, featured: false, sortOrder: 12 },
    { name: "Concil", slug: "concil", description: "Conciliação de cartões e pagamentos.", category: "Financeiro", active: true, featured: true, sortOrder: 13 },
    { name: "Asaas", slug: "asaas", description: "Cobranças, boletos e PIX automatizados.", category: "Financeiro", active: true, featured: false, sortOrder: 14 },
  ];
  for (const integ of integrations) {
    await prisma.integration.upsert({ where: { slug: integ.slug }, update: {}, create: integ });
  }

  // Plugins
  const plugins = [
    { name: "Cashback", slug: "cashback", description: "Sistema de cashback com regras de negócio configuráveis.", module: "Comercial", active: true, featured: true, sortOrder: 1 },
    { name: "Comissões", slug: "comissoes", description: "Controle de comissões por vendedor, equipe ou canal.", module: "Comercial", active: true, featured: true, sortOrder: 2 },
    { name: "Multi-Tabela de Preço", slug: "multi-tabela-preco", description: "Múltiplas tabelas de preço por cliente, região ou canal.", module: "Comercial", active: true, featured: false, sortOrder: 3 },
    { name: "PIX Nativo", slug: "pix-nativo", description: "Receba via PIX direto no sistema com QR Code automático.", module: "Financeiro", active: true, featured: true, sortOrder: 4 },
    { name: "Conciliação Bancária", slug: "conciliacao-bancaria", description: "Conciliação automática via OFX e API bancária.", module: "Financeiro", active: true, featured: true, sortOrder: 5 },
    { name: "WMS", slug: "wms", description: "Gestão de armazém com endereçamento e picking.", module: "Estoque", active: true, featured: true, sortOrder: 6 },
    { name: "Rastreabilidade por Lote", slug: "rastreabilidade-lote", description: "Rastreamento completo de lotes do recebimento à expedição.", module: "Produção", active: true, featured: true, sortOrder: 7 },
    { name: "MRP", slug: "mrp", description: "Planejamento de necessidade de materiais automático.", module: "Produção", active: true, featured: false, sortOrder: 8 },
    { name: "PDV", slug: "pdv", description: "Frente de caixa integrada com NFC-e.", module: "Fiscal", active: true, featured: true, sortOrder: 9 },
    { name: "SPED Automático", slug: "sped-automatico", description: "Geração automática de SPED Fiscal e Contribuições.", module: "Fiscal", active: true, featured: true, sortOrder: 10 },
  ];
  for (const plugin of plugins) {
    await prisma.plugin.upsert({ where: { slug: plugin.slug }, update: {}, create: plugin });
  }

  console.log("✓ Seed concluído com sucesso!");
  console.log("  → Admin: admin@unoerp.com.br / admin123");
  console.log("  → 3 posts de blog");
  console.log("  → 14 integrações");
  console.log("  → 10 plugins");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
