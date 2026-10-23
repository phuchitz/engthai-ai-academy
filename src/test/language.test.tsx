import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { parseLanguage, translate, lessonCopy } from "@/lib/language";
import {
  LanguageProvider,
  LanguageSwitcher,
  useLanguage,
} from "@/components/language";
import { lessons } from "@/lib/learning";

describe("language preference", () => {
  it("defaults to Thai for missing or untrusted cookie values", () => {
    expect(parseLanguage(undefined)).toBe("th");
    expect(parseLanguage("de")).toBe("th");
    expect(parseLanguage("en")).toBe("en");
  });
  it("preserves English learning content and safely handles unknown dictionary keys", () => {
    expect(translate("th", "Continue Learning")).toBe("เรียนต่อ");
    expect(translate("en", "Continue Learning")).toBe("Continue Learning");
    expect(translate("th", "She is a designer.")).toBe("She is a designer.");
    expect(translate("th", "toString")).toBe("toString");
    expect(lessonCopy("th", lessons[0]).title).toBe(
      "แต่งประโยคง่าย ๆ ให้ครบความ",
    );
    expect(lessonCopy("en", lessons[0]).title).toBe(lessons[0].title);
  });
  it("updates language, HTML semantics and cookie without remounting learner inputs", async () => {
    const user = userEvent.setup();
    function Example() {
      const { t } = useLanguage();
      return (
        <>
          <LanguageSwitcher />
          <h1>{t("Continue Learning")}</h1>
          <input aria-label="Learner name" defaultValue="นก" />
        </>
      );
    }
    render(
      <LanguageProvider initialLanguage="th">
        <Example />
      </LanguageProvider>,
    );
    await user.type(screen.getByLabelText("Learner name"), "ไทย");
    await user.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByRole("heading")).toHaveTextContent("Continue Learning");
    expect(document.documentElement.lang).toBe("en");
    expect(document.cookie).toContain("engthai-language=en");
    expect(screen.getByLabelText("Learner name")).toHaveValue("นกไทย");
    await user.click(screen.getByRole("button", { name: "ภาษาไทย" }));
    expect(screen.getByRole("heading")).toHaveTextContent("เรียนต่อ");
    expect(document.documentElement.lang).toBe("th");
    expect(screen.getByRole("button", { name: "ภาษาไทย" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
