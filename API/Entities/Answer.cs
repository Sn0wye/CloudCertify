using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

[Table("Answer")]
public class Answer
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    
    public int QuestionId { get; set; }
    
    public string Text { get; set; }
    
    public bool IsCorrect { get; set; }
    
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    
    public virtual Question Question { get; set; } 
}