// Shared helpers for the three sites. No framework; per-hotel data is fetched on demand.
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
const pct = (x, d = 1) => x == null ? "n/a" : (100 * x).toFixed(d) + "%";
const fmt = x => x == null ? "n/a" : Number(x).toLocaleString("en-US");
const ci = (lo, hi, d = 1) => lo == null ? "" : `95% CI ${(100 * lo).toFixed(d)} to ${(100 * hi).toFixed(d)}%`;
const signed = (x, d = 1) => x == null ? "n/a" : (x > 0 ? "+" : x < 0 ? "-" : "") + Math.abs(100 * x).toFixed(d) + " pts";
const relPrice = p => p == null ? "" : (p > 0 ? "+" : p < 0 ? "-" : "") + Math.abs(p) + "%";
const $ = id => document.getElementById(id);
// every build stamps its own version, so a rebuild never mixes a new page with data cached from an old one
const BUILD = "20260927142207";
async function getJSON(url) { const r = await fetch(url + (url.includes("?") ? "&" : "?") + "v=" + BUILD, {cache: "no-cache"}); if (!r.ok) throw new Error(url + " " + r.status); return r.json(); }
function tip(text, help) { return `<span class="tip" title="${esc(help)}" tabindex="0">${esc(text)}</span>`; }
// simple labelled SVG bar chart: bins [{label, value}], axis titles required
function barChart(bins, {x, y, color = "#d77d50", width = 520, height = 220}) {
  const m = {l: 48, r: 10, t: 10, b: 46}, W = width - m.l - m.r, H = height - m.t - m.b;
  const max = Math.max(1, ...bins.map(b => b.value)), bw = W / bins.length;
  const ticks = [0, 0.5, 1].map(f => Math.round(max * f));
  let s = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(y)} by ${esc(x)}" style="width:100%;height:auto;max-width:${width}px">`;
  ticks.forEach(t => { const yy = m.t + H - H * t / max; s += `<line x1="${m.l}" x2="${m.l + W}" y1="${yy}" y2="${yy}" stroke="#eee"/><text x="${m.l - 6}" y="${yy + 4}" text-anchor="end">${fmt(t)}</text>`; });
  bins.forEach((b, i) => { const h = H * b.value / max, xx = m.l + i * bw;
    s += `<rect x="${xx + 2}" y="${m.t + H - h}" width="${Math.max(1, bw - 4)}" height="${h}" fill="${color}" rx="2"><title>${esc(b.label)}: ${fmt(b.value)}</title></rect>`;
    s += `<text x="${xx + bw / 2}" y="${m.t + H + 14}" text-anchor="middle">${esc(b.label)}</text>`; });
  s += `<text x="${m.l + W / 2}" y="${height - 6}" text-anchor="middle" style="fill:#2c2c2c">${esc(x)}</text>`;
  s += `<text transform="translate(12 ${m.t + H / 2}) rotate(-90)" text-anchor="middle" style="fill:#2c2c2c">${esc(y)}</text></svg>`;
  return s;
}
