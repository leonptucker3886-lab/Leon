const STOP = new Set(
  `a about above after again against all am an and any are aren't as at be because been before being below between both but by can cannot could couldn't did didn't do does doesn't doing don't down during each few for from further had hadn't has hasn't have haven't having he her here hers herself him himself his how i i'm i've if in into is isn't it it's its itself just me more most my myself no nor not of off on once only or other ought our ours ourselves out over own same shan't she should shouldn't so some such than that that's the their theirs them themselves then there these they this those through to too under until up very was wasn't we were weren't what when where which while who whom why will with won't would wouldn't you your yours yourself yourselves`
    .split(/\s+/)
    .filter(Boolean)
);

const EXTRA_STOP = `said says saying tell tells told ask asks asked went go goes going gone got get gets getting made make makes making take takes took taken come comes came coming really actually maybe probably perhaps quite rather still even again around away back down out off over under here there thing things something anything nothing everything lot bit kind sort want wants wanted need needs needed feel feels felt think thinks thought know knows knew guess suppose mean means meant did does doing done have has had having do yet just also very too much many more most less least own same other another each every either neither few several such than then thus hence`.split(
  /\s+/
);
EXTRA_STOP.forEach((word) => STOP.add(word));

const FEELING = /\b(feel|felt|hurt|angry|sad|tired|lonely|scared|afraid|anxious|embarrassed|ashamed|overwhelmed|exhausted|upset|ignored|dismissed|unseen|unheard|small|stupid|awful|terrible)\b/i;
const NEED = /\b(i need|i want|i wish|i would like|i'd like|what i need|all i want|i was hoping|i just want|please)\b/i;
const ACKNOWLEDGE = /\b(i understand|i hear|i see your|you're right|you are right|fair enough|my part|my fault|i was wrong|i did wrong|i'm sorry|i am sorry|i apolog|i should have|i shouldn't have)\b/i;
const ABSOLUTE = /\b(always|never|every time|constantly|nothing|nobody|everything|anything)\b/gi;
const YOU = /\byou\b/gi;
const VERDICT = /\b(you are|you're|you were|you always|you never|the problem is|you need to|you should|you made me)\b/gi;

function sentences(text) {
  return String(text || "")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

function tokens(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w))
    .map((w) => (w.length > 4 && !w.endsWith("ss") ? w.replace(/(es|s)$/, "") : w));
}

function countMatches(text, re) {
  const matches = String(text || "").match(re);
  return matches ? matches.length : 0;
}

function shorten(text, max = 190) {
  const clean = String(text || "").trim().replace(/\s+/g, " ");
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(cut.lastIndexOf("."), cut.lastIndexOf(","), cut.lastIndexOf(";"));
  return `${(stop > 80 ? cut.slice(0, stop) : cut).trim()}…`;
}

function bestLine(text) {
  const list = sentences(text);
  if (!list.length) return "";
  let best = list[0];
  let score = -1;
  list.forEach((s) => {
    let value = 0;
    if (FEELING.test(s)) value += 3;
    if (NEED.test(s)) value += 3;
    if (/\bi\b/i.test(s)) value += 1;
    if (s.length > 35 && s.length < 210) value += 2;
    if (s.length > 300) value -= 2;
    if (value > score) {
      score = value;
      best = s;
    }
  });
  return shorten(best);
}

function needClause(text, exclude) {
  const line = sentences(text).find(
    (s) => NEED.test(s) && shorten(s, 190) !== exclude
  );
  if (line) return shorten(line, 150);
  return null;
}

function orientation(text) {
  const feel = countMatches(text, FEELING);
  const you = countMatches(text, YOU);
  const verdict = countMatches(text, VERDICT);
  const length = sentences(text).length;
  if (feel >= 2 && feel >= verdict) return "from the feeling inward";
  if (NEED.test(text)) return "from what they want, outward";
  if (verdict >= 2 && you > 4) return "in verdicts more than specifics";
  if (length >= 3) return "from the sequence of events";
  return "between the event and the feeling";
}

function analyse(side) {
  const text = String(side?.text || "");
  const words = tokens(text);
  const absolutes = countMatches(text, ABSOLUTE);
  const you = countMatches(text, YOU);
  const verdict = countMatches(text, VERDICT);
  const acknowledges = ACKNOWLEDGE.test(text);
  const line = bestLine(text);
  const need = needClause(text, line);
  return {
    name: side?.name || "—",
    text,
    length: text.trim().length,
    words,
    absolutes,
    you,
    verdict,
    acknowledges,
    line,
    need,
    needInLine: !need && NEED.test(line),
    orientation: orientation(text),
    short: text.trim().length < 120,
  };
}

function overlap(a, b) {
  const setB = new Set(b.words);
  const counts = new Map();
  a.words.forEach((w) => {
    if (setB.has(w)) counts.set(w, (counts.get(w) || 0) + 1);
  });
  return [...counts.entries()].sort((x, y) => y[1] - x[1]).map((x) => x[0]).slice(0, 3);
}

function joinWords(words) {
  if (words.length === 1) return words[0];
  if (words.length === 2) return `${words[0]} and ${words[1]}`;
  return `${words[0]}, ${words[1]} and ${words[2]}`;
}

export function readCase({ topic, sides }) {
  const [a, b] = sides.map(analyse);
  if (!a || !b || !a.text.trim() || !b.text.trim()) return null;
  const shared = overlap(a, b);
  const bothCertain = a.absolutes + b.absolutes >= 4 || a.verdict + b.verdict >= 5;
  const onlyOneAcknowledges = a.acknowledges !== b.acknowledges;
  const claim = String(topic || "").trim();

  const headline = bothCertain
    ? "Two accounts, both certain."
    : onlyOneAcknowledges
    ? "One of you is already at the table."
    : shared.length
    ? "The same evening, twice."
    : "Two rooms, not yet the same argument.";

  const sharedParts = [];
  if (shared.length) {
    const named = shared.map((word) => `“${word}”`);
    sharedParts.push(
      `You both keep returning to ${joinWords(named)}. That is probably the real subject; the rest is detail.`
    );
  } else {
    sharedParts.push(
      "The two accounts barely share a vocabulary. That is worth noticing: you may be describing the same thing from different rooms."
    );
  }
  if (claim) {
    sharedParts.push(
      `The stated subject is “${shorten(claim, 90)}”. Notice how far each account travels from it.`
    );
  }
  const ratio = Math.max(a.length, b.length) / Math.max(1, Math.min(a.length, b.length));
  if (ratio >= 2.2) {
    const long = a.length > b.length ? a : b;
    const brief = a.length > b.length ? b : a;
    sharedParts.push(
      `${long.name} has written more than twice as much as ${brief.name}. Length is not rightness. The shorter account may be holding the harder sentence.`
    );
  }

  const readFor = (side, other) => {
    const parts = [];
    parts.push(`${side.name} writes ${side.orientation}.`);
    if (side.line) {
      parts.push(`The line carrying the most weight is “${side.line}”`);
    }
    if (side.need) {
      parts.push(`Underneath it, the ask is: “${side.need}”`);
    } else if (side.needInLine) {
      parts.push(
        "The ask is inside that same sentence, not yet separated from the grievance."
      );
    } else {
      parts.push("They have not yet said what they want — only what went wrong.");
    }
    if (side.absolutes >= 2) {
      parts.push(
        "There are absolutes in the account — always, never, every time — and that usually means the feeling is older than this particular incident."
      );
    }
    if (side.acknowledges) {
      parts.push(
        "There is also an admission in here. That matters, and it should be noticed before the next point is made."
      );
    }
    if (side.short) {
      parts.push(
        "The account is short. Brevity is not indifference; it is often the edge of the thing that is hardest to say."
      );
    }
    if (side.verdict >= 3 && side.acknowledges === false) {
      parts.push(
        `Most of the sentences point at ${other.name}. An account made only of accusations is usually protecting one sentence the writer cannot yet say.`
      );
    }
    return parts.join(" ");
  };

  let step;
  if (a.acknowledges && b.acknowledges) {
    step =
      "Before either of you adds another point, each names one thing the other got right. Then decide only the next occurrence — not the whole pattern.";
  } else if (onlyOneAcknowledges) {
    const who = a.acknowledges ? a : b;
    const other = a.acknowledges ? b : a;
    step = `${who.name} asks, plainly, what would make the repair complete. ${other.name} repeats it back before responding. No edits, no additions.`;
  } else if (ratio >= 2.2) {
    const brief = a.length > b.length ? b : a;
    const long = a.length > b.length ? a : b;
    step = `${long.name} asks ${brief.name} for the part that was left out, and then says nothing until it has all arrived.`;
  } else if (a.verdict + b.verdict >= 5) {
    step =
      "Twenty minutes, phones away. Each of you says one sentence about what you want to be different next time. No examples from the past, no rebuttals.";
  } else if (shared.length) {
    step = `Set aside twenty minutes. ${a.name} speaks for four minutes without interruption; ${b.name} repeats back what they heard before replying. Then swap.`;
  } else {
    step =
      "Write one sentence each beginning with what I want, not what you did. Read them aloud in that order, and do not respond to the other sentence tonight.";
  }

  return {
    headline,
    shared: sharedParts.join(" "),
    reads: [
      { name: a.name, text: readFor(a, b) },
      { name: b.name, text: readFor(b, a) },
    ],
    step,
    note: "Composed on this device from what you both wrote. No model, no server, no audience.",
  };
}
