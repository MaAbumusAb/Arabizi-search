// Simple, offline Arabizi-to-Arabic candidate generator.
// This is a heuristic PoC, not a complete transliteration standard.
(function (global) {
  const DIGRAPHS = [
    ["sh", "ش"], ["kh", "خ"], ["gh", "غ"], ["th", "ث"],
    ["dh", "ذ"], ["ch", "تش"], ["aa", "ا"], ["ee", "ي"],
    ["ii", "ي"], ["oo", "و"], ["uu", "و"]
  ];
  const SINGLE = {
    "2": ["ء", "أ"], "3": ["ع"], "5": ["خ"], "6": ["ط"],
    "7": ["ح"], "8": ["غ"], "9": ["ص"],
    "a": ["ا"], "b": ["ب"], "t": ["ت"], "j": ["ج"],
    "d": ["د"], "r": ["ر"], "z": ["ز"], "s": ["س", "ص"],
    "f": ["ف"], "q": ["ق"], "k": ["ك"], "l": ["ل"],
    "m": ["م"], "n": ["ن"], "h": ["ه"], "w": ["و"],
    "y": ["ي"], "g": ["ج"], "e": ["ي"], "o": ["و"],
    "i": ["ي"], "u": ["و"], "p": ["ب"], "c": ["ك"],
    "x": ["كس"], "v": ["ف"]
  };

  function normalize(input) {
    return input.toLowerCase().trim()
      .replace(/[’‘`]/g, "'")
      .replace(/\s+/g, " ")
      .replace(/(.)\1{2,}/g, "$1$1");
  }

  function tokenize(input) {
    const s = normalize(input);
    const tokens = [];
    for (let i = 0; i < s.length;) {
      if (s[i] === " ") { tokens.push(" "); i++; continue; }
      const pair = s.slice(i, i + 2);
      if (DIGRAPHS.some(([k]) => k === pair)) {
        tokens.push(pair); i += 2;
      } else {
        tokens.push(s[i]); i++;
      }
    }
    return tokens;
  }

  function candidates(input, limit = 32) {
    const tokens = tokenize(input);
    let partials = [""];
    for (const token of tokens) {
      let options;
      if (token === " ") options = [" "];
      else {
        const digraph = DIGRAPHS.find(([k]) => k === token);
        options = digraph ? [digraph[1]] : (SINGLE[token] || [token]);
      }
      const next = [];
      for (const p of partials) for (const o of options) {
        next.push(p + o);
        if (next.length >= limit) break;
      }
      partials = next.slice(0, limit);
    }
    return [...new Set(partials.map(s => s.replace(/\s+/g, " ").trim()).filter(Boolean))];
  }

  global.ArabiziTransliteration = { normalize, candidates };
})(window);
