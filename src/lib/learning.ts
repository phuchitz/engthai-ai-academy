import type {
  AssessmentResult,
  DailyProgress,
  LearnerState,
  LearningPath,
  Lesson,
  LessonAttempt,
  VocabularyItem,
  VocabularyReview,
} from "./models";

export const lessons: Lesson[] = [
  {
    id: "sentence-foundations",
    title: "Build a confident sentence",
    skill: "grammar",
    level: "A1",
    minutes: 5,
    xp: 30,
    objective: "Put a subject, verb, and complement in a complete sentence.",
    description: "Small building blocks. A big step forward.",
    explanation:
      "A simple English sentence usually starts with a subject and a verb. With be, choose am for I, is for he/she/it, and are for you/we/they.",
    thai: "ประโยคภาษาอังกฤษเริ่มจากประธานและกริยา เช่น ฉันเป็นนักเรียน → I am a student.",
    examples: [
      "I am a software engineer.",
      "She is ready for the meeting.",
      "They are my classmates.",
    ],
    exercise: {
      prompt: "Choose the complete, correct sentence.",
      options: ["She a designer.", "She is a designer.", "She are a designer."],
      correct: 1,
      feedback:
        "'She' needs 'is'. A complete sentence includes both the subject and the verb.",
    },
  },
  {
    id: "past-stories",
    title: "Tell your weekend story",
    skill: "grammar",
    level: "A2",
    minutes: 7,
    xp: 40,
    objective: "Use past simple verbs to describe finished events.",
    description: "Turn yesterday's moments into English.",
    explanation:
      "Use the past simple for a finished event. Many verbs add -ed, but common verbs have irregular forms: go → went, eat → ate, see → saw. With did, use the base verb.",
    thai: "ใช้ Past Simple เล่าเหตุการณ์ที่จบไปแล้ว เช่น เมื่อวาน หรือสุดสัปดาห์ที่แล้ว",
    examples: [
      "I visited my family last weekend.",
      "We went to a new cafe.",
      "Did you enjoy the trip?",
    ],
    exercise: {
      prompt: "Yesterday, we ___ lunch together.",
      options: ["have", "had", "having"],
      correct: 1,
      feedback:
        "'Yesterday' is finished time. The past simple of 'have' is 'had'.",
    },
  },
  {
    id: "everyday-words",
    title: "Words for your everyday",
    skill: "vocabulary",
    level: "A1",
    minutes: 5,
    xp: 30,
    objective: "Choose useful words for everyday places and needs.",
    description: "Useful English, from your first coffee onward.",
    explanation:
      "Learn a word in a useful phrase, rather than alone. 'Borrow' means take something temporarily and return it. 'Buy' means pay to own it.",
    thai: "borrow = ยืม และ buy = ซื้อ ฝึกจำคำศัพท์พร้อมประโยคตัวอย่าง",
    examples: [
      "Can I borrow this book?",
      "I buy coffee on my way to work.",
      "The library is next to the station.",
    ],
    exercise: {
      prompt: "You take a library book and return it next week. You ___ it.",
      options: ["buy", "borrow", "sell"],
      correct: 1,
      feedback:
        "You borrow something when you use it temporarily and then return it.",
    },
  },
  {
    id: "travel-words",
    title: "Your next trip, in English",
    skill: "vocabulary",
    level: "A2",
    minutes: 6,
    xp: 35,
    objective: "Use book, reserve, and check in in travel situations.",
    description: "A little preparation. A world of possibilities.",
    explanation:
      "Book and reserve both mean arrange to have something available later. Check in means report your arrival at a hotel or airport.",
    thai: "book / reserve = จอง และ check in = ลงทะเบียนเข้าพักหรือขึ้นเครื่อง",
    examples: [
      "I'd like to book a room for two nights.",
      "Can I reserve a window seat?",
      "What time can we check in?",
    ],
    exercise: {
      prompt: "You want a room for next Friday. What do you say?",
      options: [
        "I'd like to borrow a room.",
        "I'd like to book a room.",
        "I'd like to spend a room.",
      ],
      correct: 1,
      feedback:
        "'Book a room' is the natural phrase for making a hotel reservation.",
    },
  },
  {
    id: "reading-details",
    title: "Find the detail that matters",
    skill: "reading",
    level: "A1",
    minutes: 5,
    xp: 30,
    objective: "Find times and places in a short practical message.",
    description: "Read a real-life message with more confidence.",
    explanation:
      "First ask what you need to know. Then look for names, dates, times, and places. You do not need to translate every word.",
    thai: "อ่านหาข้อมูลสำคัญ เช่น เวลา สถานที่ และวันที่ โดยไม่จำเป็นต้องแปลทุกคำ",
    examples: [
      "Meet me at the station at 9 am.",
      "The shop closes at 6 pm on Sundays.",
    ],
    exercise: {
      prompt:
        "'Our workshop starts at 10 am in Room 4. Please arrive 15 minutes early.' When should you arrive?",
      options: ["9:45 am", "10:00 am", "10:15 am"],
      correct: 0,
      feedback: "Fifteen minutes before 10 am is 9:45 am.",
    },
  },
  {
    id: "reading-reasons",
    title: "Read between the everyday lines",
    skill: "reading",
    level: "A2",
    minutes: 7,
    xp: 40,
    objective: "Identify the reason for a decision in a short text.",
    description: "Connect the what with the why.",
    explanation:
      "Words such as because, so, and instead connect reasons and results. Read the sentences around a decision to understand why it happened.",
    thai: "สังเกตคำเชื่อม because (เพราะว่า), so (ดังนั้น), instead (แทน) เพื่อเข้าใจเหตุผล",
    examples: [
      "It was raining, so we stayed inside.",
      "I took the train because the roads were busy.",
    ],
    exercise: {
      prompt:
        "'Nok wanted to cook, but the fridge was empty. She ordered dinner instead.' Why did Nok order dinner?",
      options: [
        "She dislikes cooking.",
        "She had no ingredients.",
        "She was late for work.",
      ],
      correct: 1,
      feedback:
        "The empty fridge gives the reason. The text does not say she dislikes cooking.",
    },
  },
];

export { vocabulary } from "./vocabulary";

export function buildLearningPath(
  result: AssessmentResult | null,
  state: LearnerState,
): LearningPath {
  const weakest = result?.evaluations
    .filter((e) => e.total > 0)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)[0];
  const prefersTravel = state.preferences?.goals.includes("Travel") ?? false;
  const priority = (lesson: Lesson) =>
    (weakest?.gaps.length && lesson.skill === weakest.skill ? 10 : 0) +
    (prefersTravel && lesson.id === "travel-words" ? 2 : 0);
  const sorted = [...lessons].sort((a, b) => priority(b) - priority(a));
  const completed = new Set(state.attempts.map((a) => a.lessonId));
  const available = sorted.filter((l) => !completed.has(l.id));
  return {
    lessonIds: (available.length ? available : sorted).map((l) => l.id),
    reason: weakest?.gaps.length
      ? `Your assessment suggests reviewing ${weakest.skill} foundations first.`
      : prefersTravel
        ? "Your travel goal puts useful trip vocabulary near the start of your foundation practice."
        : "Start with useful foundations, then build your confidence one lesson at a time.",
  };
}

export function completeLesson(
  attempts: LessonAttempt[],
  lesson: Lesson,
  now: Date,
): LessonAttempt[] {
  if (attempts.some((a) => a.lessonId === lesson.id)) return attempts;
  return [
    ...attempts,
    {
      lessonId: lesson.id,
      completedAt: now.toISOString(),
      correct: true,
      xp: lesson.xp,
    },
  ];
}
export function dayKey(date: Date): string {
  // Thai learners use a stable Bangkok calendar day, regardless of device timezone or DST.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
export function dailyProgress(attempts: LessonAttempt[]): DailyProgress[] {
  const days = new Map<string, DailyProgress>();
  for (const attempt of attempts) {
    const date = dayKey(new Date(attempt.completedAt));
    const day = days.get(date) ?? { date, xp: 0, lessons: 0 };
    day.xp += attempt.xp;
    day.lessons++;
    days.set(date, day);
  }
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
}
export function streakDays(attempts: LessonAttempt[], now: Date): number {
  const days = new Set(dailyProgress(attempts).map((d) => d.date));
  let cursor = new Date(now);
  if (!days.has(dayKey(cursor))) cursor = new Date(cursor.getTime() - 86400000);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor = new Date(cursor.getTime() - 86400000);
  }
  return streak;
}
export function scheduleReview(
  itemId: string,
  previous: VocabularyReview | undefined,
  remembered: boolean,
  now: Date,
): VocabularyReview {
  const intervalDays = remembered
    ? Math.min(180, previous ? previous.intervalDays * 2 : 1)
    : 1;
  return {
    itemId,
    due: new Date(now.getTime() + intervalDays * 86400000).toISOString(),
    intervalDays,
    repetitions: remembered ? (previous?.repetitions ?? 0) + 1 : 0,
    // Older saved reviews have no introduction time; they never count toward today's new words.
    introducedAt: previous ? previous.introducedAt : now.toISOString(),
  };
}

export const NEW_WORDS_PER_DAY = 10;

// Due reviews come first (oldest first), then unseen words from preferred topics, within a
// daily limit on new words across all topics (Bangkok calendar day).
export function vocabularyQueue(
  items: VocabularyItem[],
  reviews: VocabularyReview[],
  now: Date,
  preferredTopics: readonly string[] = [],
) {
  const reviewFor = new Map(reviews.map((r) => [r.itemId, r]));
  const due = items
    .filter((item) => {
      const review = reviewFor.get(item.id);
      return review && new Date(review.due) <= now;
    })
    .sort(
      (a, b) =>
        new Date(reviewFor.get(a.id)!.due).getTime() -
        new Date(reviewFor.get(b.id)!.due).getTime(),
    );
  const unseen = items
    .filter((item) => !reviewFor.has(item.id))
    .sort(
      (a, b) =>
        Number(preferredTopics.includes(b.topic)) -
        Number(preferredTopics.includes(a.topic)),
    );
  const today = dayKey(now);
  const newToday = reviews.filter(
    (r) => r.introducedAt && dayKey(new Date(r.introducedAt)) === today,
  ).length;
  return {
    due,
    fresh: unseen.slice(0, Math.max(0, NEW_WORDS_PER_DAY - newToday)),
    unseen: unseen.length,
    newToday,
  };
}
