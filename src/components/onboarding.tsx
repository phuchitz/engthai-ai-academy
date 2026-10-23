"use client";
import { useLanguage } from "./language";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import {
  goals,
  topics,
  preferencesSchema,
  type UserPreferences,
} from "@/lib/models";
import { Button } from "./ui/button";

export function Onboarding({
  initial,
  onSave,
  settings = false,
}: {
  initial?: UserPreferences | null;
  onSave: (preferences: UserPreferences) => void;
  settings?: boolean;
}) {
  const { t } = useLanguage();
  const Heading = settings ? "h2" : "h1";
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserPreferences>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: initial ?? {
      displayName: "",
      goals: [],
      dailyMinutes: 15,
      topics: [],
      motivation: "",
    },
  });
  return (
    <section className="onboarding card">
      <span className="eyebrow">
        <Sparkles size={16} /> {t("YOUR JOURNEY, YOUR WAY")}
      </span>
      <Heading>
        {settings
          ? t("Make this space yours.")
          : t("Let's make English work for you.")}
      </Heading>
      <p className="muted">
        {t("A few little details help us shape your learning journey.")}{" "}
        <span lang="th">เริ่มต้นในแบบของคุณ</span>
      </p>
      <form onSubmit={handleSubmit(onSave)} noValidate>
        <label className="field-label" htmlFor="displayName">
          {t("What should we call you?")}
        </label>
        <input
          id="displayName"
          autoComplete="given-name"
          placeholder={t("Your preferred name")}
          maxLength={50}
          {...register("displayName")}
          aria-invalid={!!errors.displayName}
          aria-describedby={errors.displayName ? "name-error" : undefined}
        />
        {errors.displayName && (
          <p id="name-error" role="alert" className="field-error">
            {t(errors.displayName.message ?? "")}
          </p>
        )}
        <fieldset>
          <legend>
            {t("What would you like to do with English?")}{" "}
            <small>{t("Choose as many as you like.")}</small>
          </legend>
          <div className="choice-grid">
            {goals.map((goal) => (
              <label className="choice" key={goal}>
                <input type="checkbox" value={goal} {...register("goals")} />
                <span>{t(goal)}</span>
              </label>
            ))}
          </div>
          {errors.goals && (
            <p role="alert" className="field-error">
              {t(errors.goals.message ?? "")}
            </p>
          )}
        </fieldset>
        <fieldset>
          <legend>{t("A little time, every day")}</legend>
          <Controller
            name="dailyMinutes"
            control={control}
            render={({ field }) => (
              <div className="duration-grid">
                {([10, 15, 20, 30] as const).map((minutes) => (
                  <label
                    className={`duration ${field.value === minutes ? "selected" : ""}`}
                    key={minutes}
                  >
                    <input
                      type="radio"
                      name={field.name}
                      checked={field.value === minutes}
                      onChange={() => field.onChange(minutes)}
                      value={minutes}
                    />
                    <strong>{minutes}</strong>
                    <span>{t("min / day")}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </fieldset>
        <fieldset>
          <legend>{t("What sparks your interest?")}</legend>
          <div className="choice-grid">
            {topics.map((topic) => (
              <label className="choice" key={topic}>
                <input type="checkbox" value={topic} {...register("topics")} />
                <span>{t(topic)}</span>
              </label>
            ))}
          </div>
          {errors.topics && (
            <p role="alert" className="field-error">
              {t(errors.topics.message ?? "")}
            </p>
          )}
        </fieldset>
        <label className="field-label" htmlFor="motivation">
          {t("Your reason to keep going")}
          <small>{t("Optional")}</small>
        </label>
        <textarea
          id="motivation"
          maxLength={300}
          placeholder={t("I'd love to feel more confident in meetings…")}
          rows={3}
          {...register("motivation")}
        />
        {errors.motivation && (
          <p role="alert" className="field-error">
            {t(errors.motivation.message ?? "")}
          </p>
        )}
        <p className="privacy-note">
          {t(
            "Your preferences and learning progress are saved only in this browser. They do not sync across devices.",
          )}
        </p>
        <Button type="submit">
          {settings ? (
            <>
              <Check size={17} /> {t("Save preferences")}
            </>
          ) : (
            <>
              {t("Find my starting point")}
              <ArrowRight size={17} />
            </>
          )}
        </Button>
      </form>
    </section>
  );
}
