# Preliminary recognition assessment v1

## Intended use

A short learning-oriented check, not an official CEFR exam. There are 24 draft multiple-choice items: grammar, vocabulary, and reading, each with two items at each of A1, A2, B1, and B2. The session selects six distinct items per skill, 18 total. Every item includes an answer key, explanation, and learning objective.

The question bank is author-created and **not independently reviewed or empirically calibrated**. Before public claims of validated placement, a qualified language educator must review items, descriptor alignment, distractors, answer keys, cultural accessibility, and the rule set. No source package supplied a validated bank. C1/C2 are included in the domain model for future expansion but are not measured by this bank.

## Selection

1. Process grammar, then vocabulary, then reading.
2. Start each skill at A2.
3. After two successive correct responses, target one level above the most recently answered item, capped at B2.
4. After an incorrect response, target one level below that item, floored at A1, and reset the correct-answer streak.
5. Choose an unanswered item at the target level. If exhausted, choose the nearest remaining difficulty in stable bank order.
6. End a skill after six distinct answers; end the session after all three skills.

This is a transparent branching heuristic. It does not estimate an item-response-theory ability parameter. Fixed skill order may create fatigue effects. Items and answer keys are shipped to the browser because this is a low-stakes local learning check; it is unsuitable for secure certification.

## Scoring

- Ignore unknown IDs, out-of-range choices, and repeated answers. The first valid response to an item counts.
- Report raw correct/attempted counts per skill.
- At least four distinct answers are required before naming a skill level.
- A level needs at least two distinct attempted items at that level, both correct.
- A wrong answer at any lower attempted level prevents claiming that higher level.
- Choose the highest supported level under those rules. If none is supported, report insufficient evidence; do not automatically assign A1 to a learner who misses every question.
- The combined **recognition-only** estimate is the lowest supported level across grammar, vocabulary, and reading, and requires a supported level in each. It is not an overall six-skill CEFR level.
- Evidence is labeled unassessed (zero answers), limited (one to three), or preliminary (at least four). These are evidence-count categories, not calibrated confidence probabilities.

The rule can be conservative and discontinuous. A single contradictory lower-level answer can cap an estimate. Reassessment, productive samples, and richer evidence are recommended rather than inventing precision. Partial saved sessions resume; result screens require completion. Starting a fresh check explicitly replaces prior local answers. Assessment history is not retained in this iteration.

## Coverage and feedback

Grammar/vocabulary recognition and short reading comprehension are checked. Listening, writing, and speaking show **Not assessed**. No productive competence or pronunciation score is inferred. Strengths use supported skill levels; priorities use objectives associated with incorrect answers. Draft item explanations are retained for review tooling but are not shown during the test.

Learning XP, streaks, activity charts, and daily goal progress never alter assessment levels. No percentage is represented as a CEFR certification probability.

## Future validation

Independent educator review; a larger bank; passage readability and descriptor review; item performance/pilot data; accessibility accommodations; test-retest analysis; richer skill coverage; structured writing/speaking rubrics with recorded evidence and human review; then calibration if sufficient validated data exists.
