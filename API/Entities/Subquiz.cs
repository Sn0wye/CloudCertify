using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Subquiz")]
public class Subquiz
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }

    public int QuizId { get; set; }

    public string Title { get; set; }

    public string Domain { get; set; }

    public string Slug { get; set; }

    public bool IsAvailable { get; set; } = false;

    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;

    public virtual Quiz Quiz { get; set; }
}
