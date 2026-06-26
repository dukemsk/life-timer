export function parseFlexibleNumber(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeNumericInput(value: string): string {
  const normalized = value.replace(",", ".").replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
  if (normalized.startsWith(".")) return `0${normalized}`;
  if (/^0+\d/.test(normalized)) return normalized.replace(/^0+(?=\d)/, "");
  return normalized;
}
