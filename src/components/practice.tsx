"use client";
import { useLanguage } from "./language";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { lessonCopy } from "@/lib/language";
import type { LearnerState, Lesson } from "@/lib/models";
import { scheduleReview, vocabulary } from "@/lib/learning";
import { Button } from "./ui/button";
import { PageHeading } from "./common";

export function LessonPlayer({
  lesson,
  completed,
  onComplete,
  backHref,
}: {
  lesson: Lesson;
  completed: boolean;
  onComplete: (lesson: Lesson) => void;
  backHref: string;
}) {
  const { t, language } = useLanguage();
  const [practice, setPractice] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = selected === lesson.exercise.correct;
  return (
    <section className="lesson-player">
      <Link className="text-link" href={backHref}>
        <ArrowLeft size={15} /> {t("All lessons")}
      </Link>
      <PageHeading
        eyebrow={`${lesson.skill.toUpperCase()} · ${lesson.level} · ${lesson.minutes} MIN`}
        title={lessonCopy(language, lesson).title}
        description={lesson.objective}
      />
      <div className="card lesson-content">
        {!practice ? (
          <>
            <span className="step-label">{t("01 / UNDERSTAND")}</span>
            <h2>{t("Let's make it click.")}</h2>
            <p lang="en" className="lesson-explanation">
              {lesson.explanation}
            </p>
            <p className="thai-explanation" lang="th">
              {lesson.thai}
            </p>
            <h3>{t("See it in a sentence")}</h3>
            <div className="example-list">
              {lesson.examples.map((e) => (
                <p key={e}>
                  <span />
                  {e}
                </p>
              ))}
            </div>
            <Button onClick={() => setPractice(true)}>
              {t("Let's practise")}
              <ArrowRight size={16} />
            </Button>
          </>
        ) : (
          <>
            <span className="step-label">{t("02 / TRY IT YOURSELF")}</span>
            <h2 lang="en">{lesson.exercise.prompt}</h2>
            <fieldset className="answer-options">
              <legend className="sr-only">{t("Choose your answer")}</legend>
              {lesson.exercise.options.map((option, i) => (
                <label
                  key={option}
                  className={`answer-option ${selected === i ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="lesson-answer"
                    value={i}
                    checked={selected === i}
                    disabled={checked && correct}
                    onChange={() => {
                      setSelected(i);
                      setChecked(false);
                    }}
                  />
                  <span className="answer-letter">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </label>
              ))}
            </fieldset>
            {checked && (
              <div
                role="status"
                className={`feedback ${correct ? "correct" : "retry"}`}
              >
                <strong>
                  {correct
                    ? t("That's it. A little more confidence!")
                    : t("Nearly there. Give it another try.")}
                </strong>
                <p>
                  {correct
                    ? lesson.exercise.feedback
                    : t(
                        "Read the explanation again, then choose another answer.",
                      )}
                </p>
              </div>
            )}
            <div className="button-row">
              <Button variant="secondary" onClick={() => setPractice(false)}>
                <ArrowLeft size={16} /> {t("Explanation")}
              </Button>
              {checked && correct ? (
                <Button onClick={() => onComplete(lesson)}>
                  <CheckCircle2 size={17} />
                  {completed
                    ? t("Finish review")
                    : t(`Complete lesson · +${lesson.xp} XP`)}
                </Button>
              ) : (
                <Button
                  disabled={selected === null || checked}
                  onClick={() => setChecked(true)}
                >
                  {t("Check my answer")}
                  <Check size={16} />
                </Button>
              )}
            </div>
            {completed && (
              <p className="privacy-note">
                {t("This is a review. XP is awarded once per lesson.")}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export function Vocabulary({
  state,
  update,
}: {
  state: LearnerState;
  update: (state: LearnerState) => boolean;
}) {
  const { t, language } = useLanguage();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [audioIssue, setAudioIssue] = useState("");
  const due = vocabulary.filter((item) => {
    const review = state.reviews.find((r) => r.itemId === item.id);
    return !review || new Date(review.due) <= new Date();
  });
  const item = due[index % Math.max(due.length, 1)];
  useEffect(
    () => () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    [],
  );
  function speak() {
    if (!("speechSynthesis" in window)) {
      setAudioIssue(
        "Speech playback is unavailable in this browser. You can still read the pronunciation guide.",
      );
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.word);
    utterance.lang = "en-GB";
    utterance.onerror = () =>
      setAudioIssue(
        "Audio couldn't play. Try again, or use the written pronunciation guide.",
      );
    setAudioIssue("");
    window.speechSynthesis.speak(utterance);
  }
  function review(remembered: boolean) {
    const nextReview = scheduleReview(
      item.id,
      state.reviews.find((r) => r.itemId === item.id),
      remembered,
      new Date(),
    );
    if (
      update({
        ...state,
        reviews: [
          ...state.reviews.filter((r) => r.itemId !== item.id),
          nextReview,
        ],
      })
    ) {
      setRevealed(false);
      setIndex(0);
      setAudioIssue("");
    }
  }
  return (
    <>
      <PageHeading
        eyebrow={t("WORDS THAT OPEN DOORS")}
        title={t("A little vocabulary. A bigger world.")}
        description={t(
          "Learn in context, hear a word, and revisit it when it's time.",
        )}
      />
      <div className="vocabulary-toolbar">
        <span className="skill-pill">
          {language === "th"
            ? `คำศัพท์ที่พร้อมทบทวน ${due.length} คำ`
            : `${due.length} words ready to review`}
        </span>
        <span className="muted">{t("Reviews stay in this browser")}</span>
      </div>
      {!item ? (
        <div className="assessment-intro card">
          <span className="success-medallion">
            <CheckCircle2 size={30} />
          </span>
          <h2>{t("A little practice, beautifully done.")}</h2>
          <p className="muted">
            {t("You're up to date. Come back when your next review is due.")}
          </p>
          <p>
            {t("Next review:")}{" "}
            {state.reviews
              .map((r) => new Date(r.due))
              .sort((a, b) => a.getTime() - b.getTime())[0]
              ?.toLocaleDateString(language === "th" ? "th-TH" : "en-GB") ??
              "Tomorrow"}
          </p>
        </div>
      ) : (
        <section className="flashcard card">
          <span className="eyebrow">{t("YOUR NEXT USEFUL WORD")}</span>
          <button
            className="sound-button"
            aria-label={`Hear ${item.word}`}
            onClick={speak}
          >
            <Volume2 size={23} />
          </button>
          <h2>{item.word}</h2>
          <span className="phonetic">{item.pronunciation}</span>
          {revealed ? (
            <>
              <p className="translation" lang="th">
                {item.thai}
              </p>
              <blockquote lang="en">{item.example}</blockquote>
              <div className="button-row">
                <Button variant="secondary" onClick={() => review(false)}>
                  <RotateCcw size={16} /> {t("Still learning")}
                </Button>
                <Button onClick={() => review(true)}>
                  <Check size={16} /> {t("I remembered")}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="muted">
                {t("Can you remember what this word means?")}
              </p>
              <Button variant="secondary" onClick={() => setRevealed(true)}>
                {t("Reveal meaning")}
                <ArrowRight size={16} />
              </Button>
            </>
          )}
          {audioIssue && (
            <p role="status" className="field-error">
              {audioIssue}
            </p>
          )}
          <p className="privacy-note">
            {t(
              "Playback uses available browser voices. This is not pronunciation assessment.",
            )}
          </p>
        </section>
      )}
    </>
  );
}
