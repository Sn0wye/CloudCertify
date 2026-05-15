namespace API.Dto;

public class SubquizDto
{
    public required int Id { get; set; }
    public required string Title { get; set; }
    public required string Domain { get; set; }
    public required string Slug { get; set; }
    public required bool IsAvailable { get; set; }
}
