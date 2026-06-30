using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Submission")]
public class Submission
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    
    public int QuizId { get; set; }

    public int? SubquizId { get; set; }
    
    public bool Finished { get; set; }

    /// <summary>
    /// Question IDs served to the client at StartQuiz/StartSubquiz time. Grading runs
    /// against this fixed set so skipped questions count as wrong and the denominator is
    /// stable regardless of what the client submits. See docs/adr/0001-server-authoritative-attempts.md.
    /// </summary>
    public List<int> ServedQuestionIds { get; set; } = new();

    /// <summary>
    /// Per-Question answers committed via Check, in order. Immutable once written: a
    /// Question already present here cannot be re-Checked. Empty for full-Quiz attempts,
    /// which batch-grade from the submit body. See docs/adr/0002-incremental-subquiz-feedback.md.
    /// </summary>
    public List<RecordedAnswer> RecordedAnswers { get; set; } = new();

    public int Score { get; set; }
    
    public string Email { get; set; }
    
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}