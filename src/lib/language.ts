import { thaiLearningMessages } from "./thai-learning-messages";
export type Language = "th" | "en";
export const LANGUAGE_COOKIE = "engthai-language";
export function parseLanguage(value: string | undefined): Language {
  return value === "en" ? "en" : "th";
}
// Interface copy only: English learning examples, questions and choices remain in English.
export const thaiMessages: Record<string, string> = {
  "My learning": "หน้าหลัก",
  "Daily lessons": "บทเรียนของฉัน",
  Vocabulary: "ฝึกคำศัพท์",
  "Grammar studio": "ฝึกไวยากรณ์",
  "AI tutor": "ผู้ช่วยสอน AI",
  "My progress": "ผลการเรียน",
  "Placement check": "ประเมินระดับภาษา",
  "Your results": "ผลประเมินของฉัน",
  "Welcome aboard": "เริ่มต้นเรียนรู้",
  Settings: "ตั้งค่า",
  "YOUR LEARNING SPACE": "พื้นที่เรียนรู้ของคุณ",
  SOON: "เร็ว ๆ นี้",
  "Small steps, real growth.": "ฝึกทีละนิด เก่งขึ้นได้ทุกวัน",
  "You're closer than you were yesterday.": "ไม่ต้องรีบ แค่ฝึกอย่างสม่ำเสมอ",
  "Settings & profile": "ตั้งค่าและข้อมูลส่วนตัว",
  "Sign in with Google": "เข้าสู่ระบบด้วย Google",
  "Sign out": "ออกจากระบบ",
  "Exploring the public demo": "กำลังทดลองใช้งาน",
  "Your personal learning journey": "พื้นที่เรียนรู้ส่วนตัว",
  "My academy": "EngThai ของฉัน",
  "Public demo": "โหมดทดลอง",
  "Private learning space": "พื้นที่เรียนรู้ส่วนตัว",
  "Close navigation": "ปิดเมนู",
  "Open navigation": "เปิดเมนู",
  "Open your profile": "เปิดข้อมูลส่วนตัว",
  "Switch to light theme": "ใช้ธีมสว่าง",
  "Switch to dark theme": "ใช้ธีมมืด",
  "EngThai home": "หน้าแรก EngThai",
  "You're exploring the demo. Progress stays in this browser, separate from signed-in accounts.":
    "คุณกำลังทดลองใช้งาน ข้อมูลเก็บเฉพาะเบราว์เซอร์นี้ และแยกจากบัญชีที่เข้าสู่ระบบ",
  "Make it yours": "เข้าสู่ระบบ",
  "Open Settings": "ไปที่ตั้งค่า",
  "Dismiss notification": "ปิดข้อความแจ้งเตือน",
  "Opening your learning space…": "กำลังเปิดหน้าการเรียน…",
  "A LITTLE PRACTICE. A WORLD OF POSSIBILITIES.":
    "ฝึกวันละนิด ใช้ภาษาอังกฤษได้มั่นใจขึ้น",
  "Your next chapter starts here": "วันนี้มาเก่งอังกฤษขึ้นอีกนิด",
  "A little English today. A more confident you tomorrow.":
    "รู้ระดับของตัวเอง แล้วเลือกเรื่องที่ควรฝึกต่อได้จากบทเรียนสั้น ๆ วันนี้",
  "YOUR PACE. YOUR PROGRESS.": "เรียนตามเวลาที่สะดวก ค่อย ๆ พัฒนาไปด้วยกัน",
  "MADE FOR YOUR JOURNEY": "แนะนำสำหรับคุณ",
  "Keep your curiosity.\nGrow your confidence.":
    "พร้อมฝึกต่อไหม?\nวันละนิดก็พัฒนาได้",
  "English for your world.\nStart with a small step.":
    "เริ่มเรียนอังกฤษ\nในแบบที่เหมาะกับคุณ",
  "Discover your starting point and build a learning path that feels like you.":
    "บอกเป้าหมาย แล้วประเมินระดับเบื้องต้น เพื่อดูว่าควรเริ่มฝึกเรื่องไหน",
  "Start my journey": "เริ่มต้นเรียน",
  "Continue Learning": "เรียนต่อ",
  "Your daily learning path": "วันนี้เรียนอะไรดี",
  "A thoughtful mix of practice, picked for you.":
    "เลือกบทเรียนสั้น ๆ แล้วเริ่มฝึกได้เลย",
  "View all": "ดูบทเรียนทั้งหมด",
  "Consistency feels better than perfection.":
    "ไม่ต้องเก่งทันที แค่ฝึกอย่างสม่ำเสมอ",
  "One lesson is one step forward. You've got this.":
    "จบหนึ่งบทเรียน ก็พัฒนาไปอีกหนึ่งก้าว",
  "A WORD TO TAKE WITH YOU": "คำศัพท์น่ารู้วันนี้",
  adjective: "คำคุณศัพท์",
  "Explore vocabulary": "ไปฝึกคำศัพท์",
  "Made for your next chapter.": "พื้นที่เล็ก ๆ สำหรับพัฒนาตัวเอง",
  "Learning at your own pace": "เรียนตามจังหวะของคุณ",
  "day learning streak": "วันที่เรียนต่อเนื่อง",
  "total learning XP": "คะแนนสะสมจากการเรียน",
  "lessons completed": "บทเรียนที่เรียนจบ",
  "YOUR STARTING POINT": "ระดับภาษาโดยประมาณ",
  PRELIMINARY: "ผลเบื้องต้น",
  estimated: "ระดับโดยประมาณ",
  "LET'S FIND OUT": "ยังไม่ได้ประเมิน",
  "A foundation to grow from": "ใช้เป็นแนวทางเลือกเรื่องที่ควรฝึก",
  "Your potential is waiting.": "เริ่มจากการรู้ระดับของตัวเอง",
  "A short skills check helps us find the right place to begin.":
    "ทำแบบประเมินสั้น ๆ เพื่อดูจุดแข็งและเรื่องที่ควรฝึกเพิ่ม",
  "Understand my results": "ดูรายละเอียดผลประเมิน",
  "Continue my skills check": "ทำแบบประเมินต่อ",
  "Find my starting point": "ประเมินระดับของฉัน",
  "TODAY'S LITTLE GOAL": "เป้าหมายวันนี้",
  "Estimated lesson minutes toward daily goal":
    "เวลาเรียนโดยประมาณเทียบกับเป้าหมายวันนี้",
  "You made time for yourself. Well done!":
    "ทำได้ตามเป้าหมายวันนี้แล้ว เก่งมาก!",
  "Make a little space for your future self.":
    "เริ่มบทเรียนสั้น ๆ เพื่อเก็บความก้าวหน้าวันนี้",
  "Minutes use lesson estimates, not a timer.":
    "คำนวณจากเวลาประมาณของบทเรียน ไม่ใช่เวลาที่จับจริง",
  Completed: "เรียนจบแล้ว",
  grammar: "ไวยากรณ์",
  vocabulary: "คำศัพท์",
  reading: "การอ่าน",
  listening: "การฟัง",
  writing: "การเขียน",
  speaking: "การพูด",
  "GRAMMAR STUDIO": "ฝึกไวยากรณ์",
  "A LITTLE BETTER, EVERY DAY": "ฝึกวันละนิด เก่งขึ้นทุกวัน",
  "Make the pieces click.": "เข้าใจไวยากรณ์ แล้วลองใช้จริง",
  "Your next small step.": "เลือกบทเรียนที่อยากฝึกวันนี้",
  "Clear explanations. Thai support. Useful practice.":
    "คำอธิบายสั้น ๆ พร้อมภาษาไทย ตัวอย่าง และแบบฝึกหัด",
  "Foundation practice · These short exercises support learning, rather than certify mastery of a CEFR level.":
    "บทเรียนฝึกพื้นฐานช่วยพัฒนาทักษะ แต่ไม่ได้ใช้รับรองระดับ CEFR",
  "YOUR JOURNEY, YOUR WAY": "เริ่มเรียนในแบบที่เหมาะกับคุณ",
  "Make this space yours.": "ปรับเป้าหมายการเรียนของคุณ",
  "Let's make English work for you.": "อยากใช้ภาษาอังกฤษทำอะไรได้บ้าง?",
  "A few little details help us shape your learning journey.":
    "บอกเป้าหมายและเวลาที่สะดวก เพื่อช่วยแนะนำเรื่องที่ควรฝึก",
  "What should we call you?": "อยากให้เราเรียกคุณว่าอะไร?",
  "Your preferred name": "ชื่อที่อยากให้เรียก",
  "What would you like to do with English?": "อยากใช้ภาษาอังกฤษเรื่องไหนบ้าง?",
  "Choose as many as you like.": "เลือกได้มากกว่าหนึ่งข้อ",
  "A little time, every day": "อยากเรียนวันละกี่นาที?",
  "min / day": "นาที / วัน",
  "What sparks your interest?": "คุณสนใจเรื่องอะไรบ้าง?",
  "Your reason to keep going": "อะไรทำให้คุณอยากเก่งอังกฤษ?",
  Optional: "ไม่จำเป็นต้องกรอก",
  "I'd love to feel more confident in meetings…":
    "เช่น อยากพูดในที่ประชุมได้มั่นใจขึ้น…",
  "Your preferences and learning progress are saved only in this browser. They do not sync across devices.":
    "ข้อมูลและผลการเรียนเก็บเฉพาะเบราว์เซอร์นี้ ยังไม่เชื่อมข้อมูลข้ามอุปกรณ์",
  "Save preferences": "บันทึกข้อมูล",
  "Everyday conversation": "พูดคุยในชีวิตประจำวัน",
  Travel: "ท่องเที่ยว",
  "Work communication": "สื่อสารในการทำงาน",
  "Software engineering": "งานพัฒนาซอฟต์แวร์",
  "English interviews": "สัมภาษณ์งานภาษาอังกฤษ",
  "General English": "พัฒนาภาษาอังกฤษทั่วไป",
  "Everyday life": "ชีวิตประจำวัน",
  Technology: "เทคโนโลยี",
  "Travel & culture": "ท่องเที่ยวและวัฒนธรรม",
  "Work & careers": "งานและอาชีพ",
  "Food & coffee": "อาหารและกาแฟ",
  "Books & ideas": "หนังสือและไอเดีย",
  "Please enter your name": "กรุณากรอกชื่อ",
  "Choose at least one goal": "เลือกอย่างน้อยหนึ่งเป้าหมาย",
  "Choose at least one topic": "เลือกอย่างน้อยหนึ่งเรื่องที่สนใจ",
  "YOUR NEXT CHAPTER STARTS HERE": "เริ่มต้นฝึกภาษาอังกฤษไปด้วยกัน",
  "A little hello.": "ยินดีต้อนรับสู่ EngThai",
  "A fresh beginning.": "เริ่มเก่งอังกฤษทีละนิด",
  "Sign in to your personal English learning space.":
    "เข้าสู่ระบบเพื่อประเมินระดับและฝึกภาษาอังกฤษตามเป้าหมายของคุณ",
  "Google sign-in needs configuration":
    "ยังไม่ได้ตั้งค่าการเข้าสู่ระบบด้วย Google",
  "The app owner needs to configure Google OAuth and an authentication secret. You can explore the public demo while setup is completed.":
    "กำลังเตรียมระบบเข้าสู่ระบบ ระหว่างนี้คุณสามารถทดลองดูบทเรียนและหน้าการเรียนได้",
  "Google sign-in could not be completed. Please try again with a verified Google account. If it continues, contact the app owner.":
    "เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้งด้วยบัญชี Google ที่ยืนยันอีเมลแล้ว หากยังพบปัญหาให้ติดต่อผู้ดูแล",
  "Connecting to Google…": "กำลังเชื่อมต่อ Google…",
  "Continue with Google": "เข้าสู่ระบบด้วย Google",
  "or explore first": "หรือทดลองดูก่อน",
  "Explore the public demo": "ทดลองใช้งาน",
  "Authentication uses Google. Learning progress is browser-local and does not sync across devices.":
    "เข้าสู่ระบบผ่าน Google ผลการเรียนเก็บเฉพาะเบราว์เซอร์นี้ ยังไม่เชื่อมข้อมูลข้ามอุปกรณ์",
  "A little practice. A world of possibilities.":
    "ฝึกวันละนิด ใช้ภาษาอังกฤษได้มั่นใจขึ้น",
  "About EngThai": "เกี่ยวกับ EngThai",
  "Skip to content": "ข้ามไปยังเนื้อหา",
  "A STARTING POINT, NOT A FINISH LINE":
    "ประเมินเพื่อเลือกจุดเริ่มต้น ไม่ใช่สอบผ่านหรือไม่ผ่าน",
  "Let's discover where you are.": "มาดูว่าตอนนี้ควรเริ่มฝึกตรงไหน",
  "No pressure. No pass or fail. Just a clearer picture of what to practise next.":
    "ไม่ต้องกังวล ผลประเมินช่วยบอกจุดแข็งและเรื่องที่ควรฝึกต่อ",
  "10–15 minutes": "ประมาณ 10–15 นาที",
  "Take your time": "ค่อย ๆ ทำได้ตามสะดวก",
  "18 questions": "คำถาม 18 ข้อ",
  "Grammar, words & reading": "ไวยากรณ์ คำศัพท์ และการอ่าน",
  "Adaptive practice": "ปรับความยากตามคำตอบ",
  "Starting around A2": "เริ่มจากระดับประมาณ A2",
  "A preliminary learning check": "แบบประเมินเบื้องต้นเพื่อวางแผนการเรียน",
  "I'm ready to begin": "พร้อมแล้ว เริ่มประเมิน",
  "Next question": "ข้อถัดไป",
  "See my results": "ดูผลประเมิน",
  "Choose your answer": "เลือกคำตอบ",
  "Saved only in this browser": "บันทึกเฉพาะเบราว์เซอร์นี้",
  "Show Thai help": "ดูคำอธิบายโจทย์ภาษาไทย",
  "Word topic": "หมวดคำศัพท์",
  "All topics": "ทุกหมวด",
  New: "คำใหม่",
  "Ready to review": "ถึงเวลาทบทวน",
  "A NEW WORD FOR YOU": "คำศัพท์ใหม่สำหรับคุณ",
  "TIME TO REVIEW": "ถึงเวลาทบทวน",
  "Say the word aloud, then reveal its meaning.":
    "ลองออกเสียงคำนี้ แล้วกดดูความหมาย",
  "Hear the example sentence": "ฟังประโยคตัวอย่าง",
  "You've met today's new words. Come back tomorrow for more, or review again when words are due.":
    "วันนี้เรียนคำใหม่ครบแล้ว พรุ่งนี้กลับมาเรียนคำใหม่เพิ่ม หรือทบทวนเมื่อถึงกำหนด",
  Tomorrow: "พรุ่งนี้",
  "Speech playback is unavailable in this browser. You can still read the pronunciation guide.":
    "เบราว์เซอร์นี้เล่นเสียงไม่ได้ แต่ยังอ่านคำอ่านที่เขียนไว้ได้",
  "Audio couldn't play. Try again, or use the written pronunciation guide.":
    "เล่นเสียงไม่สำเร็จ ลองอีกครั้ง หรือดูคำอ่านที่เขียนไว้",
  "Thai help explains the task only. Answer choices and reading passages stay in English.":
    "คำอธิบายนี้บอกเฉพาะว่าโจทย์ถามอะไร ตัวเลือกและบทอ่านยังเป็นภาษาอังกฤษ",
  "Your starting point is ready.": "ทำแบบประเมินเสร็จแล้ว",
  "View my results": "ดูผลประเมินของฉัน",
  "Start a fresh check": "เริ่มประเมินใหม่",
  "YOUR PRELIMINARY SKILLS CHECK": "แบบประเมินทักษะเบื้องต้น",
  "A little discovery.": "ค่อย ๆ ทำไปทีละข้อ",
  "Choose the answer that feels right. Your progress saves after each answer.":
    "เลือกคำตอบที่คิดว่าถูกต้อง ระบบจะบันทึกทุกครั้งที่ตอบ",
  "All lessons": "บทเรียนทั้งหมด",
  "01 / UNDERSTAND": "01 / ทำความเข้าใจ",
  "Let's make it click.": "มาทำความเข้าใจเรื่องนี้กัน",
  "See it in a sentence": "ดูตัวอย่างประโยค",
  "Let's practise": "ลองทำแบบฝึกหัด",
  "02 / TRY IT YOURSELF": "02 / ลองทำด้วยตัวเอง",
  "That's it. A little more confidence!": "ถูกต้อง! เข้าใจขึ้นอีกนิดแล้ว",
  "Nearly there. Give it another try.": "ยังไม่ถูก ลองเลือกใหม่อีกครั้ง",
  "Read the explanation again, then choose another answer.":
    "ลองอ่านคำอธิบายอีกครั้ง แล้วเลือกคำตอบใหม่",
  Explanation: "อ่านคำอธิบาย",
  "Finish review": "จบการทบทวน",
  "Check my answer": "ตรวจคำตอบ",
  "This is a review. XP is awarded once per lesson.":
    "กำลังทบทวนบทเรียน คะแนนจะได้รับเฉพาะตอนเรียนจบครั้งแรก",
  "MAKE YOURSELF AT HOME": "ตั้งค่าการเรียนของคุณ",
  "Your learning, your way.": "เรียนในแบบที่เหมาะกับคุณ",
  "Your preferences, your privacy, and a little room to grow.":
    "ปรับเป้าหมาย จัดการข้อมูล และดูรายละเอียดการบันทึกผลการเรียน",
};
export function translate(language: Language, text: string): string {
  if (language === "en") return text;
  if (Object.hasOwn(thaiMessages, text)) return thaiMessages[text];
  if (Object.hasOwn(thaiLearningMessages, text))
    return thaiLearningMessages[text];
  const coverage =
    /^(\d+) of 6 skills checked\. Recognition evidence only\.$/.exec(text);
  if (coverage)
    return `ประเมินแล้ว ${coverage[1]} จาก 6 ทักษะ เป็นผลจากข้อสอบแบบเลือกตอบเท่านั้น`;
  const priority =
    /^Your assessment suggests reviewing (grammar|vocabulary|reading) foundations first\.$/.exec(
      text,
    );
  if (priority)
    return `ผลประเมินแนะนำให้ทบทวนพื้นฐานด้าน${translate(language, priority[1])}ก่อน`;
  const completion = /^Complete lesson · \+(\d+) XP$/.exec(text);
  if (completion) return `จบบทเรียน · +${completion[1]} XP`;
  return text;
}
const thaiLessons: Record<string, { title: string; description: string }> = {
  "sentence-foundations": {
    title: "แต่งประโยคง่าย ๆ ให้ครบความ",
    description: "ฝึกเรียงประธาน กริยา และส่วนขยายให้ถูกต้อง",
  },
  "past-stories": {
    title: "เล่าเรื่องสุดสัปดาห์ที่ผ่านมา",
    description: "เลือกใช้กริยาช่องสองเพื่อเล่าเหตุการณ์ในอดีต",
  },
  "everyday-words": {
    title: "คำศัพท์ที่ใช้ได้ในชีวิตประจำวัน",
    description: "จำคำศัพท์ผ่านสถานการณ์ใกล้ตัว",
  },
  "travel-words": {
    title: "เตรียมคำศัพท์ก่อนออกเดินทาง",
    description: "ฝึกคำที่ใช้จองห้องพักและวางแผนท่องเที่ยว",
  },
  "reading-details": {
    title: "อ่านจับข้อมูลสำคัญ",
    description: "หาวัน เวลา และสถานที่จากข้อความสั้น ๆ",
  },
  "reading-reasons": {
    title: "อ่านแล้วเข้าใจเหตุผล",
    description: "ฝึกเชื่อมเหตุการณ์กับเหตุผลในเรื่องที่อ่าน",
  },
};
export function lessonCopy(
  language: Language,
  lesson: { id: string; title: string; description: string },
) {
  return language === "th" ? (thaiLessons[lesson.id] ?? lesson) : lesson;
}
