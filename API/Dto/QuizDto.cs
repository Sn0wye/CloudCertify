namespace API.Dto;

public class QuizDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}