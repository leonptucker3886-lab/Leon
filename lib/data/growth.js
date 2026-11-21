export const growth = [
  {
    id: "health",
    cat: "growth",
    title: "Relationship Health",
    deck: "An honest pulse, not a verdict.",
    minutes: 8,
    kind: "scale",
    questions: [
      { q: "We rarely go to bed angry at each other." },
      { q: "I genuinely celebrate their wins, without a shadow of comparison." },
      { q: "I can disagree without fearing the reaction." },
      { q: "We prioritise us when life gets heavy." },
      { q: "There is more laughter here than tension." },
      { q: "They make me feel chosen, on ordinary days." },
      { q: "We handle outside stress as a team, not as opponents." },
      { q: "I am proud to be with them." },
      { q: "We have grown together rather than alongside each other." },
      { q: "If I could begin again, I would still choose this." },
    ],
    bands: [
      {
        min: 85,
        title: "Thriving",
        text: "This is a strong room. The danger in a good season is silence — not because anything is wrong, but because nothing forces the conversation. Name what is working while it is working. It is harder to protect something you have never described out loud.",
      },
      {
        min: 70,
        title: "Holding",
        text: "Real strength, with a few soft places. The scores that pulled this down are the useful part of this session. Take the lowest two statements into a conversation this week, one at a time, without defending anything.",
      },
      {
        min: 55,
        title: "Nurtured, unevenly",
        text: "A foundation, and some neglect. Couples rarely fall apart in one event; they erode through the ordinary weeks nobody tended. Pick one statement you scored low and change one behaviour behind it. Not a grand gesture — a small, repeatable one.",
      },
      {
        min: 40,
        title: "Under strain",
        text: "Something is asking for attention. This is not a verdict on the relationship, but it is a signal against waiting. Say the sentence you have been editing: I am not sure we are all right, and I want us to be. Then let them answer without correcting them.",
      },
      {
        min: 0,
        title: "Needs care now",
        text: "The two of you are carrying something heavy. Do not use a score to prosecute each other. Use it to slow down. One honest conversation, without a scorecard, with a question rather than an accusation. If it keeps landing badly, a good couples therapist is not an admission of failure — it is maintenance.",
      },
    ],
  },

  {
    id: "dreams",
    cat: "growth",
    title: "Dreams & Alignment",
    deck: "Where you are going, and whether it is the same direction.",
    minutes: 9,
    kind: "scale",
    questions: [
      { q: "I can picture us in the same city in five years." },
      { q: "We are aligned on whether we want children." },
      { q: "Our ideas of financial security are compatible." },
      { q: "I can see us together in ten years." },
      { q: "We are building something, not only existing alongside each other." },
      { q: "We speak honestly about the long-term future." },
      { q: "I feel we are moving in the same direction." },
      { q: "We make large decisions well together." },
      { q: "I am excited about what we are making." },
      { q: "If I could begin again, I would still choose this." },
    ],
    bands: [
      {
        min: 85,
        title: "Aligned",
        text: "You are pointing at the same horizon. The next useful conversation is not whether you agree, but which of you is carrying which part of the plan — and what each of you would need if the plan changed.",
      },
      {
        min: 70,
        title: "Mostly aligned",
        text: "The large shape matches; the details have not been said out loud. Choose one statement here and give it a sentence you have both been avoiding. Alignment is not agreement. It is knowing precisely where you differ.",
      },
      {
        min: 55,
        title: "Partly aligned",
        text: "There is a real relationship here and a genuine fork somewhere. The fork is more useful than the average. Find the lowest statement, and ask the plain question behind it — not the diplomatic version. Then listen to the answer without negotiating it.",
      },
      {
        min: 40,
        title: "Unspoken distance",
        text: "You may be committing to different futures quietly. Avoidance feels kind in the short term and cruel over years. Each of you writes what you want in ten years, without reference to the other, then reads it aloud. The gap is information, not betrayal.",
      },
      {
        min: 0,
        title: "A needed conversation",
        text: "This is the conversation that will not stay postponed. It does not have to be one conversation, and it should not be one argument. Start with what you each want, not with what you will not accept. Clarity here is kinder than another year of not asking.",
      },
    ],
  },

  {
    id: "money",
    cat: "growth",
    title: "Money",
    deck: "The conversation most couples postpone until it costs them.",
    minutes: 7,
    kind: "choice",
    questions: [
      {
        q: "Your natural relationship with money is…",
        opts: [
          { text: "Security first. Saving is how you sleep.", key: "SAV" },
          { text: "Life is now. You would rather live it.", key: "SPD" },
          { text: "Long-term. You build and compound deliberately.", key: "INV" },
          { text: "Uneven. Seasons of discipline, seasons of not.", key: "MIX" },
        ],
      },
      {
        q: "In a shared life, money should be…",
        opts: [
          { text: "Merged, with full transparency", key: "SAV" },
          { text: "Separate, with shared costs split", key: "SPD" },
          { text: "Both — joint for goals, personal for the rest", key: "INV" },
          { text: "Whatever works; no fixed rule", key: "MIX" },
        ],
      },
      {
        q: "Debt is…",
        opts: [
          { text: "Something to clear as fast as possible", key: "SAV" },
          { text: "Normal, if it is managed", key: "SPD" },
          { text: "A tool, when it buys an asset", key: "INV" },
          { text: "Entirely dependent on what it is for", key: "MIX" },
        ],
      },
      {
        q: "Your honest financial fear is…",
        opts: [
          { text: "That you are not building enough", key: "SAV" },
          { text: "That an emergency would undo everything", key: "SPD" },
          { text: "That you and I are not on the same page", key: "INV" },
          { text: "You do not carry much of it, honestly", key: "MIX" },
        ],
      },
      {
        q: "The money conversation you avoid is…",
        opts: [
          { text: "Your debt, or your past mistakes", key: "SAV" },
          { text: "Where it actually goes each month", key: "SPD" },
          { text: "Long-term planning — retirement, a house, all of it", key: "INV" },
          { text: "What each of you means by enough", key: "MIX" },
        ],
      },
    ],
    profiles: {
      SAV: {
        title: "The Saver",
        short: "Saver",
        body: "You buy safety with restraint. Money is not the point; the feeling of a floor beneath you is. In a shared life, your risk is treating every spend as a small threat, and making the other person feel monitored. Agree the number that is genuinely untouchable, and let the rest be spent without commentary.",
      },
      SPD: {
        title: "The Spender",
        short: "Spender",
        body: "You believe money exists to be lived with. Generosity is one of your better qualities, and it is also how you avoid hard conversations. In a shared life, the risk is a quiet gap between what you spend and what you have told them. Say the real number first. It is less frightening once it is spoken.",
      },
      INV: {
        title: "The Builder",
        short: "Builder",
        body: "You think in decades. You are comfortable deferring pleasure for a structure that will hold. In a shared life, the risk is treating your plan as the only rational one, and leaving the other person outside a decision they thought was joint. Bring them into the reasoning, not only the conclusion.",
      },
      MIX: {
        title: "The Uneven One",
        short: "Uneven",
        body: "Your relationship with money runs in seasons. You are not careless so much as inconsistent, and you know it. In a shared life, the risk is that your partner cannot predict you. A small, boring, automatic system — one transfer, one number you both can see — will do more for your relationship than any amount of resolve.",
      },
    },
  },
];
