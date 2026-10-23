import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { Onboarding } from "@/components/onboarding";
it("requires meaningful preferences and supports more than one learning goal", async () => {
  const save = vi.fn();
  const user = userEvent.setup();
  render(<Onboarding onSave={save} />);
  await user.click(
    screen.getByRole("button", { name: /find my starting point/i }),
  );
  expect(await screen.findByText("Please enter your name")).toBeVisible();
  expect(save).not.toHaveBeenCalled();
  await user.type(screen.getByLabelText("What should we call you?"), "Nok");
  await user.click(screen.getByLabelText("Travel", { exact: true }));
  await user.click(
    screen.getByLabelText("Work communication", { exact: true }),
  );
  await user.click(screen.getByLabelText("Technology", { exact: true }));
  await user.click(
    screen.getByRole("button", { name: /find my starting point/i }),
  );
  await waitFor(() => expect(save).toHaveBeenCalled());
  expect(save.mock.calls[0][0]).toMatchObject({
    displayName: "Nok",
    goals: ["Travel", "Work communication"],
    dailyMinutes: 15,
    topics: ["Technology"],
  });
});
