"use client";
import { useLanguage } from "./language";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  MessageCircle,
  Mic,
  PenLine,
  RotateCcw,
  Send,
  Square,
} from "lucide-react";
import {
  CONVERSATION_TURN_LIMIT,
  TUTOR_INPUT_LIMIT,
  conversationScenarios,
  type AskOutput,
  type ScenarioId,
  type TutorRequest,
  type TutorResponse,
  type TutorStatus,
  type WritingOutput,
} from "@/lib/ai";
import type { Level } from "@/lib/models";
import { PageHeading } from "./common";
import { useSpeechRecognition, useSpeechSupport } from "./speech";
import { Button, buttonVariants } from "./ui/button";

type Mode = TutorRequest["mode"];
type Turn = {
  role: "partner" | "learner";
  text: string;
  feedback?: string | null;
  betterPhrase?: string | null;
};

const errorMessages: Record<string, string> = {
  "not-configured": "The AI tutor is not configured yet.",
  unauthenticated: "Please sign in again to use the AI tutor.",
  "invalid-request": "Please check your message and try again.",
  "rate-limited":
    "You've reached the AI tutor limit for now. Please try again later.",
  busy: "The tutor is busy. Please try again shortly.",
  timeout: "The tutor took too long to respond. Please try again.",
  declined:
    "The tutor couldn't help with that message. Try asking about English.",
  unavailable: "The tutor is unavailable right now. Please try again later.",
};

export function Tutor({
  base,
  demo,
  level,
}: {
  base: string;
  demo: boolean;
  level: Level | null;
}) {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<TutorStatus | null>(null);
  const [statusError, setStatusError] = useState(false);
  const [mode, setMode] = useState<Mode>("ask");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [askResult, setAskResult] = useState<AskOutput | null>(null);
  const [writingResult, setWritingResult] = useState<WritingOutput | null>(
    null,
  );
  const [scenario, setScenario] = useState<ScenarioId>("cafe");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [finished, setFinished] = useState(false);
  const speechSupport = useSpeechSupport();
  const dictation = useSpeechRecognition();

  useEffect(() => {
    if (demo) return;
    let active = true;
    fetch("/api/tutor", { cache: "no-store" })
      .then((r) =>
        r.ok ? (r.json() as Promise<TutorStatus>) : Promise.reject(),
      )
      .then((s) => active && setStatus(s))
      .catch(() => active && setStatusError(true));
    return () => {
      active = false;
    };
  }, [demo]);

  function startScenario(id: ScenarioId) {
    const opener = conversationScenarios.find((s) => s.id === id)!.opener;
    setScenario(id);
    setTurns([{ role: "partner", text: opener }]);
    setFinished(false);
    setError("");
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    if (next === "conversation" && turns.length === 0) startScenario(scenario);
  }

  async function send() {
    const message = text.trim();
    if (!message || busy) return;
    const common = { explainIn: language, level } as const;
    const history = [...turns, { role: "learner" as const, text: message }];
    const body: TutorRequest =
      mode === "conversation"
        ? {
            mode,
            scenario,
            history: history
              .slice(-CONVERSATION_TURN_LIMIT)
              .map(({ role, text }) => ({ role, text })),
            ...common,
          }
        : { mode, text: message, ...common };
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as TutorResponse | { error: string };
      if (!response.ok || "error" in data) {
        setError(
          errorMessages["error" in data ? data.error : "unavailable"] ??
            errorMessages.unavailable,
        );
        return;
      }
      setStatus((s) => (s ? { ...s, remaining: data.remaining } : s));
      if (data.mode === "ask") setAskResult(data.result);
      if (data.mode === "writing") setWritingResult(data.result);
      if (data.mode === "conversation") {
        const learnerTurn: Turn = {
          role: "learner",
          text: message,
          feedback: data.result.feedback,
          betterPhrase: data.result.betterPhrase,
        };
        setTurns([
          ...turns,
          learnerTurn,
          { role: "partner", text: data.result.reply },
        ]);
        setFinished(data.result.finished);
      }
      setText("");
    } catch {
      setError(errorMessages.unavailable);
    } finally {
      setBusy(false);
    }
  }

  const heading = (
    <PageHeading
      eyebrow={t("A LITTLE HELP, WHEN YOU NEED IT")}
      title={t("Your AI English tutor.")}
      description={t(
        "Ask about English, get feedback on your writing, or practise a real-life conversation.",
      )}
    />
  );

  if (demo)
    return (
      <>
        {heading}
        <div className="tutor-intro card">
          <span className="tutor-orb">
            <MessageCircle size={39} strokeWidth={1.3} />
          </span>
          <h2>{t("Sign in to talk with the AI tutor.")}</h2>
          <p className="muted">
            {t(
              "The AI tutor runs securely on our server and is available to signed-in learners only.",
            )}
          </p>
          <Link className={buttonVariants()} href="/login">
            {t("Sign in with Google")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </>
    );

  if (statusError || (status && !status.configured))
    return (
      <>
        {heading}
        <div className="tutor-intro card">
          <span className="tutor-orb">
            <MessageCircle size={39} strokeWidth={1.3} />
          </span>
          <h2>{t("The AI tutor isn't available yet.")}</h2>
          <p className="muted">
            {statusError
              ? t(
                  "We couldn't check the tutor right now. Please try again later.",
                )
              : t(
                  "The app owner still needs to connect an AI provider on the server. Your lessons and vocabulary practice work as usual.",
                )}
          </p>
          <Link className={buttonVariants()} href={`${base}/lessons`}>
            {t("Explore today's lessons")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </>
    );

  const modes: { id: Mode; label: string; icon: typeof BookOpen }[] = [
    { id: "ask", label: "Ask the tutor", icon: BookOpen },
    { id: "writing", label: "Check my writing", icon: PenLine },
    {
      id: "conversation",
      label: "Practise a conversation",
      icon: MessageCircle,
    },
  ];
  const placeholder =
    mode === "ask"
      ? t("For example: When do I use 'since' and 'for'?")
      : mode === "writing"
        ? t("Write a few English sentences you'd like feedback on.")
        : t("Type your reply in English.");

  return (
    <>
      {heading}
      <div className="topic-filter" role="group" aria-label={t("Tutor mode")}>
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className="topic-chip"
            aria-pressed={mode === id}
            onClick={() => switchMode(id)}
          >
            <Icon size={14} /> {t(label)}
          </button>
        ))}
      </div>

      {mode === "conversation" && (
        <section className="card tutor-panel">
          <div className="topic-filter" role="group" aria-label={t("Scenario")}>
            {conversationScenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                className="topic-chip"
                aria-pressed={scenario === s.id}
                onClick={() => startScenario(s.id)}
              >
                {language === "th" ? s.thai : s.title}
              </button>
            ))}
          </div>
          <ol className="chat-log" aria-live="polite">
            {turns.map((turn, i) => (
              <li key={i} className={`chat-turn ${turn.role}`}>
                <p lang="en">{turn.text}</p>
                {turn.betterPhrase && (
                  <p className="chat-note">
                    {t("More natural:")}{" "}
                    <span lang="en">{turn.betterPhrase}</span>
                  </p>
                )}
                {turn.feedback && <p className="chat-note">{turn.feedback}</p>}
              </li>
            ))}
          </ol>
          {finished && (
            <p className="muted">
              {t("Nice work — this conversation has reached a natural end.")}{" "}
              <button
                type="button"
                className="link-button"
                onClick={() => startScenario(scenario)}
              >
                <RotateCcw size={13} /> {t("Start again")}
              </button>
            </p>
          )}
        </section>
      )}

      <section className="card tutor-panel">
        <label className="sr-only" htmlFor="tutor-input">
          {placeholder}
        </label>
        <textarea
          id="tutor-input"
          lang="en"
          value={text}
          maxLength={TUTOR_INPUT_LIMIT}
          rows={mode === "writing" ? 6 : 3}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          disabled={busy || (mode === "conversation" && finished)}
        />
        <div className="question-bottom">
          <span className="muted">
            {text.length}/{TUTOR_INPUT_LIMIT}
            {status &&
              (language === "th"
                ? ` · ใช้ได้อีก ${status.remaining} ครั้งวันนี้`
                : ` · ${status.remaining} requests left today`)}
          </span>
          {mode === "conversation" && speechSupport.recognition && (
            <Button
              variant="secondary"
              disabled={busy || finished}
              onClick={() =>
                dictation.listening
                  ? dictation.stop()
                  : dictation.listen((heard) =>
                      setText((current) =>
                        (current ? `${current} ${heard}` : heard).slice(
                          0,
                          TUTOR_INPUT_LIMIT,
                        ),
                      ),
                    )
              }
            >
              {dictation.listening ? <Square size={15} /> : <Mic size={15} />}
              {dictation.listening ? t("Stop") : t("Speak")}
            </Button>
          )}
          <Button
            onClick={send}
            disabled={
              !text.trim() ||
              busy ||
              !status ||
              (mode === "conversation" && finished)
            }
          >
            {busy ? t("Thinking…") : t("Send")}
            <Send size={15} />
          </Button>
        </div>
        {error && (
          <p role="alert" className="field-error">
            {t(error)}
          </p>
        )}
        {mode === "conversation" && dictation.error && (
          <p role="alert" className="field-error">
            {t(dictation.error)}
          </p>
        )}
      </section>

      {mode === "ask" && askResult && (
        <section className="card tutor-panel" aria-live="polite">
          <p className="tutor-answer">{askResult.answer}</p>
          {askResult.examples.length > 0 && (
            <ul className="tutor-examples">
              {askResult.examples.map((example) => (
                <li key={example} lang="en">
                  {example}
                </li>
              ))}
            </ul>
          )}
          {askResult.uncertainty && (
            <p className="chat-note">{askResult.uncertainty}</p>
          )}
        </section>
      )}

      {mode === "writing" && writingResult && (
        <section className="card tutor-panel" aria-live="polite">
          <h2>{t("Suggested version")}</h2>
          <blockquote className="reading-passage" lang="en">
            {writingResult.correctedText}
          </blockquote>
          <p>{writingResult.overall}</p>
          {writingResult.issues.length > 0 && (
            <ul className="writing-issues">
              {writingResult.issues.map((issue, i) => (
                <li key={i}>
                  <span className="skill-pill">{t(issue.category)}</span>
                  <p>
                    <s lang="en">{issue.original}</s> →{" "}
                    <strong lang="en">{issue.suggestion}</strong>
                  </p>
                  <p className="muted">{issue.explanation}</p>
                </li>
              ))}
            </ul>
          )}
          {writingResult.strengths.length > 0 && (
            <>
              <h3>{t("What you did well")}</h3>
              <ul>
                {writingResult.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </>
          )}
          <p className="privacy-note">{writingResult.limitations}</p>
        </section>
      )}

      <p className="privacy-note tutor-disclaimer">
        {t(
          "AI feedback can be wrong. It is practice support, not an assessment score or CEFR level. Avoid sharing personal or sensitive information.",
        )}
      </p>
    </>
  );
}
