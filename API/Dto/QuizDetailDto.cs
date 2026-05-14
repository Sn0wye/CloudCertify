namespace API.Dto;

public class QuizDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int SubmissionId { get; set; }
    public DateTime CreatedAt { get; init; }
    public ICollection<QuestionDto> Questions { get; set; }
}