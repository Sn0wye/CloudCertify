using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Quiz")]
public class Quiz
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    
    public string Title { get; set; }
    
    public string Description { get; set; }
    
    public string IconName { get; set; }

    public bool IsAvailable { get; set; } = false;
    
    public QuizProvider QuizProvider { get; set; }
    
    public QuizLevel QuizLevel { get; set; }

    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    
    public virtual ICollection<Question> Questions { get; set; }
}

public enum QuizLevel
{
    Foundational,
    Associate,
    Professional,
    Specialist
}

public enum QuizProvider
{
    Azure,
    AWS,
    GCP
}