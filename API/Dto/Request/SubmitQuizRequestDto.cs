namespace API.Model.Request;

public class SubmitQuizRequestDto
{
    public List<QuizAnswer> Answers { get; set; }
}
public class QuizAnswer
{
    public int QuestionId { get; set; }
    public int AnswerId { get; set; }
}