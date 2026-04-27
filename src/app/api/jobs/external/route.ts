import { NextResponse } from "next/server";

// ─── Cache em memória (30 minutos) para conservar o limite da API ───
const cache = new Map<string, { data: AdzunaJob[]; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 min

export interface AdzunaJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  externalUrl: string;
  createdAt: string;
  source: "ADZUNA";
  tags: string[];
  isPremium: false;
  type: "REMOTE" | "HYBRID" | "ONSITE";
  level: "INTERN" | "JUNIOR" | "MID" | "SENIOR" | "LEAD";
  companyLogo?: string;
}

// ─── Extrai nível do cargo pelo título ──────────────────────────────
function inferLevel(title: string): AdzunaJob["level"] {
  const t = title.toLowerCase();
  if (t.includes("estágio") || t.includes("estagio") || t.includes("intern")) return "INTERN";
  if (t.includes("júnior") || t.includes("junior") || t.includes("jr")) return "JUNIOR";
  if (t.includes("pleno") || t.includes("mid") || t.includes("ii")) return "MID";
  if (t.includes("sênior") || t.includes("senior") || t.includes("sr")) return "SENIOR";
  if (t.includes("lead") || t.includes("head") || t.includes("principal") || t.includes("staff")) return "LEAD";
  return "MID";
}

// ─── Extrai tipo de contrato pelo título/descrição ──────────────────
function inferType(title: string, description: string): AdzunaJob["type"] {
  const text = (title + " " + description).toLowerCase();
  if (text.includes("remoto") || text.includes("remote") || text.includes("100% remoto")) return "REMOTE";
  if (text.includes("híbrido") || text.includes("hibrido") || text.includes("hybrid")) return "HYBRID";
  return "ONSITE";
}

// ─── Extrai tags de tech do título ───────────────────────────────────
const TECH_KEYWORDS = [
  "react","next.js","nextjs","node","node.js","typescript","javascript","python","java","go","golang",
  "vue","angular","aws","azure","gcp","docker","kubernetes","k8s","devops","ci/cd","graphql","rest",
  "sql","postgresql","mysql","mongodb","redis","flutter","react native","swift","kotlin","c#",".net",
  "php","laravel","django","fastapi","spring","terraform","ansible","linux","git","html","css",
  "tailwind","figma","data science","machine learning","ai","llm","data engineering","spark","kafka",
];

function extractTags(title: string, description: string): string[] {
  const text = (title + " " + description).toLowerCase();
  const found = TECH_KEYWORDS.filter((kw) => text.includes(kw));
  // Capitaliza cada tag
  return found.slice(0, 6).map((t) =>
    t.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  );
}

// ─── Normaliza a resposta da Adzuna para o padrão Match.js ────────────
function normalizeAdzunaJob(raw: any): AdzunaJob {
  const title = raw.title || "Desenvolvedor";
  const description = raw.description || "";

  return {
    id: `adzuna_${raw.id}`,
    title,
    company: raw.company?.display_name || "Empresa Parceira",
    location: raw.location?.display_name || "Brasil",
    salaryMin: raw.salary_min ? Math.round(raw.salary_min) : undefined,
    salaryMax: raw.salary_max ? Math.round(raw.salary_max) : undefined,
    description,
    externalUrl: raw.redirect_url,
    createdAt: raw.created || new Date().toISOString(),
    source: "ADZUNA",
    tags: extractTags(title, description),
    isPremium: false,
    type: inferType(title, description),
    level: inferLevel(title),
    companyLogo: raw.company_logo || undefined,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "desenvolvedor";
    const location = searchParams.get("location") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const resultsPerPage = parseInt(searchParams.get("per_page") || "10");

    const APP_ID = process.env.ADZUNA_APP_ID;
    const APP_KEY = process.env.ADZUNA_APP_KEY;

    if (!APP_ID || !APP_KEY) {
      return NextResponse.json({ error: "Adzuna API não configurada" }, { status: 503 });
    }

    // ── Cache key ──
    const cacheKey = `adzuna_${query}_${location}_${page}_${resultsPerPage}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ jobs: cached.data, source: "cache" });
    }

    // ── Monta a URL da Adzuna ──
    const params = new URLSearchParams({
      app_id: APP_ID,
      app_key: APP_KEY,
      results_per_page: String(resultsPerPage),
      what: query,
    });

    if (location) {
      params.append("where", location);
    }
    
    // sort_by: "date" às vezes limita resultados novos, vamos deixar opcional
    // params.append("sort_by", "date");



    const url = `https://api.adzuna.com/v1/api/jobs/br/search/${page}?${params.toString()}`;
    console.log("Fetching Adzuna URL:", url.replace(APP_KEY, "HIDDEN"));


    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 1800 }, // cache do Next.js por 30min também
    });

    if (!res.ok) {
      console.error("Adzuna API error:", res.status, await res.text());
      return NextResponse.json({ jobs: [], error: "Adzuna API indisponível" });
    }

    const data = await res.json();
    const jobs: AdzunaJob[] = (data.results || []).map(normalizeAdzunaJob);
    console.log(`Adzuna found ${jobs.length} jobs for query "${query}"`);


    // ── Salva no cache ──
    cache.set(cacheKey, { data: jobs, timestamp: Date.now() });

    return NextResponse.json({ jobs, total: data.count || jobs.length, source: "api" });
  } catch (error: any) {
    console.error("Erro ao buscar vagas Adzuna:", error?.message || error);
    return NextResponse.json({ jobs: [], error: "Erro interno" }, { status: 500 });
  }
}
