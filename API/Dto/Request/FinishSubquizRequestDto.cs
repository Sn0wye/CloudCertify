namespace API.Model.Request;

/// <summary>Finishes a Subquiz attempt: grades the accumulated Recorded Answers for this Submission.</summary>
public class FinishSubquizRequestDto
{
    public int SubmissionId { get; set; }
}
