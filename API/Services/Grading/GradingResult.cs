namespace API.Services.Grading;

public record DomainResult(string Domain, int Correct, int Total, double Weight);

public record GradingResult(
    int ScaledScore,
    bool Passed,
    int CorrectCount,
    int TotalQuestions,
    List<DomainResult> DomainBreakdown
);
