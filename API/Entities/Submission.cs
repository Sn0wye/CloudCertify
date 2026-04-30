using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Submission")]
public class Submission
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    
    public int QuizId { get; set; }
    
    public bool Finished { get; set; }
    
    public int Score { get; set; }
    
    public string Email { get; set; }
    
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}