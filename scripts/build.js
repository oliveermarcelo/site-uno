const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");

const SITE_URL = process.env.SITE_URL || "https://unoerp.com.br";

const publicDir = path.join(__dirname, "..", "public");
const distDir = path.join(__dirname, "..", "dist", "public");

// SEO metadata per page
const SEO = {
  "index.html": {
    description: "UNO ERP é o sistema ERP com IA para PMEs brasileiras. Automatize vendas, estoque, financeiro e atendimento em uma única plataforma integrada.",
    canonical: "/",
    keywords: "ERP, sistema de gestão, ERP com IA, ERP para PME, software ERP Brasil",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "UNO ERP",
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
        description: "Sistema ERP com IA para PMEs brasileiras.",
        sameAs: ["https://www.linkedin.com/company/unoerp"],
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "UNO ERP",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, Android, iOS",
        description: "ERP completo com IA integrada para PMEs: vendas, estoque, financeiro, CRM e atendimento em uma única plataforma.",
        offers: { "@type": "Offer", availability: "https://schema.org/InStock" },
        url: SITE_URL,
      },
    ],
  },
  "crm.html": {
    description: "CRM integrado ao ERP com funil de vendas, automação de follow-up e gestão de leads. Venda mais com o CRM do UNO ERP.",
    canonical: "/crm",
    keywords: "CRM, sistema CRM, funil de vendas, gestão de leads, CRM integrado ERP",
  },
  "app-uno-erp.html": {
    description: "App mobile do UNO ERP para força de vendas, ordens de serviço e inventário. Funciona offline e sincroniza em tempo real.",
    canonical: "/app-uno-erp",
    keywords: "app ERP, força de vendas mobile, app gestão, ERP mobile",
  },
  "bi-google.html": {
    description: "Conecte seu ERP ao BigQuery e Looker Studio. Dashboards inteligentes com dados em tempo real para decisões estratégicas.",
    canonical: "/bi-google",
    keywords: "BI, Business Intelligence, BigQuery, Looker Studio, dashboard ERP",
  },
  "desenvolvimento.html": {
    description: "Desenvolvimento e customização sob medida para o UNO ERP. APIs, integrações e módulos personalizados para sua empresa.",
    canonical: "/desenvolvimento",
    keywords: "customização ERP, desenvolvimento sob medida, API ERP, integração personalizada",
  },
  "iau.html": {
    description: "IAU — Inteligência Artificial UNO: IA preditiva para PMEs que automatiza atendimento, prevê demanda e qualifica leads automaticamente.",
    canonical: "/iau",
    keywords: "IA para PME, inteligência artificial ERP, atendimento automático, IA preditiva",
  },
  "integracoes-b2c.html": {
    description: "Integre seu ERP aos principais marketplaces: Mercado Livre, Shopee, Amazon e e-commerce. Pedidos sincronizados automaticamente.",
    canonical: "/integracoes-b2c",
    keywords: "integração marketplace, Mercado Livre ERP, Shopee ERP, e-commerce integrado",
  },
  "integracoes-e-plugins.html": {
    description: "Conecte o UNO ERP às ferramentas que você usa: WhatsApp, Correios, iFood, gateways de pagamento e mais de 50 integrações.",
    canonical: "/integracoes-e-plugins",
    keywords: "plugins ERP, integrações ERP, WhatsApp ERP, conectores ERP",
  },
  "m-commerce.html": {
    description: "App B2B de catálogo e pedidos para revendas. Seus representantes vendem pelo celular com catálogo digital atualizado em tempo real.",
    canonical: "/m-commerce",
    keywords: "m-commerce, catálogo digital B2B, pedidos mobile, app representante comercial",
  },
  "sistema-de-gestao.html": {
    description: "Sistema de gestão ERP completo: financeiro, estoque, vendas, compras e fiscal integrados em uma solução para PMEs brasileiras.",
    canonical: "/sistema-de-gestao",
    keywords: "sistema de gestão, ERP completo, software gestão empresarial, ERP PME",
  },
  "site-b2b.html": {
    description: "Portal de pedidos online integrado ao ERP para atacadistas. Seus clientes compram 24/7 com preços e estoque em tempo real.",
    canonical: "/site-b2b",
    keywords: "site B2B, portal de pedidos, e-commerce atacado, loja virtual B2B",
  },
  "wms-para-pme.html": {
    description: "WMS integrado ao ERP para PMEs: endereçamento, picking, packing e inventário. Controle total do seu armazém.",
    canonical: "/wms-para-pme",
    keywords: "WMS, gestão de armazém, picking, packing, controle de estoque",
  },
};

// ── CDN replacements: dev → production ──────────────────────────────────────
const CDN_REPLACEMENTS = [
  [
    /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/react\/18\.2\.0\/umd\/react\.development\.js/g,
    "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
  ],
  [
    /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/react-dom\/18\.2\.0\/umd\/react-dom\.development\.js/g,
    "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
  ],
];

// ── Compile JSX via Babel ────────────────────────────────────────────────────
function compileJSX(code) {
  const result = babel.transformSync(code, {
    presets: [["@babel/preset-react", { runtime: "classic" }]],
    compact: true,
    comments: false,
  });
  return result.code;
}

// ── Build performance/font head tags ────────────────────────────────────────
function buildHeadTags(filename) {
  const seo = SEO[filename] || {};
  const canonicalUrl = seo.canonical ? `${SITE_URL}${seo.canonical}` : SITE_URL;

  const tags = [];

  // Preconnects
  tags.push(`  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`);
  tags.push(`  <link rel="preconnect" href="https://cdnjs.cloudflare.com">`);

  // SEO meta tags
  if (seo.description) {
    tags.push(`  <meta name="description" content="${seo.description}">`);
  }
  if (seo.keywords) {
    tags.push(`  <meta name="keywords" content="${seo.keywords}">`);
  }
  tags.push(`  <meta name="robots" content="index, follow">`);
  tags.push(`  <link rel="canonical" href="${canonicalUrl}">`);

  // Open Graph
  tags.push(`  <meta property="og:type" content="website">`);
  tags.push(`  <meta property="og:url" content="${canonicalUrl}">`);
  if (seo.description) {
    tags.push(`  <meta property="og:description" content="${seo.description}">`);
  }
  tags.push(`  <meta property="og:image" content="${SITE_URL}/og-image.png">`);
  tags.push(`  <meta property="og:site_name" content="UNO ERP">`);
  tags.push(`  <meta property="og:locale" content="pt_BR">`);

  // Twitter Card
  tags.push(`  <meta name="twitter:card" content="summary_large_image">`);
  tags.push(`  <meta name="twitter:site" content="@unoerp">`);
  if (seo.description) {
    tags.push(`  <meta name="twitter:description" content="${seo.description}">`);
  }
  tags.push(`  <meta name="twitter:image" content="${SITE_URL}/og-image.png">`);

  // JSON-LD
  if (seo.jsonld) {
    for (const schema of seo.jsonld) {
      tags.push(
        `  <script type="application/ld+json">${JSON.stringify(schema)}</script>`
      );
    }
  }

  return tags.join("\n");
}

// ── Process one HTML file ────────────────────────────────────────────────────
function processHtml(content, filename) {
  // 1. Remove babel-standalone script tag
  content = content.replace(
    /<script[^>]*babel-standalone[^>]*><\/script>\n?/g,
    ""
  );

  // 2. Swap dev React CDN → production
  for (const [from, to] of CDN_REPLACEMENTS) {
    content = content.replace(from, to);
  }

  // 3. Add defer to GSAP (non-critical animations)
  content = content.replace(
    /(<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap[^"]*")(>)/g,
    "$1 defer$2"
  );

  // 4. Compile JSX inline
  content = content.replace(
    /<script type="text\/babel">([\s\S]*?)<\/script>/g,
    (_, code) => {
      try {
        const compiled = compileJSX(code);
        return `<script>${compiled}</script>`;
      } catch (e) {
        console.error(`  ✗ Babel error in ${filename}:`, e.message);
        return `<script type="text/babel">${code}</script>`;
      }
    }
  );

  // 5. Inject SEO + performance tags after <head>
  const headTags = buildHeadTags(filename);
  content = content.replace("<head>", `<head>\n${headTags}`);

  // 6. Inject og:title matching the page <title>
  const titleMatch = content.match(/<title>(.*?)<\/title>/);
  if (titleMatch) {
    const ogTitle = `  <meta property="og:title" content="${titleMatch[1]}">`;
    const twitterTitle = `  <meta name="twitter:title" content="${titleMatch[1]}">`;
    content = content.replace("</title>", `</title>\n${ogTitle}\n${twitterTitle}`);
  }

  return content;
}

// ── Main ─────────────────────────────────────────────────────────────────────
function build() {
  // Setup dist dir
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  const files = fs.readdirSync(publicDir);
  let htmlCount = 0;
  let copyCount = 0;

  for (const file of files) {
    const srcPath = path.join(publicDir, file);
    const destPath = path.join(distDir, file);

    if (file.endsWith(".html")) {
      process.stdout.write(`  Building ${file}...`);
      const content = fs.readFileSync(srcPath, "utf8");
      const processed = processHtml(content, file);
      fs.writeFileSync(destPath, processed, "utf8");
      console.log(" ✓");
      htmlCount++;
    } else {
      fs.copyFileSync(srcPath, destPath);
      copyCount++;
    }
  }

  // Generate sitemap.xml
  const sitemapPages = Object.entries(SEO).map(([file, meta]) => {
    const slug = meta.canonical || `/${file.replace(".html", "")}`;
    const url = slug === "/" ? SITE_URL : `${SITE_URL}${slug}`;
    return `  <url>\n    <loc>${url}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${slug === "/" ? "1.0" : "0.8"}</priority>\n  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPages.join("\n")}\n</urlset>`;
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);
  console.log("  Building sitemap.xml... ✓");

  console.log(`\n✅ Build concluído: ${htmlCount} HTML compilados, ${copyCount} arquivos copiados`);
  console.log(`📁 Saída: dist/public/`);
}

build();
