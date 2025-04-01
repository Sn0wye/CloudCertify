using API.Entities;

namespace API.Dto;

public class QuizDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public ICollection<Question> Questions { get; set; }
}