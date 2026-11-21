export function isoOf(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO() {
  return isoOf(new Date());
}

export function parseISO(value) {
  if (!value) return new Date(NaN);
  const parts = String(value).split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return new Date(NaN);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export function longDate(value = new Date()) {
  return new Date(value).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function shortDate(value) {
  const d = value instanceof Date ? value : parseISO(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function dayOfMonth(value) {
  const d = value instanceof Date ? value : parseISO(value);
  if (Number.isNaN(d.getTime())) return "—";
  return String(d.getDate()).padStart(2, "0");
}

export function monthShort(value) {
  const d = value instanceof Date ? value : parseISO(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
}

export function monthName(month) {
  return new Date(2024, month, 1).toLocaleDateString("en-GB", { month: "long" });
}

export function greeting(name) {
  const hour = new Date().getHours();
  const part = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  return { part, text: `Good ${part},` };
}

export function daysUntil(value) {
  const target = value instanceof Date ? value : parseISO(value);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((b - a) / 86400000);
}

export function relativeDay(value) {
  const d = daysUntil(value);
  if (d === null) return "";
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d > 1 && d < 7) return `In ${d} days`;
  if (d < 0 && d > -2) return "Yesterday";
  return "";
}

export function monthCells(year, month) {
  const first = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i += 1) cells.push(null);
  for (let d = 1; d <= total; d += 1) cells.push(d);
  return cells;
}

export function truncate(text, max = 80) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}
