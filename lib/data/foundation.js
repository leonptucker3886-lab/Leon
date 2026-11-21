export const foundation = [
  {
    id: "love-languages",
    cat: "foundation",
    title: "Love Languages",
    deck: "How you give it, and how you need to receive it.",
    minutes: 8,
    kind: "choice",
    questions: [
      {
        q: "You have had a rough week. What would feel most healing?",
        opts: [
          { text: "A long, specific message about how much you are valued", key: "WA" },
          { text: "An evening with their full, phone-free attention", key: "QT" },
          { text: "Something small and thoughtful waiting for you", key: "GG" },
          { text: "They quietly handled everything you were dreading", key: "AS" },
          { text: "Being held without any words for a long time", key: "PT" },
        ],
      },
      {
        q: "You express love most naturally by…",
        opts: [
          { text: "Saying it often, out loud and in writing", key: "WA" },
          { text: "Carving out time that belongs only to them", key: "QT" },
          { text: "Finding the thing they mentioned once, months ago", key: "GG" },
          { text: "Anticipating what they need and handling it", key: "AS" },
          { text: "Staying close — a hand, a shoulder, nearness", key: "PT" },
        ],
      },
      {
        q: "Your partner forgets an important date. What stings most?",
        opts: [
          { text: "They said nothing meaningful about it", key: "WA" },
          { text: "You never got real time together", key: "QT" },
          { text: "There was no gesture at all, not even a small one", key: "GG" },
          { text: "They did nothing to make the day lighter for you", key: "AS" },
          { text: "There was no warmth, no closeness, nothing physical", key: "PT" },
        ],
      },
      {
        q: "The most romantic thing they could do is…",
        opts: [
          { text: "Write you a long, unguarded letter out of nowhere", key: "WA" },
          { text: "Plan a whole day around what you love", key: "QT" },
          { text: "Show up with something that proves they were listening", key: "GG" },
          { text: "Take your entire list off your hands so you can rest", key: "AS" },
          { text: "Pull you into the kitchen to dance to nothing", key: "PT" },
        ],
      },
      {
        q: "You feel most disconnected when…",
        opts: [
          { text: "Appreciation stops being said out loud", key: "WA" },
          { text: "You stop having real time alone together", key: "QT" },
          { text: "Thoughtful gestures disappear entirely", key: "GG" },
          { text: "You are drowning and no one steps in", key: "AS" },
          { text: "Touch fades — less reaching, less warmth", key: "PT" },
        ],
      },
      {
        q: "After an argument, what makes you feel that things are okay?",
        opts: [
          { text: "Hearing sincere, specific words from them", key: "WA" },
          { text: "Sitting down together with nowhere else to be", key: "QT" },
          { text: "A small peace offering, even a tiny one", key: "GG" },
          { text: "Them doing something that shows it is repaired", key: "AS" },
          { text: "A real embrace — their body saying we are fine", key: "PT" },
        ],
      },
      {
        q: "Your ideal birthday with them looks like…",
        opts: [
          { text: "A card or a speech that actually moves you", key: "WA" },
          { text: "A full day with their complete presence", key: "QT" },
          { text: "One gift that shows they know exactly who you are", key: "GG" },
          { text: "Nothing on your plate but the day itself", key: "AS" },
          { text: "A great deal of affection, all day long", key: "PT" },
        ],
      },
      {
        q: "If your love language could speak, it would say…",
        opts: [
          { text: "Tell me. Say it plainly. Mean it.", key: "WA" },
          { text: "Put the phone down and be here.", key: "QT" },
          { text: "You thought of me when I was not in the room.", key: "GG" },
          { text: "You showed me. You did not just say it.", key: "AS" },
          { text: "Hold on. Do not let go yet.", key: "PT" },
        ],
      },
    ],
    profiles: {
      WA: {
        title: "Words",
        short: "Words",
        body: "Language is your currency. Specific, sincere words land somewhere physical in you — and you remember exactly what was said, and what was not. Silence reads as indifference. The answer is not more compliments; it is better ones, the kind that prove you were actually seen.",
      },
      QT: {
        title: "Time",
        short: "Time",
        body: "You measure love in attention. Not proximity — presence. Undivided, undistracted hours matter more to you than a whole weekend of half-attention. A phone in hand during your time together registers as a small rejection, every time.",
      },
      GG: {
        title: "Gifts",
        short: "Gifts",
        body: "This was never about money. A gift is evidence that someone held you in their mind while you were not there. A small, perfectly chosen thing beats an expensive careless one. Forgotten occasions hurt because they mean you were not thought of — that is the part that stings.",
      },
      AS: {
        title: "Service",
        short: "Service",
        body: "Love looks like being made lighter. When someone notices what you are carrying and takes it without being asked, your whole body registers it as care. Words are pleasant; effort is proof. Being told to ask for help can feel like being left alone with the weight.",
      },
      PT: {
        title: "Touch",
        short: "Touch",
        body: "Connection lives in your body. Touch is your first language for safety, love, and belonging. A hand on your back during a hard conversation is oxygen. Physical withdrawal during conflict is especially destabilising for you; it reads as the relationship itself withdrawing.",
      },
    },
  },

  {
    id: "apology-languages",
    cat: "foundation",
    title: "Apology Languages",
    deck: "What has to happen for an apology to actually reach you.",
    minutes: 6,
    kind: "choice",
    questions: [
      {
        q: "An apology feels real when they…",
        opts: [
          { text: "Look at you and say I was wrong, with no but", key: "EW" },
          { text: "Ask what would make it right, and then do it", key: "MR" },
          { text: "Let you see that they genuinely feel it", key: "GR" },
          { text: "Name what will change, specifically", key: "RC" },
          { text: "Ask you to forgive them, in those words", key: "RF" },
        ],
      },
      {
        q: "An apology falls flat when they…",
        opts: [
          { text: "Say sorry without ever naming what they did", key: "EW" },
          { text: "Apologise in words and repair nothing", key: "MR" },
          { text: "Sound mechanical, like reading a statement", key: "GR" },
          { text: "Apologise again for the same thing they keep doing", key: "RC" },
          { text: "Expect everything to resume without closing it", key: "RF" },
        ],
      },
      {
        q: "After conflict, you feel healed when…",
        opts: [
          { text: "You have heard them own the specific action", key: "EW" },
          { text: "Something concrete has been done to address it", key: "MR" },
          { text: "The air between you has actually changed", key: "GR" },
          { text: "There is a plan you believe in", key: "RC" },
          { text: "Forgiveness has been asked for, and you have given it", key: "RF" },
        ],
      },
      {
        q: "The line that lands deepest is…",
        opts: [
          { text: "I was wrong. There is no excuse for it.", key: "EW" },
          { text: "Tell me what you need from me to make this right.", key: "MR" },
          { text: "I feel terrible about what this did to you.", key: "GR" },
          { text: "Here is what I am changing so it does not happen again.", key: "RC" },
          { text: "Will you forgive me? I mean that.", key: "RF" },
        ],
      },
      {
        q: "You know you have moved on when…",
        opts: [
          { text: "The facts of what happened were acknowledged clearly", key: "EW" },
          { text: "A repair was made, not just described", key: "MR" },
          { text: "Something in your chest has loosened", key: "GR" },
          { text: "You trust the behaviour will be different", key: "RC" },
          { text: "Forgiveness was exchanged, out loud", key: "RF" },
        ],
      },
      {
        q: "The most healing apology you have received came from someone who…",
        opts: [
          { text: "Took full responsibility without deflecting an inch", key: "EW" },
          { text: "Backed the words with action afterwards", key: "MR" },
          { text: "Was visibly moved by what they had done", key: "GR" },
          { text: "Changed, and the change held", key: "RC" },
          { text: "Asked for your forgiveness humbly, and waited", key: "RF" },
        ],
      },
    ],
    profiles: {
      EW: {
        title: "Regret",
        short: "Regret",
        body: "You need the words, and you need them clean. I am sorry you felt that way is not an apology; I was wrong is. Naming the specific action is what opens the door. Partial accountability feels worse to you than none at all, because it asks you to accept a version of events you know is not true.",
      },
      MR: {
        title: "Repair",
        short: "Repair",
        body: "Words alone do not reach you. An apology becomes real when it is followed by something that addresses the harm. Eloquence followed by nothing is, for you, its own kind of insult. You are not demanding penance; you are asking to see that the apology cost something.",
      },
      GR: {
        title: "Remorse",
        short: "Remorse",
        body: "You need to feel that they feel it. A technically correct apology delivered without weight does not land. The visible experience of regret in your partner is what lets you soften. This is not a demand for performance; it is how you know the apology is not a strategy.",
      },
      RC: {
        title: "Change",
        short: "Change",
        body: "Trust is rebuilt in behaviour, not promises. You forgive when you see the pattern break. Repeated apologies without change teach you to stop believing the words, which is why you would rather hear less and see more. Your standard is fair, and it is also worth saying out loud.",
      },
      RF: {
        title: "Forgiveness",
        short: "Forgiveness",
        body: "You need the relational moment: the explicit ask, and the deliberate giving. It closes the loop. Apologies that trail off without asking for forgiveness leave you unsure whether reconciliation actually happened, and you carry that incompleteness longer than you let on.",
      },
    },
  },

  {
    id: "attachment",
    cat: "foundation",
    title: "Attachment",
    deck: "Your deepest relational wiring — where it came from, how it shows.",
    minutes: 10,
    kind: "choice",
    questions: [
      {
        q: "They have not replied for a few hours. You…",
        opts: [
          { text: "Assume they are busy and get on with your day", key: "SEC" },
          { text: "Check your phone more often than you would admit", key: "ANX" },
          { text: "Barely notice; you are absorbed in your own things", key: "AVO" },
        ],
      },
      {
        q: "The idea of them needing space feels…",
        opts: [
          { text: "Reasonable. You need it too.", key: "SEC" },
          { text: "Unsettling. You start looking for what changed.", key: "ANX" },
          { text: "Honestly, like a relief.", key: "AVO" },
        ],
      },
      {
        q: "When you sense them pulling away, you…",
        opts: [
          { text: "Say something gently and trust you can work it out", key: "SEC" },
          { text: "Move toward them; the distance makes you anxious", key: "ANX" },
          { text: "Pull away too. It is easier than confronting it.", key: "AVO" },
        ],
      },
      {
        q: "Vulnerability in a relationship feels…",
        opts: [
          { text: "Like the entire point of the thing", key: "SEC" },
          { text: "Terrifying, and you want it anyway", key: "ANX" },
          { text: "Uncomfortable. You would rather keep some distance.", key: "AVO" },
        ],
      },
      {
        q: "After a genuinely intimate conversation, you feel…",
        opts: [
          { text: "Closer, and glad you went there", key: "SEC" },
          { text: "Exposed. You watch them carefully afterwards.", key: "ANX" },
          { text: "A need to decompress. Intimacy tires you.", key: "AVO" },
        ],
      },
      {
        q: "Your biggest fear in a relationship is…",
        opts: [
          { text: "Honestly, not much — you feel fairly steady", key: "SEC" },
          { text: "Being left, or replaced by someone they prefer", key: "ANX" },
          { text: "Losing yourself, or your independence, entirely", key: "AVO" },
        ],
      },
      {
        q: "When conflict happens, your instinct is to…",
        opts: [
          { text: "Stay present and work it through", key: "SEC" },
          { text: "Resolve it now; the unresolved hum is unbearable", key: "ANX" },
          { text: "Go cold and retreat until you can think", key: "AVO" },
        ],
      },
      {
        q: "You find it easy to believe they genuinely love you.",
        opts: [
          { text: "Yes. You do not need constant proof.", key: "SEC" },
          { text: "Sometimes. You need more reassurance than you would like.", key: "ANX" },
          { text: "You keep a layer of scepticism as protection.", key: "AVO" },
        ],
      },
      {
        q: "When things are going really well, you sometimes feel…",
        opts: [
          { text: "Grateful. Good things can simply be good.", key: "SEC" },
          { text: "Like you are waiting for the other shoe to drop", key: "ANX" },
          { text: "Slightly suspicious of how easy it feels", key: "AVO" },
        ],
      },
      {
        q: "Love in your childhood was mostly…",
        opts: [
          { text: "Consistent. You knew it would be there.", key: "SEC" },
          { text: "Present but unpredictable, sometimes withdrawn", key: "ANX" },
          { text: "Distant or conditional; closeness did not feel safe", key: "AVO" },
        ],
      },
    ],
    profiles: {
      SEC: {
        title: "Secure",
        short: "Secure",
        body: "You come to love from a place of safety: trusting, capable of intimacy without disappearing into it. This is not luck. Secure attachment is usually built — through self-knowledge, through relationships that kept their word, through choosing to stay when leaving would have been easier. Your work now is not repair but maintenance: keep naming what you need before you stop needing to.",
      },
      ANX: {
        title: "Anxious",
        short: "Anxious",
        body: "You love with intensity and a low hum of fear underneath it. Somewhere early, love was sometimes there and sometimes withheld, and your nervous system learned to watch for the shift. You notice small distances before anyone else does. The work is not to need less — it is to build enough steadiness inside that the fear does not speak before you do, and to choose someone whose consistency makes the watching unnecessary.",
      },
      AVO: {
        title: "Avoidant",
        short: "Avoidant",
        body: "You are self-contained by design. Independence is oxygen, and too much closeness can feel like a hand at your throat — not because you do not care, but because proximity was once associated with discomfort. You often feel more than you show, and leave rooms before anyone can leave you. The growth edge is small and repeated: stay ten minutes longer than is comfortable, and say the true thing before you have organised it.",
      },
    },
  },

  {
    id: "conflict",
    cat: "foundation",
    title: "Conflict",
    deck: "How you fight, how you escalate, how you come back.",
    minutes: 8,
    kind: "choice",
    questions: [
      {
        q: "When they hurt you, your first instinct is to…",
        opts: [
          { text: "Say something directly, even if the timing is imperfect", key: "DIR" },
          { text: "Understand your own feelings before you speak", key: "MED" },
          { text: "Let it go unless it becomes a pattern", key: "PAC" },
          { text: "Go quiet and take time alone", key: "WIT" },
        ],
      },
      {
        q: "Mid-argument, they raise their voice. You…",
        opts: [
          { text: "Match the energy; heat is not the enemy", key: "DIR" },
          { text: "Try to bring the temperature down", key: "MED" },
          { text: "Apologise quickly so it stops", key: "PAC" },
          { text: "Shut down, or leave the room", key: "WIT" },
        ],
      },
      {
        q: "What you actually need during a fight is…",
        opts: [
          { text: "The real issue named and addressed", key: "DIR" },
          { text: "To feel listened to, not merely waited out", key: "MED" },
          { text: "For the tension to stop; resolution can wait", key: "PAC" },
          { text: "Time alone before you re-engage", key: "WIT" },
        ],
      },
      {
        q: "After a big argument, you feel resolved when…",
        opts: [
          { text: "You reached a real conclusion, not a ceasefire", key: "DIR" },
          { text: "You both understood each other's side", key: "MED" },
          { text: "Things feel normal again", key: "PAC" },
          { text: "You had space, then reconnected on your terms", key: "WIT" },
        ],
      },
      {
        q: "In conflict, you tend to be criticised for…",
        opts: [
          { text: "Being too intense, going too hard", key: "DIR" },
          { text: "Over-analysing, making it complicated", key: "MED" },
          { text: "Never saying what you actually think", key: "PAC" },
          { text: "Shutting down and leaving them hanging", key: "WIT" },
        ],
      },
      {
        q: "You feel safest in conflict when they…",
        opts: [
          { text: "Are equally direct — no guessing games", key: "DIR" },
          { text: "Stay curious instead of attacking", key: "MED" },
          { text: "Keep their voice level and do not escalate", key: "PAC" },
          { text: "Give you room to come back on your own timeline", key: "WIT" },
        ],
      },
      {
        q: "They raise something at the worst possible moment. You…",
        opts: [
          { text: "Engage anyway; the issue outranks the timing", key: "DIR" },
          { text: "Ask for twenty minutes, then go deep", key: "MED" },
          { text: "Agree quickly so it is over", key: "PAC" },
          { text: "Say nothing and disappear to process", key: "WIT" },
        ],
      },
      {
        q: "The argument you are most likely to have is about…",
        opts: [
          { text: "Them being indirect or hiding the real issue", key: "DIR" },
          { text: "Feeling misunderstood despite trying hard", key: "MED" },
          { text: "Tension that built in silence until it burst", key: "PAC" },
          { text: "Them reading your need for space as rejection", key: "WIT" },
        ],
      },
    ],
    profiles: {
      DIR: {
        title: "The Direct One",
        short: "Direct",
        body: "You are not afraid of the conversation; you are afraid of it never happening. You would rather have an honest, uncomfortable argument than a comfortable lie. Your content is usually right. Your delivery is the variable — and it is the only thing you can actually control.",
      },
      MED: {
        title: "The Mediator",
        short: "Mediator",
        body: "You bring a rare gift: genuine curiosity while disagreeing. You want to understand, not merely win, and you can hold two truths at once. The watch-out is pace. Partners who need resolution faster experience your processing as delay, and your analysis can become a way of avoiding the plain sentence.",
      },
      PAC: {
        title: "The Keeper",
        short: "Keeper",
        body: "Peace is your priority, until the suppressed feelings find another exit. Unspoken resentment is conflict by slow drip, and it is harder to clean up than a fight. For you, saying the uncomfortable thing early is not a betrayal of harmony. It is the only thing that protects it.",
      },
      WIT: {
        title: "The Internal One",
        short: "Internal",
        body: "You regulate internally before you can engage externally. What looks like shutting down is your nervous system calling a time-out. The single most useful thing you can do is narrate it: I am not leaving, I need an hour, I will come back at eight. Distance without a signal is what actually escalates things.",
      },
    },
  },

  {
    id: "communication",
    cat: "foundation",
    title: "Communication",
    deck: "How you connect, express, and listen.",
    minutes: 7,
    kind: "choice",
    questions: [
      {
        q: "When something is bothering you, you…",
        opts: [
          { text: "Choose the moment and the words carefully first", key: "OBS" },
          { text: "Work it out out loud; talking is thinking", key: "PRB" },
          { text: "Address it directly and efficiently", key: "DIR" },
          { text: "Use humour or lightness to bring it up", key: "HUM" },
        ],
      },
      {
        q: "They say they are fine, and clearly are not. You…",
        opts: [
          { text: "Give space and check back later", key: "OBS" },
          { text: "Gently press, because you want the real answer", key: "PRB" },
          { text: "Take it at face value and move on", key: "DIR" },
          { text: "Make a joke to loosen the room", key: "HUM" },
        ],
      },
      {
        q: "You feel most heard when someone…",
        opts: [
          { text: "Lets you finish completely before responding", key: "OBS" },
          { text: "Asks questions that show they are tracking", key: "PRB" },
          { text: "Answers honestly without softening it", key: "DIR" },
          { text: "Keeps it light enough that you do not feel a burden", key: "HUM" },
        ],
      },
      {
        q: "In a heavy conversation, you need them to…",
        opts: [
          { text: "Not rush you; let the thought unfold", key: "OBS" },
          { text: "Engage actively and help you work it out", key: "PRB" },
          { text: "Get to the point so you can solve it", key: "DIR" },
          { text: "Keep it from becoming unbearable", key: "HUM" },
        ],
      },
      {
        q: "You get anxious in conversation when…",
        opts: [
          { text: "You are interrupted before the thought is complete", key: "OBS" },
          { text: "It stays surface-level and never goes anywhere", key: "PRB" },
          { text: "There is too much hedging and preamble", key: "DIR" },
          { text: "It gets so heavy there is no air left in it", key: "HUM" },
        ],
      },
      {
        q: "Most missed communication happens because…",
        opts: [
          { text: "You did not say what you meant clearly enough", key: "OBS" },
          { text: "You were both operating from different assumptions", key: "PRB" },
          { text: "Someone softened the message until it vanished", key: "DIR" },
          { text: "The tension made it impossible to actually listen", key: "HUM" },
        ],
      },
    ],
    profiles: {
      OBS: {
        title: "The Observer",
        short: "Observer",
        body: "You are a deep listener and a deliberate speaker. Your words carry weight because you choose them. The cost is latency: perfect words arrive late, and sometimes the imperfect sentence now does more for the relationship than the considered one tomorrow.",
      },
      PRB: {
        title: "The Explorer",
        short: "Explorer",
        body: "You communicate by excavating. You are not satisfied with the surface answer and you want the root. This makes you one of the most valuable people to be in a relationship with, and occasionally exhausting. Not every conversation needs to go all the way down.",
      },
      DIR: {
        title: "The Direct One",
        short: "Direct",
        body: "You say what you mean. Indirectness reads as inefficiency at best, dishonesty at worst. Clarity is your gift and warmth is your lever — the same sentence can land as relief or as a verdict, and you get to choose which.",
      },
      HUM: {
        title: "The Warm One",
        short: "Warm",
        body: "Levity is your entry point. You build safety through warmth and humour, and people tell you things they did not plan to. The watch-out is the big feeling that needs its unfiltered moment. If laughter always arrives first, some conversations quietly become off-limits.",
      },
    },
  },

  {
    id: "origin",
    cat: "foundation",
    title: "Origin",
    deck: "What you inherited about love, money, and repair.",
    minutes: 9,
    kind: "choice",
    questions: [
      {
        q: "In your family, affection was mostly shown by…",
        opts: [
          { text: "Showing up, consistently, without much being said", key: "STEADY" },
          { text: "Achievement — love arrived when you did well", key: "EARN" },
          { text: "Practical help, and not much else", key: "GUARD" },
          { text: "Repair — people fought, then made it right", key: "REPAIR" },
        ],
      },
      {
        q: "When conflict happened at home, it was usually…",
        opts: [
          { text: "Brief, and clearly resolved", key: "STEADY" },
          { text: "A lesson about who had failed", key: "EARN" },
          { text: "Silence, doors, and nobody naming it", key: "GUARD" },
          { text: "Loud, and then genuinely repaired", key: "REPAIR" },
        ],
      },
      {
        q: "Money in your family was…",
        opts: [
          { text: "Quiet, steady, not discussed", key: "STEADY" },
          { text: "Something to prove you had made it", key: "EARN" },
          { text: "Tight, and a source of dread", key: "GUARD" },
          { text: "Managed openly, with mistakes discussed", key: "REPAIR" },
        ],
      },
      {
        q: "The lesson you took about love is…",
        opts: [
          { text: "It is dependable. It stays.", key: "STEADY" },
          { text: "You have to be worth it.", key: "EARN" },
          { text: "You should not rely on it.", key: "GUARD" },
          { text: "It breaks, and it can be fixed.", key: "REPAIR" },
        ],
      },
      {
        q: "At holidays, your family was…",
        opts: [
          { text: "Warm, unremarkable, reliably the same", key: "STEADY" },
          { text: "Performative — everyone on their best behaviour", key: "EARN" },
          { text: "Tense, with unspoken rules", key: "GUARD" },
          { text: "Messy, honest, and genuinely close", key: "REPAIR" },
        ],
      },
      {
        q: "What you most want to keep from your family is…",
        opts: [
          { text: "The steadiness — nothing dramatic, everything held", key: "STEADY" },
          { text: "The drive, the refusal to be ordinary", key: "EARN" },
          { text: "The self-sufficiency", key: "GUARD" },
          { text: "The ability to come back after a bad night", key: "REPAIR" },
        ],
      },
      {
        q: "What you most want to do differently is…",
        opts: [
          { text: "Say the warm thing out loud, not just imply it", key: "STEADY" },
          { text: "Let love be unconditional, not earned", key: "EARN" },
          { text: "Ask for help before you are drowning", key: "GUARD" },
          { text: "Repair sooner, and without an audience", key: "REPAIR" },
        ],
      },
    ],
    profiles: {
      STEADY: {
        title: "The Steady House",
        short: "Steady",
        body: "You grew up with consistency, and it left you with a quiet expectation that love simply stays. That is a genuine inheritance. The risk is assuming it does not need to be said. What was shown to you silently, you now get to translate into words your partner can actually hear.",
      },
      EARN: {
        title: "The Earned House",
        short: "Earned",
        body: "You learned early that approval was conditional, and you became excellent at earning it. That competence is real, and it is also heavy. In love, you may still be performing for a grade that no one is keeping. The work is letting yourself be loved on a day you produced nothing.",
      },
      GUARD: {
        title: "The Guarded House",
        short: "Guarded",
        body: "You grew up around silence, practicality, or tension that was never named, and you learned to handle things alone. You are extraordinarily capable and hard to read. Asking for something you need may still feel like a confession. It is not. It is the part of intimacy you were not taught, and can learn now.",
      },
      REPAIR: {
        title: "The Reparative House",
        short: "Reparative",
        body: "Your family was not calm, but it was honest — and it came back. You learned that rupture is survivable and repair is a skill. That is one of the rarest things a person can bring to a relationship. The watch-out is tolerating too much heat because you know repair is possible.",
      },
    },
  },
];
