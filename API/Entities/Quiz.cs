using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Quiz")]
public class Quiz
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    
    public string Title { get; set; }
    
    public string Description { get; set; }
    
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    
    public virtual ICollection<Question> Questions { get; set; }
}