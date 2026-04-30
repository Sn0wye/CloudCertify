namespace API.Model.Request;

public class SubmitQuizRequestDto
{
    public int SubmissionId { get; set; }
    public List<QuizAnswer> Answers { get; set; }
}
public class QuizAnswer
{
    public int QuestionId { get; set; }
    public int AnswerId { get; set; }
}