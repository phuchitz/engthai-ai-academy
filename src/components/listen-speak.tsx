"use client";
import { useLanguage } from "./language";
import { useState } from "react";
import { Check, Headphones, Mic, Square, Volume2, X } from "lucide-react";
import {
  compareWords,
  listeningItems,
  speakingPrompts,
} from "@/lib/speech-practice";
import { PageHeading } from "./common";
import { Button } from "./ui/button";
import { speak, useSpeechRecognition, useSpeechSupport } from "./speech";

export function ListenSpeak() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"listening" | "speaking">("listening");
  return (
    <>
      <PageHeading
        eyebrow={t("TRAIN YOUR EARS AND VOICE")}
        title={t("Listen closely. Speak with confidence.")}
        description={t(
          "Short listening tasks and read-aloud practice using your browser's voice features.",
        )}
      />
      <div
        className="topic-filter"
        role="group"
        aria-label={t("Practice type")}
      >
        <button
          type="button"
          className="topic-chip"
          aria-pressed={tab === "listening"}
          onClick={() => setTab("listening")}
        >
          <Headphones size={14} /> {t("Listening")}
        </button>
        <button
          type="button"
          className="topic-chip"
          aria-pressed={tab === "speaking"}
          onClick={() => setTab("speaking")}
        >
          <Mic size={14} /> {t("Speaking")}
        </button>
      </div>
      {tab === "listening" ? <Listening /> : <Speaking />}
    </>
  );
}

function Listening() {
  const { t, language } = useLanguage();
  const support = useSpeechSupport();
  const [index, setIndex] = useState(0);
  const [plays, setPlays] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const item = listeningItems[index];
  const correct = checked && choice === item.correct;

  function play(rate: number) {
    if (speak(item.script, rate)) setPlays((n) => n + 1);
  }
  function next() {
    window.speechSynthesis?.cancel();
    setIndex((i) => (i + 1) % listeningItems.length);
    setPlays(0);
    setChoice(null);
    setChecked(false);
  }

  return (
    <section className="card tutor-panel" key={item.id}>
      <div className="flashcard-tags listening-tags">
        <span className="skill-pill">{item.level}</span>
        <span className="skill-pill">
          {language === "th" ? item.thaiTitle : item.title}
        </span>
        <span className="muted">
          {language === "th"
            ? `ข้อ ${index + 1} จาก ${listeningItems.length}`
            : `${index + 1} of ${listeningItems.length}`}
        </span>
      </div>
      {!support.synthesis ? (
        <p className="field-error">
          {t(
            "Audio playback isn't available in this browser. Try a recent version of Chrome, Edge, or Safari.",
          )}
        </p>
      ) : (
        <div className="button-row">
          <Button onClick={() => play(1)}>
            <Volume2 size={16} /> {plays ? t("Play again") : t("Play audio")}
          </Button>
          <Button variant="secondary" onClick={() => play(0.75)}>
            {t("Play slowly")}
          </Button>
        </div>
      )}
      <p className="muted listening-plays">
        {language === "th"
          ? `ฟังแล้ว ${plays} ครั้ง · ฟังซ้ำได้ไม่จำกัด`
          : `Played ${plays} ${plays === 1 ? "time" : "times"} · Replay as often as you like`}
      </p>
      <h2 lang="en">{item.question}</h2>
      {language === "th" && <p className="muted">{item.questionThai}</p>}
      <fieldset className="answer-options" disabled={checked}>
        <legend className="sr-only">{t("Choose your answer")}</legend>
        {item.options.map((option, i) => (
          <label
            key={option}
            className={`answer-option ${choice === i ? "selected" : ""}`}
          >
            <input
              type="radio"
              name={item.id}
              checked={choice === i}
              onChange={() => setChoice(i)}
            />
            <span className="answer-letter">{String.fromCharCode(65 + i)}</span>
            <span lang="en">{option}</span>
          </label>
        ))}
      </fieldset>
      {!checked ? (
        <Button
          disabled={choice === null || plays === 0}
          onClick={() => setChecked(true)}
        >
          {t("Check my answer")}
        </Button>
      ) : (
        <>
          <p role="status" className={`feedback ${correct ? "" : "retry"}`}>
            {correct ? <Check size={16} /> : <X size={16} />}{" "}
            {correct
              ? t("Correct. Nicely heard!")
              : language === "th"
                ? `ยังไม่ถูก คำตอบคือ ${String.fromCharCode(65 + item.correct)}`
                : `Not quite. The answer is ${String.fromCharCode(65 + item.correct)}.`}
          </p>
          <details className="thai-hint" open={!correct}>
            <summary>{t("Show transcript")}</summary>
            <p lang="en">{item.script}</p>
          </details>
          <Button onClick={next}>{t("Next audio")}</Button>
        </>
      )}
      <p className="privacy-note">
        {t(
          "Audio uses your browser's built-in voices, so the accent and quality depend on your device. This is practice, not a listening assessment.",
        )}
      </p>
    </section>
  );
}

function Speaking() {
  const { t, language } = useLanguage();
  const support = useSpeechSupport();
  const { listening, error, listen, stop } = useSpeechRecognition();
  const [index, setIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const prompt = speakingPrompts[index];
  const result = transcript ? compareWords(prompt.text, transcript) : null;

  function next() {
    stop();
    setIndex((i) => (i + 1) % speakingPrompts.length);
    setTranscript("");
  }

  return (
    <section className="card tutor-panel" key={prompt.id}>
      <div className="flashcard-tags listening-tags">
        <span className="skill-pill">{prompt.level}</span>
        <span className="muted">
          {language === "th"
            ? `ประโยคที่ ${index + 1} จาก ${speakingPrompts.length}`
            : `${index + 1} of ${speakingPrompts.length}`}
        </span>
      </div>
      <p className="eyebrow">{t("READ THIS SENTENCE ALOUD")}</p>
      <h2 lang="en" className="speaking-target">
        {result
          ? result.words.map((w, i) => (
              <span key={i} className={w.heard ? "word-heard" : "word-missed"}>
                {w.display}{" "}
              </span>
            ))
          : prompt.text}
      </h2>
      <p className="muted" lang="th">
        {prompt.thai}
      </p>
      <div className="button-row">
        {support.synthesis && (
          <Button variant="secondary" onClick={() => speak(prompt.text, 0.9)}>
            <Volume2 size={16} /> {t("Hear an example")}
          </Button>
        )}
        {support.recognition &&
          (listening ? (
            <Button onClick={stop}>
              <Square size={15} /> {t("Stop")}
            </Button>
          ) : (
            <Button onClick={() => listen(setTranscript)}>
              <Mic size={16} />{" "}
              {transcript ? t("Try again") : t("Start speaking")}
            </Button>
          ))}
      </div>
      {!support.recognition && (
        <p className="field-error">
          {t(
            "Speech recognition isn't available in this browser. Try Chrome or Edge on a computer or Android, or Safari on iPhone.",
          )}
        </p>
      )}
      {listening && (
        <p role="status" className="muted">
          {t("Listening… speak now.")}
        </p>
      )}
      {error && (
        <p role="alert" className="field-error">
          {t(error)}
        </p>
      )}
      {result && (
        <div role="status" className="speaking-result">
          <p>
            {language === "th"
              ? `ระบบได้ยิน ${result.matched} จาก ${result.total} คำ`
              : `The recognizer heard ${result.matched} of ${result.total} words`}
          </p>
          <p className="muted">
            {t("What the browser heard:")} <span lang="en">“{transcript}”</span>
          </p>
        </div>
      )}
      <div className="button-row">
        <Button variant="secondary" onClick={next}>
          {t("Next sentence")}
        </Button>
      </div>
      <p className="privacy-note">
        {t(
          "Speech recognition is provided by your browser and may send your voice to its provider (for example, Google in Chrome). EngThai does not record or store audio. Word matching shows what the recognizer understood; it is not a pronunciation score.",
        )}
      </p>
    </section>
  );
}
