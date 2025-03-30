using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Models;

[Table("Quiz")]
public class Quiz
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    
    public string Title { get; set; }
    
    public string Description { get; set; }
    
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    
    [JsonIgnore]
    public virtual ICollection<Question> Questions { get; set; }
}