# 0001 — Server-authoritative exam attempts

- Status: Accepted
- Date: 2026-06-16
- Issue: #11

## Context

At `StartQuiz`/`StartSubquiz` the API serves a randomized subset of questions but did
not persist which questions it served. At submit time, grading fetched questions by the
IDs the **client** sent back (`answers.Select(a => a.QuestionId)`).

That made the attempt client-trusted:

- `TotalQuestions` equaled the number of questions answered, not the number asked.
- A skipped question silently disappeared from the denominator instead of counting as wrong.
- A client could inflate its score by omitting questions it was unsure about.
- Scores were not comparable between attempts of the same quiz.

For a V0 whose purpose is demand validation, the attempt result must still be trustworthy.

## Decision

The attempt is **server-authoritative**:

1. `Submission` persists `ServedQuestionIds` — the exact set of question IDs served at
   start (new `integer[]` column, migration `AddSubmissionServedQuestionIds`).
2. Grading runs against that persisted set, fetched via
   `GetQuestionsByIds(submission.ServedQuestionIds)`, **not** the IDs the client echoes back.
3. A served question with no submitted answer yields an empty selection, which the grading
   strategies already treat as incorrect — so skipped questions count as wrong.
4. `TotalQuestions` therefore reflects the served count and is stable regardless of how
   many questions the client answers.
5. Applies to both full Quiz (`QuizService`) and Subquiz (`SubquizService`) attempts.

## Trade-off vs client-trusted grading

Client-trusted grading is simpler — no extra column, no need to load the served set at
submit time, and the start endpoint does not have to compute the question set before
creating the submission. We reject it because it lets the client control its own
denominator: omitting answers raises the score and breaks comparability between attempts.
The cost of server-authoritative grading (one `integer[]` column plus a reordering of
`StartQuiz`/`StartSubquiz` so questions are chosen before the submission is created) is
small and paid once.

A future reader could be tempted to "simplify" back to grading by client-submitted IDs.
Do not — that reintroduces every bug above. This ADR exists to record why.
