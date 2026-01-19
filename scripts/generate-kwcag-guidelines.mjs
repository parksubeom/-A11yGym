import fs from "node:fs";
import path from "node:path";

/**
 * Minimal CSV parser that supports:
 * - commas
 * - quoted fields
 * - escaped quotes ("")
 * - newlines inside quoted fields
 */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        const next = text[i + 1];
        if (next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (ch === "\r") continue;

    if (ch === "\n") {
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
      continue;
    }

    field += ch;
  }

  // last row
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function escapeTsString(s) {
  return s
    .replaceAll("\\", "\\\\")
    .replaceAll("`", "\\`")
    .replaceAll("${", "\\${");
}

function inferPrincipleById(id) {
  // Derived from the provided KWCAG checklist CSV structure:
  // 1-9: Perceivable, 10-20: Operable, 21-31: Understandable, 32-33: Robust
  if (id >= 1 && id <= 9) return "perceivable";
  if (id >= 10 && id <= 20) return "operable";
  if (id >= 21 && id <= 31) return "understandable";
  return "robust";
}

function extractTitleAndDescription(guidelineOriginal) {
  // Example: "(적절한 대체 텍스트 제공) 텍스트 아닌 콘텐츠는 ..."
  const open = guidelineOriginal.indexOf("(");
  const close = guidelineOriginal.indexOf(")");
  if (open !== -1 && close !== -1 && close > open) {
    const title = guidelineOriginal.slice(open + 1, close).trim();
    const description = guidelineOriginal.slice(close + 1).trim().replace(/^\s+/, "");
    return { title, description };
  }
  return { title: guidelineOriginal.trim(), description: guidelineOriginal.trim() };
}

const workspaceRoot = process.cwd();
const csvPath = path.join(workspaceRoot, "docs", "kwcag-guidelines.utf8.csv");

if (!fs.existsSync(csvPath)) {
  throw new Error(
    `Missing ${csvPath}. Run scripts/convert-kwcag-csv.ps1 first to generate the UTF-8 CSV.`
  );
}

const csvText = fs.readFileSync(csvPath, "utf8");
const rows = parseCsv(csvText).filter((r) => r.some((c) => (c ?? "").trim() !== ""));
const header = rows[0].map((h) => (h ?? "").trim());

const idxId = header.indexOf("고유 번호");
const idxOriginal = header.indexOf("지침_원문");

if (idxId === -1 || idxOriginal === -1) {
  throw new Error(
    `Unexpected header. Need columns '고유 번호' and '지침_원문'. Got: ${header.join(", ")}`
  );
}

/** @type {Map<number, {code: string, title: string, description: string, principle: string}>} */
const byId = new Map();

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  const rawId = (r[idxId] ?? "").trim();
  if (!rawId) continue;
  const id = Number.parseInt(rawId, 10);
  if (!Number.isFinite(id)) continue;

  const original = (r[idxOriginal] ?? "").trim();
  if (!original) continue;

  if (!byId.has(id)) {
    const { title, description } = extractTitleAndDescription(original);
    byId.set(id, {
      code: String(id),
      title,
      description,
      principle: inferPrincipleById(id),
    });
  }
}

const guidelines = [...byId.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([, g]) => g);

const outPath = path.join(workspaceRoot, "constants", "kwcag-guidelines.ts");

const ts = `// AUTO-GENERATED from docs/kwcag-guidelines.utf8.csv
// Source: (user-provided) '웹 접근성 텍스트 gems.CSV' converted to UTF-8
// DO NOT EDIT MANUALLY: run scripts/convert-kwcag-csv.ps1 then scripts/generate-kwcag-guidelines.mjs

export interface Guideline {
  code: string; // e.g. "1"
  title: string;
  description: string;
  principle: 'perceivable' | 'operable' | 'understandable' | 'robust';
}

export const KWCAG_GUIDELINES: readonly Guideline[] = [
${guidelines
  .map(
    (g) => `  {
    code: "${escapeTsString(g.code)}",
    title: "${escapeTsString(g.title)}",
    description: "${escapeTsString(g.description)}",
    principle: "${g.principle}",
  },`
  )
  .join("\n")}
] as const;

export function getGuidelineByCode(code: string): Guideline | undefined {
  return KWCAG_GUIDELINES.find((g) => g.code === code);
}

export function getGuidelinesByPrinciple(principle: Guideline['principle']): Guideline[] {
  return KWCAG_GUIDELINES.filter((g) => g.principle === principle);
}
`;

fs.writeFileSync(outPath, ts, "utf8");
console.log(`Wrote ${outPath} (${guidelines.length} guidelines)`);


