import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { LessonPlayer } from "@/components/practice";
import { lessons } from "@/lib/learning";

it("requires a correct exercise before completing a lesson", async () => {
  const complete = vi.fn();
  const user = userEvent.setup();
  render(
    <LessonPlayer
      lesson={lessons[0]}
      completed={false}
      onComplete={complete}
      backHref="/demo/lessons"
    />,
  );
  await user.click(screen.getByRole("button", { name: "Let's practise" }));
  expect(
    screen.getByRole("button", { name: "Check my answer" }),
  ).toBeDisabled();
  await user.click(screen.getAllByRole("radio")[0]);
  await user.click(screen.getByRole("button", { name: "Check my answer" }));
  expect(screen.getByRole("status")).toHaveTextContent("Give it another try");
  expect(complete).not.toHaveBeenCalled();
  expect(
    screen.queryByRole("button", { name: /Complete lesson/ }),
  ).not.toBeInTheDocument();
  await user.click(screen.getAllByRole("radio")[1]);
  await user.click(screen.getByRole("button", { name: "Check my answer" }));
  await user.click(
    screen.getByRole("button", { name: "Complete lesson · +30 XP" }),
  );
  expect(complete).toHaveBeenCalledExactlyOnceWith(lessons[0]);
});
