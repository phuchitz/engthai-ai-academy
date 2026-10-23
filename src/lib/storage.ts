import {
  emptyLearnerState,
  learnerStateSchema,
  type LearnerState,
} from "./models";
export interface ProgressRepository {
  load(): LearnerState;
  save(state: LearnerState): void;
  clear(): void;
}
export function parseProgress(raw: string | null): LearnerState {
  if (!raw) return emptyLearnerState();
  const parsed = learnerStateSchema.safeParse(JSON.parse(raw));
  if (!parsed.success)
    throw new Error(
      "Saved progress is incompatible or damaged. Reset it in Settings, or export the browser data before continuing.",
    );
  return parsed.data;
}
export function browserRepository(
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem">,
  accountId: string,
): ProgressRepository {
  const key = `engthai:v1:${accountId}`;
  return {
    load: () => parseProgress(storage.getItem(key)),
    save: (state) =>
      storage.setItem(key, JSON.stringify(learnerStateSchema.parse(state))),
    clear: () => storage.removeItem(key),
  };
}
