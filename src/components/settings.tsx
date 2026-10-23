"use client";
import { useState } from "react";
import { ArrowDownToLine, ShieldCheck } from "lucide-react";
import type { LearnerState, UserPreferences } from "@/lib/models";
import { Button } from "./ui/button";
import { Onboarding } from "./onboarding";

export function Settings({
  state,
  onSave,
  onReset,
  demo,
}: {
  state: LearnerState;
  onSave: (p: UserPreferences) => void;
  onReset: () => void;
  demo: boolean;
}) {
  const [resetting, setResetting] = useState(false);
  const [exportIssue, setExportIssue] = useState("");
  function exportData() {
    try {
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(state, null, 2)], {
          type: "application/json",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "engthai-learning-progress.json";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setExportIssue(
        "Export was unavailable. Please check your browser's download permissions.",
      );
    }
  }
  return (
    <>
      <Onboarding
        key={state.preferences ? "saved" : "new"}
        settings
        initial={state.preferences}
        onSave={onSave}
      />
      <section className="card settings-data">
        <span className="eyebrow">
          <ShieldCheck size={16} /> YOUR DATA
        </span>
        <h2>Saved here, in your browser.</h2>
        <p className="muted">
          {demo
            ? "Demo progress is stored separately from signed-in accounts. "
            : "Learning progress is separated by account on this browser. "}
          It does not sync between devices. Clearing browser data, private
          browsing, or changing devices can lose progress. Anyone with access to
          this browser profile may be able to read browser-local learning data.
          Avoid writing sensitive information in your preferences.
        </p>
        <div className="button-row">
          <Button variant="secondary" onClick={exportData}>
            <ArrowDownToLine size={16} /> Export my progress
          </Button>
          <Button variant="ghost" onClick={() => setResetting(!resetting)}>
            Reset browser progress
          </Button>
        </div>
        {exportIssue && <p role="alert">{exportIssue}</p>}
        {resetting && (
          <div className="info-box reset-box">
            <div>
              <strong>
                Remove this account&apos;s saved learning progress?
              </strong>
              <p>
                This clears preferences, answers, lessons, and reviews from this
                browser. Export first if you want a copy.
              </p>
              <div className="button-row">
                <Button
                  onClick={() => {
                    onReset();
                    setResetting(false);
                  }}
                >
                  Yes, reset my progress
                </Button>
                <Button variant="secondary" onClick={() => setResetting(false)}>
                  Keep my progress
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
