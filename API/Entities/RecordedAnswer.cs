using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

/// <summary>
/// One Question's selected answers committed to a Subquiz Submission at Check time.
/// Immutable once recorded; the set of Recorded Answers on a Submission is what a
/// Subquiz's final score is computed from at finish. See docs/adr/0002-incremental-subquiz-feedback.md.
/// </summary>
[Table("RecordedAnswer")]
public class RecordedAnswer
{
    public int SubmissionId { get; set; }

    public int QuestionId { get; set; }

    public List<int> SelectedAnswerIds { get; set; } = new();
}
