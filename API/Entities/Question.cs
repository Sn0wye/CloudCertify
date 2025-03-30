using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

[Table("Question")]
public class Question
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    
    public int QuizId { get; set; }
    
    public string Text { get; set; }
    
    public QuestionType Type { get; set; }
    
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    
    public virtual ICollection<Answer> Answers { get; set; }
    public virtual Quiz Quiz { get; set; }
}

public enum QuestionType
{
    MultipleChoice,
    TrueFalse,
}