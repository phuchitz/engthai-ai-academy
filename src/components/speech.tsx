"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

// Minimal typing for the Web Speech API, which TypeScript's DOM library does not fully cover.
interface RecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
interface RecognitionErrorEvent {
  error: string;
}
interface Recognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionConstructor = new () => Recognition;

function recognitionConstructor(): RecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const noSubscribe = () => () => {};

export function useSpeechSupport() {
  const recognition = useSyncExternalStore(
    noSubscribe,
    () => recognitionConstructor() !== null,
    () => false,
  );
  const synthesis = useSyncExternalStore(
    noSubscribe,
    () => "speechSynthesis" in window,
    () => false,
  );
  return { recognition, synthesis };
}

const recognitionErrors: Record<string, string> = {
  "not-allowed":
    "Microphone access was blocked. Allow the microphone in your browser settings and try again.",
  "service-not-allowed":
    "Microphone access was blocked. Allow the microphone in your browser settings and try again.",
  "no-speech":
    "We didn't hear anything. Try again a little closer to the microphone.",
  "audio-capture": "No microphone was found on this device.",
  network: "Speech recognition needs an internet connection. Please try again.",
};

// Push-to-talk recognition of one short English utterance.
export function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const active = useRef<Recognition | null>(null);

  useEffect(() => () => active.current?.abort(), []);

  const listen = useCallback((onTranscript: (text: string) => void) => {
    const Constructor = recognitionConstructor();
    if (!Constructor) return;
    active.current?.abort();
    const recognition = new Constructor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript ?? "";
      if (text) onTranscript(text);
    };
    recognition.onerror = (event) => {
      if (event.error !== "aborted")
        setError(
          recognitionErrors[event.error] ??
            "Speech recognition stopped unexpectedly. Please try again.",
        );
    };
    recognition.onend = () => {
      setListening(false);
      active.current = null;
    };
    active.current = recognition;
    setError("");
    setListening(true);
    try {
      recognition.start();
    } catch {
      setListening(false);
      setError("Speech recognition stopped unexpectedly. Please try again.");
    }
  }, []);

  // stop() ends listening but still delivers what was heard; abort() discards it.
  const stop = useCallback(() => active.current?.stop(), []);

  return { listening, error, listen, stop };
}

export function speak(text: string, rate = 1) {
  if (!("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
  return true;
}
