/**
 * Match.js Semantic Search Engine
 * Expande termos de busca para incluir sinônimos e tecnologias relacionadas.
 */

const SYNONYM_MAP: Record<string, string[]> = {
  // Desenvolvimento
  "frontend": ["react", "vue", "angular", "nextjs", "typescript", "javascript", "tailwind", "css", "html", "web"],
  "backend": ["node", "python", "java", "golang", "c#", "php", "ruby", "sql", "postgres", "mongodb", "api", "rest"],
  "fullstack": ["node", "react", "typescript", "nextjs", "javascript", "express", "sql"],
  "mobile": ["flutter", "react native", "swift", "kotlin", "ios", "android", "dart"],
  
  // Tecnologias Específicas
  "react": ["frontend", "nextjs", "javascript", "typescript", "web"],
  "node": ["backend", "javascript", "typescript", "express", "api"],
  "python": ["backend", "dados", "django", "flask", "machine learning", "ia"],
  "java": ["backend", "spring boot", "android"],
  
  // Infraestrutura & DevOps
  "devops": ["aws", "docker", "kubernetes", "ci/cd", "terraform", "azure", "google cloud", "linux", "jenkins"],
  "cloud": ["aws", "azure", "google cloud", "gcp", "devops", "serverless"],
  
  // Dados & IA
  "dados": ["python", "sql", "pandas", "spark", "machine learning", "ia", "inteligencia artificial", "bi", "data science"],
  "ia": ["python", "machine learning", "inteligencia artificial", "nlp", "llm", "deep learning"],
  "inteligencia artificial": ["ia", "python", "machine learning", "nlp"],
  
  // Design & UX
  "design": ["ui", "ux", "figma", "adobe", "frontend", "layout"],
  "ux": ["design", "ui", "pesquisa", "experiencia do usuario"],
  
  // Cargos & Níveis
  "estagiario": ["estagio", "intern", "junior", "trainee"],
  "estagio": ["estagiario", "intern", "trainee"],
  "programador": ["desenvolvedor", "developer", "engenhiero", "software"],
  "desenvolvedor": ["programador", "developer", "engenhiero", "software"],
  "gestor": ["gerente", "lead", "manager", "product", "coordenador"],
};

/**
 * Retorna uma lista de padrões de busca (originais + sinônimos)
 */
export function expandSearchTerm(term: string): string[] {
  if (!term) return [];
  
  const normalized = term.toLowerCase().trim();
  const patterns = new Set<string>([normalized]);
  
  // 1. Busca direta no mapa
  if (SYNONYM_MAP[normalized]) {
    SYNONYM_MAP[normalized].forEach(s => patterns.add(s));
  }
  
  // 2. Busca parcial (ex: "front" -> "frontend")
  Object.keys(SYNONYM_MAP).forEach(key => {
    if (key.includes(normalized) || normalized.includes(key)) {
      patterns.add(key);
      SYNONYM_MAP[key].forEach(s => patterns.add(s));
    }
  });
  
  return Array.from(patterns);
}

/**
 * Verifica se uma vaga dá match com os padrões de busca
 */
export function checkJobMatch(job: { title: string, company: string, tags: string[] }, patterns: string[]): boolean {
  if (patterns.length === 0) return true;
  
  const title = job.title.toLowerCase();
  const company = job.company.toLowerCase();
  const tags = job.tags.map(t => t.toLowerCase());
  
  return patterns.some(pattern => 
    title.includes(pattern) ||
    company.includes(pattern) ||
    tags.some(t => t.includes(pattern))
  );
}
