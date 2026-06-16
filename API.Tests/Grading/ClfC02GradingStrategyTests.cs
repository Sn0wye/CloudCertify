using API.Model.Request;
using API.Services.Grading;
using static API.Tests.QuizBuilder;

namespace API.Tests.Grading;

public class ClfC02GradingStrategyTests
{
    private readonly ClfC02GradingStrategy _strategy = new();

    [Fact]
    public void EveryDomainPerfect_Scores1000()
    {
        var questions = new[]
        {
            Question(1, "Cloud Concepts", correctIds: [10], wrongIds: [11]),
            Question(2, "Security and Compliance", correctIds: [20], wrongIds: [21]),
            Question(3, "Cloud Technology and Services", correctIds: [30], wrongIds: [31]),
            Question(4, "Billing, Pricing, and Support", correctIds: [40], wrongIds: [41]),
        };
        var answers = new List<QuizAnswer> { Answer(1, 10), Answer(2, 20), Answer(3, 30), Answer(4, 40) };

        var result = _strategy.Grade(questions, answers);

        Assert.Equal(1000, result.ScaledScore); // weights sum to 1.0
        Assert.True(result.Passed);
        Assert.Equal(4, result.CorrectCount);
        Assert.Equal(4, result.DomainBreakdown.Count);
    }

    [Fact]
    public void ScoreFollowsDomainWeight_NotRawPercentage()
    {
        // 100% correct, but only the lowest-weight domain (0.12) is represented.
        var questions = new[] { Question(1, "Billing, Pricing, and Support", correctIds: [10], wrongIds: [11]) };
        var answers = new List<QuizAnswer> { Answer(1, 10) };

        var result = _strategy.Grade(questions, answers);

        Assert.Equal(208, result.ScaledScore); // 100 + 0.12 * 900
        Assert.False(result.Passed);
    }

    [Fact]
    public void UnknownDomain_DoesNotContributeToWeightedScore()
    {
        var questions = new[] { Question(1, "Mystery", correctIds: [10], wrongIds: [11]) };
        var answers = new List<QuizAnswer> { Answer(1, 10) };

        var result = _strategy.Grade(questions, answers);

        Assert.Equal(100, result.ScaledScore); // unweighted -> no contribution
        Assert.Equal(1, result.CorrectCount); // still counted in the raw tally
        Assert.Empty(result.DomainBreakdown); // breakdown only lists known domains
    }

    [Fact]
    public void DomainBreakdown_ReportsPerDomainTally()
    {
        var questions = new[]
        {
            Question(1, "Security and Compliance", correctIds: [10], wrongIds: [11]),
            Question(2, "Security and Compliance", correctIds: [20], wrongIds: [21]),
        };
        var answers = new List<QuizAnswer> { Answer(1, 10), Answer(2, 21) };

        var result = _strategy.Grade(questions, answers);

        var security = Assert.Single(result.DomainBreakdown);
        Assert.Equal("Security and Compliance", security.Domain);
        Assert.Equal(1, security.Correct);
        Assert.Equal(2, security.Total);
        Assert.Equal(0.30, security.Weight);
    }
}
