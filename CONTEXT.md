# CloudCertify

Adaptive certification learning system. V0 ships a functional cloud-exam
simulator (CLF-C02) and is collecting behavioral data to justify later
adaptive-learning work.

## Language

**Quiz**:
A full certification exam definition (e.g. CLF-C02). Owns its questions,
domain weights, and grading rules. A Quiz is the exam, not a single attempt.
_Avoid_: Exam, Test, Simulation

**Subquiz**:
A focused, single-Domain practice drill carved out of a parent Quiz's
questions. Scored as a simple 0-100 percentage (pass ≥ 70), distinct from a
full Quiz attempt's scaled score.
_Avoid_: Mini-quiz, Practice test, Section

**Submission**:
One attempt at a Quiz or Subquiz by an email-identified visitor. Holds the
score and finished state. There is no User entity; a Submission is the only
record of who did what.
_Avoid_: Attempt, Session, Result, Try

**Domain**:
An exam content area defined by the certification body (e.g. "Security and
Compliance"). Carries an official Weight in a full Quiz's grade and is the
unit a Subquiz is scoped to.
_Avoid_: Topic, Category, Section, Area

**Scaled Score**:
A full Quiz result expressed on AWS's 100-1000 scale (pass ≥ 700), computed
from Domain-weighted correctness. Applies to a full Quiz only — never to a
Subquiz.
_Avoid_: Score, Grade, Points

**Grading Strategy**:
The per-Quiz rule for turning answered Questions into a result. CLF-C02 uses
Domain-weighted scaled scoring; a Subquiz uses flat percentage; everything
else uses a default percentage-on-the-1000-scale fallback.
_Avoid_: Scorer, Grader, Marker
