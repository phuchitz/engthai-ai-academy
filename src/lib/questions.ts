import type { AssessmentQuestion, AssessedSkill, Level } from "./models";

// Author-created draft content. Requires independent language educator review before validated use.
type Entry = [
  string,
  [string, string, string, string],
  number,
  string,
  string,
  string?,
];
const bank: Record<AssessedSkill, Partial<Record<Level, Entry[]>>> = {
  grammar: {
    A1: [
      [
        "My sister ___ a teacher.",
        ["are", "is", "be", "am"],
        1,
        "Use 'is' with a singular third-person subject.",
        "Use be in a complete sentence",
      ],
      [
        "They ___ breakfast at seven every day.",
        ["has", "having", "have", "is have"],
        2,
        "Use the base verb 'have' with 'they' for routines.",
        "Describe everyday routines",
      ],
    ],
    A2: [
      [
        "We ___ to Chiang Mai last weekend.",
        ["go", "have go", "going", "went"],
        3,
        "'Last weekend' is finished time, so use the past simple 'went'.",
        "Talk about finished past events",
      ],
      [
        "This exercise is ___ than the first one.",
        ["easier", "easy", "easiest", "more easy"],
        0,
        "The comparative form of 'easy' is 'easier'.",
        "Compare people and things",
      ],
    ],
    B1: [
      [
        "If I ___ enough time tomorrow, I will call you.",
        ["will have", "had", "have", "would have"],
        2,
        "Use the present simple in the if-clause of a first conditional.",
        "Express a realistic future condition",
      ],
      [
        "She has worked here ___ 2021.",
        ["for", "since", "during", "from"],
        1,
        "Use 'since' with a starting point and the present perfect.",
        "Connect past experience to the present",
      ],
    ],
    B2: [
      [
        "If I had known about the delay, I ___ earlier.",
        ["will leave", "would leave", "had left", "would have left"],
        3,
        "Use 'would have' + past participle for an unreal past result.",
        "Discuss unreal past situations",
      ],
      [
        "The report, ___ findings were unexpected, was published yesterday.",
        ["whose", "which", "who", "that"],
        0,
        "'Whose' expresses possession in this relative clause.",
        "Use complex relative clauses",
      ],
    ],
  },
  vocabulary: {
    A1: [
      [
        "Which word means a place where you can borrow books?",
        ["Kitchen", "Library", "Airport", "Hospital"],
        1,
        "A library lends books to readers.",
        "Recognize common places",
      ],
      [
        "I am thirsty. I would like some ___.",
        ["bread", "rice", "water", "chairs"],
        2,
        "Water is a drink; it is appropriate when you are thirsty.",
        "Recognize everyday needs",
      ],
    ],
    A2: [
      [
        "We need to ___ a hotel room before our trip.",
        ["borrow", "lend", "book", "spend"],
        2,
        "To 'book' a room means to reserve it.",
        "Choose words for travel arrangements",
      ],
      [
        "The train was crowded. There were ___ passengers.",
        ["very few", "no", "too little", "a lot of"],
        3,
        "A crowded train has a lot of passengers.",
        "Understand common descriptions",
      ],
    ],
    B1: [
      [
        "Could you ___ me to send the application tomorrow?",
        ["remind", "remember", "realize", "recognize"],
        0,
        "'Remind someone to do something' means help them remember.",
        "Distinguish commonly confused verbs",
      ],
      [
        "We need a more reliable supplier. 'Reliable' means ___.",
        ["expensive", "able to be trusted", "nearby", "recently opened"],
        1,
        "A reliable supplier can be trusted to deliver consistently.",
        "Understand everyday workplace vocabulary",
      ],
    ],
    B2: [
      [
        "The team reached a consensus after a long discussion. They ___.",
        [
          "postponed a decision",
          "changed the subject",
          "came to a shared agreement",
          "disagreed completely",
        ],
        2,
        "A consensus is a generally shared agreement.",
        "Interpret abstract workplace vocabulary",
      ],
      [
        "The new evidence undermined the argument. It made it ___.",
        ["more persuasive", "less convincing", "shorter", "easier to read"],
        1,
        "To undermine an argument is to weaken its support.",
        "Understand evaluative language",
      ],
    ],
  },
  reading: {
    A1: [
      [
        "When does the cafe open?",
        ["7 am", "9 am", "5 pm", "7 pm"],
        0,
        "The sign states that the cafe opens at 7 am.",
        "Find an explicit detail in a short text",
        "Cafe hours: Monday–Friday, 7 am–5 pm. Closed on weekends.",
      ],
      [
        "How will Mali travel?",
        ["By car", "By train", "By bus", "On foot"],
        2,
        "Mali says she will take the bus.",
        "Understand a simple personal message",
        "Hi Ben! I will take the bus to your house. See you at two. —Mali",
      ],
    ],
    A2: [
      [
        "What should members do on Saturday?",
        [
          "Visit the library",
          "Return books online",
          "Pay a fee",
          "Use the online catalogue",
        ],
        3,
        "The building is closed, but the catalogue is available online.",
        "Understand a practical notice",
        "The library building will close for repairs this Saturday. Members can still search for books using our online catalogue. The building reopens on Monday.",
      ],
      [
        "Why did Arun change his plan?",
        [
          "The weather was bad",
          "He lost his ticket",
          "His friend was late",
          "The museum was closed",
        ],
        0,
        "Rain caused Arun to choose an indoor activity.",
        "Identify a reason in a short narrative",
        "Arun planned to go cycling with a friend. When it started raining, they decided to visit the science museum instead. They enjoyed the afternoon indoors.",
      ],
    ],
    B1: [
      [
        "What is the main benefit the writer mentions?",
        [
          "Lower salaries",
          "Less travel time",
          "Longer meetings",
          "Fewer colleagues",
        ],
        1,
        "The writer describes saving time by avoiding the commute.",
        "Identify the main point in a connected text",
        "Working from home has challenges, especially when my neighbours are noisy. Still, I save nearly two hours each day because I no longer commute. I use that time to cook and study, so overall the change has helped me.",
      ],
      [
        "What does the writer suggest?",
        [
          "Replace all meetings",
          "Work every weekend",
          "Agree on how to communicate",
          "Stop using email",
        ],
        2,
        "The writer recommends agreeing which channels suit different situations.",
        "Follow advice and supporting reasons",
        "Our team uses several messaging tools, which sometimes leads to missed updates. Rather than adding another tool, we should agree on which channel to use for urgent issues and which for routine updates. Clear expectations would help everyone.",
      ],
    ],
    B2: [
      [
        "What is the writer's attitude to the proposal?",
        [
          "Unconditionally supportive",
          "Completely dismissive",
          "Uninterested",
          "Supportive with reservations",
        ],
        3,
        "The writer sees benefits but raises concerns about unequal access.",
        "Interpret a qualified argument",
        "The city's plan to subsidise electric bicycles could reduce short car journeys. However, residents in outlying districts lack safe cycling routes. Unless infrastructure improves alongside the subsidy, the policy's benefits may be concentrated in already well-served neighbourhoods.",
      ],
      [
        "What can be inferred about the survey?",
        [
          "Its findings may not represent all staff",
          "Every employee responded",
          "It proves remote work reduces productivity",
          "It measured only managers",
        ],
        0,
        "Voluntary responses and uneven participation limit how representative the results are.",
        "Evaluate limitations in evidence",
        "A company survey found strong support for flexible hours. Participation was voluntary, and responses came mainly from office-based teams. The report recommends a pilot rather than an immediate company-wide change, noting that shift workers' preferences remain unclear.",
      ],
    ],
  },
};

export const questions: AssessmentQuestion[] = Object.entries(bank).flatMap(
  ([skill, byLevel]) =>
    Object.entries(byLevel).flatMap(([level, entries]) =>
      entries.map(
        ([prompt, options, correct, explanation, objective, passage], i) => ({
          id: `${skill}-${level}-${i + 1}`,
          skill: skill as AssessedSkill,
          level: level as Level,
          prompt,
          options,
          correct,
          explanation,
          objective,
          passage,
        }),
      ),
    ),
);
