namespace API.Dto;

public class SubquizDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Domain { get; set; }
    public string Slug { get; set; }
    public int SubmissionId { get; set; }
    public DateTime CreatedAt { get; init; }
    public ICollection<QuestionDto> Questions { get; set; }
}
