using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Entities;

[Table("Answer")]
public class Answer
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    
    public int QuestionId { get; set; }
    
    public string Text { get; set; }
    
    public bool IsCorrect { get; set; }
    
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    
    [JsonIgnore]
    public virtual Question Question { get; set; } 
}