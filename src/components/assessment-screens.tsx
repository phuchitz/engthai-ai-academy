"use client";
import { useLanguage } from "./language";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Clock3,
  ShieldCheck,
  Sprout,
  Target,
} from "lucide-react";
import {
  ASSESSMENT_LENGTH,
  nextQuestion,
  scoreAssessment,
  validAnswers,
} from "@/lib/assessment";
import type { LearnerState } from "@/lib/models";
import { Button, buttonVariants } from "./ui/button";
import { EmptyState, PageHeading } from "./common";

export function Assessment({
  state,
  update,
  onFinish,
}: {
  state: LearnerState;
  update: (state: LearnerState) => boolean;
  onFinish: () => void;
}) {
  const { t, language } = useLanguage();
  const [selection, setSelection] = useState<number | null>(null);
  const answers = state.assessment?.answers ?? [];
  const question = nextQuestion(answers);
  const count = validAnswers(answers).length;
  function start() {
    update({
      ...state,
      assessment: {
        id: crypto.randomUUID(),
        startedAt: new Date().toISOString(),
        answers: [],
      },
    });
  }
  function submit() {
    if (selection === null || !question || !state.assessment) return;
    const nextAnswers = [
      ...answers,
      { questionId: question.id, option: selection },
    ];
    const done = nextQuestion(nextAnswers) === null;
    if (
      update({
        ...state,
        assessment: {
          ...state.assessment,
          answers: nextAnswers,
          ...(done ? { completedAt: new Date().toISOString() } : {}),
        },
      })
    ) {
      setSelection(null);
      if (done) onFinish();
    }
  }
  if (state.assessment?.completedAt)
    return (
      <div className="assessment-intro card">
        <span className="success-medallion">
          <CheckCircle2 size={32} />
        </span>
        <h1>{t("Your starting point is ready.")}</h1>
        <p className="muted">
          {t(
            "You can review your results or take a fresh assessment. A new assessment replaces your previous answers in this browser.",
          )}
        </p>
        <div className="button-row">
          <Button onClick={onFinish}>
            {t("View my results")}
            <ArrowRight size={16} />
          </Button>
          <Button variant="secondary" onClick={start}>
            {t("Start a fresh check")}
          </Button>
        </div>
      </div>
    );
  if (!state.assessment)
    return (
      <section className="assessment-intro card">
        <span className="eyebrow">
          <Sprout size={16} /> {t("A STARTING POINT, NOT A FINISH LINE")}
        </span>
        <h1>{t("Let's discover where you are.")}</h1>
        <p className="muted">
          {t(
            "No pressure. No pass or fail. Just a clearer picture of what to practise next.",
          )}
        </p>
        <div className="assessment-facts">
          <span>
            <Clock3 size={20} />
            <strong>{t("10–15 minutes")}</strong>
            {t("Take your time")}
          </span>
          <span>
            <BookOpen size={20} />
            <strong>{t("18 questions")}</strong>
            {t("Grammar, words & reading")}
          </span>
          <span>
            <Target size={20} />
            <strong>{t("Adaptive practice")}</strong>
            {t("Starting around A2")}
          </span>
        </div>
        <div className="info-box">
          <CircleHelp size={20} />
          <div>
            <strong>{t("A preliminary learning check")}</strong>
            <p>
              {t(
                "This draft question bank has not been independently validated. Results describe limited recognition evidence, not an official CEFR certification. Listening, writing, and speaking are not assessed. Estimates are capped at B2.",
              )}
            </p>
          </div>
        </div>
        <p className="privacy-note">
          {t(
            "Your answers are saved in this browser so you can take a break and return. Please answer without a dictionary for a more useful starting point.",
          )}
        </p>
        <Button onClick={start}>
          {t("I'm ready to begin")}
          <ArrowRight size={17} />
        </Button>
      </section>
    );
  if (!question)
    return (
      <div className="card assessment-intro">
        <h1>{t("Finish your assessment")}</h1>
        <Button
          onClick={() => {
            if (
              update({
                ...state,
                assessment: {
                  ...state.assessment!,
                  completedAt: new Date().toISOString(),
                },
              })
            )
              onFinish();
          }}
        >
          {t("See my results")}
        </Button>
      </div>
    );
  return (
    <section className="assessment-player">
      <PageHeading
        eyebrow={t("YOUR PRELIMINARY SKILLS CHECK")}
        title={t("A little discovery.")}
        description={t(
          "Choose the answer that feels right. Your progress saves after each answer.",
        )}
      />
      <div className="assessment-progress">
        <span>
          {language === "th"
            ? `ข้อ ${count + 1} จาก ${ASSESSMENT_LENGTH}`
            : `Question ${count + 1} of ${ASSESSMENT_LENGTH}`}
        </span>
        <span className="skill-pill">{t(question.skill)}</span>
        <progress
          value={count}
          max={ASSESSMENT_LENGTH}
          aria-label="Assessment progress"
        />
      </div>
      <div className="question-card card" key={question.id}>
        <span className="eyebrow">
          {language === "th"
            ? `${t(question.skill)} · เลือกคำตอบเดียว`
            : `${question.skill.toUpperCase()} · CHOOSE ONE ANSWER`}
        </span>
        {question.passage && (
          <blockquote lang="en" className="reading-passage">
            {question.passage}
          </blockquote>
        )}
        <h2 lang="en">{question.prompt}</h2>
        <fieldset className="answer-options">
          <legend className="sr-only">{t("Choose your answer")}</legend>
          {question.options.map((option, i) => (
            <label
              className={`answer-option ${selection === i ? "selected" : ""}`}
              key={option}
            >
              <input
                type="radio"
                name={question.id}
                value={i}
                checked={selection === i}
                onChange={() => setSelection(i)}
              />
              <span className="answer-letter">
                {String.fromCharCode(65 + i)}
              </span>
              <span lang="en">{option}</span>
              {selection === i && <CheckCircle2 size={19} />}
            </label>
          ))}
        </fieldset>
        <div className="question-bottom">
          <span className="muted">
            <ShieldCheck size={14} /> {t("Saved only in this browser")}
          </span>
          <Button disabled={selection === null} onClick={submit}>
            {count + 1 === ASSESSMENT_LENGTH
              ? t("See my results")
              : t("Next question")}
            <ArrowRight size={17} />
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Results({
  state,
  base,
}: {
  state: LearnerState;
  base: string;
}) {
  const { t, language } = useLanguage();
  if (!state.assessment?.completedAt)
    return (
      <EmptyState
        icon={<Target size={34} />}
        title={t("Your starting point is still a little mystery.")}
        description={t(
          "Take the preliminary skills check to discover strengths and useful next steps.",
        )}
        href={`${base}/assessment`}
        action={t("Find my starting point")}
      />
    );
  const result = scoreAssessment(state.assessment.answers);
  return (
    <>
      <PageHeading
        eyebrow={t("YOUR NEXT CHAPTER, WITH A LITTLE MORE CLARITY")}
        title={
          result.estimatedLevel
            ? language === "th"
              ? `ระดับภาษาเบื้องต้นของคุณ: ${result.estimatedLevel}`
              : `Your preliminary starting point: ${result.estimatedLevel}`
            : t("A little more evidence will help.")
        }
        description={t(
          "A snapshot to guide your learning, with room to grow and reassess.",
        )}
      />
      <div className="info-box">
        <ShieldCheck size={23} />
        <div>
          <strong>
            {result.estimatedLevel
              ? t("Preliminary recognition estimate · not a certification")
              : t("Insufficient evidence — additional assessment recommended.")}
          </strong>
          <p>
            {language === "th"
              ? `ประเมินแล้ว ${result.coverage} จาก 6 ทักษะ ยังไม่ประเมินการฟัง การเขียน และการพูด ข้อสอบยังต้องผ่านการตรวจโดยผู้เชี่ยวชาญ ผลนี้ไม่ใช่ใบรับรอง CEFR และไม่ได้บอกระดับรวมครบทั้ง 6 ทักษะ`
              : `${result.coverage} of 6 skill areas checked. Listening, writing, and speaking are unassessed. This draft bank needs independent educator review. No certification probability or overall six-skill proficiency is inferred.`}
          </p>
        </div>
      </div>
      <div className="skill-results">
        {result.evaluations.map((e) => (
          <section className="card skill-result" key={e.skill}>
            <div>
              <span className="skill-name">{t(e.skill)}</span>
              <strong>{e.level ?? "—"}</strong>
            </div>
            <p>
              {e.total
                ? language === "th"
                  ? `ตอบถูก ${e.correct} จาก ${e.total} ข้อ · ${e.evidence === "limited" ? "ข้อมูลยังน้อย" : "ผลเบื้องต้น"}`
                  : `${e.correct} of ${e.total} correct · ${e.evidence} evidence`
                : t("Not assessed · additional assessment needed")}
            </p>
            {e.gaps.length > 0 && (
              <small>
                {language === "th" ? "เรื่องที่ควรฝึก: " : "Practise next: "}
                {e.gaps[0]}
              </small>
            )}
          </section>
        ))}
      </div>
      <div className="result-columns">
        <section className="card">
          <span className="eyebrow">
            <Sprout size={16} /> {t("YOUR STRENGTHS")}
          </span>
          <h2>{t("A foundation to build on.")}</h2>
          {result.strengths.length ? (
            result.strengths.map((s) => (
              <p className="check-line" key={s}>
                <CheckCircle2 size={16} />
                {s}
              </p>
            ))
          ) : (
            <p className="muted">
              {t(
                "More evidence is needed before naming a strength. Starting with the foundations is a positive first step.",
              )}
            </p>
          )}
        </section>
        <section className="card">
          <span className="eyebrow">
            <Target size={16} /> {t("YOUR LEARNING PRIORITIES")}
          </span>
          <h2>{t("Make the next step useful.")}</h2>
          {(result.priorities.length
            ? result.priorities
            : [
                "Extend your evidence with productive and listening assessments.",
              ]
          ).map((p) => (
            <p className="check-line" key={p}>
              <ArrowRight size={16} />
              {p}
            </p>
          ))}
        </section>
      </div>
      <div className="button-row">
        <Link className={buttonVariants()} href={`${base}/dashboard`}>
          {t("Go to my learning space")}
          <ArrowRight size={16} />
        </Link>
        <Link
          className={buttonVariants({ variant: "secondary" })}
          href={`${base}/assessment`}
        >
          {t("Review or reassess")}
        </Link>
      </div>
      <p className="privacy-note">
        {t(
          "Method: two correct items at a level, at least four answers per tested skill, and no contradictory lower-level errors. The combined recognition estimate uses the lowest supported tested skill. XP and learning progress do not affect this estimate.",
        )}
      </p>
    </>
  );
}
