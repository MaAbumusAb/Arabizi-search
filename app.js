const input = document.getElementById("searchInput");
const resultsEl = document.getElementById("results");
const statusEl = document.getElementById("status");
const toggle = document.getElementById("phoneticToggle");
const clearBtn = document.getElementById("clearButton");
let dataset = [];

async function loadDataset() {
  try {
    const response = await fetch("./data/arabizi_dataset.json");
    if (!response.ok) throw new Error("Dataset could not be loaded");
    dataset = await response.json();
    statusEl.textContent = `${dataset.length} dictionary entries loaded locally`;
  } catch (error) {
    statusEl.textContent = "Could not load dataset. Run this project through a local web server.";
    console.error(error);
  }
}

function norm(s) {
  return ArabiziTransliteration.normalize(s).replace(/[ًٌٍَُِّْٰـ]/g, "").trim();
}

function includesAny(values, query) {
  return (values || []).some(v => norm(v) === query);
}

function search(query) {
  const q = norm(query);
  if (!q) return [];
  const candidates = toggle.checked ? ArabiziTransliteration.candidates(q) : [];
  const candidateSet = new Set(candidates.map(norm));
  const scored = [];

  for (const entry of dataset) {
    let score = 0, reason = "";
    const roman = [...(entry.romanized || []), ...(entry.arabizi || [])];
    if (includesAny(roman, q)) { score = 100; reason = "Exact Romanized / Arabizi match"; }
    else if (norm(entry.arabic) === q) { score = 110; reason = "Exact Arabic match"; }
    else if (toggle.checked && candidateSet.has(norm(entry.arabic))) {
      score = 80; reason = "Transliteration suggestion";
    } else if (roman.some(v => norm(v).startsWith(q) && q.length >= 3)) {
      score = 45; reason = "Partial spelling match";
    } else if (toggle.checked && candidates.some(c => norm(entry.arabic).startsWith(norm(c)) && norm(c).length >= 2)) {
      score = 30; reason = "Possible transliteration";
    }
    if (score) scored.push({ entry, score, reason });
  }
  return scored.sort((a,b) => b.score - a.score || a.entry.arabic.localeCompare(b.entry.arabic)).slice(0, 20);
}

function render(items, query) {
  resultsEl.innerHTML = "";
  if (!query.trim()) {
    resultsEl.innerHTML = '<div class="empty">Type a word to explore possible Arabic matches.</div>';
    return;
  }
  if (!items.length) {
    resultsEl.innerHTML = '<div class="empty">No match found. Try another spelling or enable phonetic search.</div>';
    return;
  }
  for (const item of items) {
    const e = item.entry;
    const card = document.createElement("article");
    card.className = "result-card";
    const top = document.createElement("div"); top.className = "result-top";
    const arabic = document.createElement("div"); arabic.className = "arabic"; arabic.dir = "rtl"; arabic.textContent = e.arabic;
    const tag = document.createElement("span"); tag.className = "tag"; tag.textContent = item.reason;
    top.append(arabic, tag);
    const meaning = document.createElement("div"); meaning.className = "meaning"; meaning.textContent = (e.english || []).join(", ");
    const variants = document.createElement("div"); variants.className = "variants";
    variants.textContent = `Romanized: ${(e.romanized || []).join(", ") || "—"}  ·  Arabizi: ${(e.arabizi || []).join(", ") || "—"}`;
    const category = document.createElement("div"); category.className = "category"; category.textContent = e.category;
    card.append(top, meaning, variants, category);
    resultsEl.append(card);
  }
}

function runSearch() {
  const q = input.value;
  render(search(q), q);
}
input.addEventListener("input", runSearch);
toggle.addEventListener("change", runSearch);
clearBtn.addEventListener("click", () => { input.value = ""; runSearch(); input.focus(); });
loadDataset();
