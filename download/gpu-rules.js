// Applies RedFoxOS's graphics rules (gpu-rules.json in the redfox-os repo) to a
// list of display devices. The same file drives RedFox Hub's "(Recommended)",
// so this only interprets it: the rules themselves live there.
// Tested against redfox-os's tests/gpu-cases.json by test-gpu-rules.mjs.
(function (root) {
  const hex = (s) => parseInt(String(s).toLowerCase().replace(/^0x/, ''), 16);

  // devices: [[vendor, device], ...] as hex strings. Returns the first
  // matching rule: {image (or null), why, hybrid}.
  function recommend(rules, devices) {
    const have = new Set(devices.map(([vendor, device]) => {
      const v = String(vendor).toLowerCase().replace(/^0x/, '');
      const match = rules.classes.find((c) => c.vendors.includes(v)
        && (c.device_from == null || hex(device) >= hex(c.device_from)));
      return match ? match.id : 'other';
    }));
    const rule = rules.rules.find((r) => r.all.every((c) => have.has(c))
      && (r.none || []).every((c) => !have.has(c)));
    return { image: rule.image, why: rule.why, hybrid: Boolean(rule.hybrid) };
  }

  // "RFX1 8086:46a6 10de:1c03" (or "RFX1 none") -> [["8086","46a6"], ...];
  // null if it isn't a code.
  function parseCode(text) {
    const m = String(text).trim().match(/^RFX1\b(.*)$/i);
    if (!m) return null;
    const rest = m[1].trim();
    if (rest === '' || /^none$/i.test(rest)) return [];
    const devices = [];
    for (const part of rest.split(/[\s,]+/)) {
      const d = part.match(/^([0-9a-f]{4}):([0-9a-f]{4})$/i);
      if (!d) return null;
      devices.push([d[1].toLowerCase(), d[2].toLowerCase()]);
    }
    return devices;
  }

  const api = { recommend, parseCode };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RedFoxGpu = api;
})(typeof window !== 'undefined' ? window : globalThis);
