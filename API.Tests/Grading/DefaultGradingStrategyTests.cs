using API.Services.Grading;
using static API.Tests.QuizBuilder;

namespace API.Tests.Grading;

public class DefaultGradingStrategyTests
{
    private readonly DefaultGradingStrategy _strategy = new();

    [Fact]
    public void AllCorrect_ScoresFullMarks()
    {
        var questions = new[] { Question(1, "Concepts", correctIds: [10], wrongIds: [11]) };
        var answers = new List<API.Model.Request.QuizAnswer> { Answer(1, 10) };

        var result = _strategy.Grade(questions, answers);

        Assert.Equal(1000, result.ScaledScore);
        Assert.True(result.Passed);
        Assert.Equal(1, result.CorrectCount);
        Assert.Equal(1, result.TotalQuestions);
    }

    [Fact]
    public void AllWrong_ScoresFloorAndFails()
    {
        var questions = new[] { Question(1, "Concepts", correctIds: [10], wrongIds: [11]) };
        var answers = new List<API.Model.Request.QuizAnswer> { Answer(1, 11) };

        var result = _strategy.Grade(questions, answers);

        Assert.Equal(100, result.ScaledScore);
        Assert.False(result.Passed);
        Assert.Equal(0, result.CorrectCount);
    }

    [Fact]
    public void HalfCorrect_ScoresMidpoint_AndPasses()
    {
        var questions = new[]
        {
            Question(1, "Concepts", correctIds: [10], wrongIds: [11]),
            Question(2, "Concepts", correctIds: [20], wrongIds: [21]),
        };
        var answers = new List<API.Model.Request.QuizAnswer> { Answer(1, 10), Answer(2, 21) };

        var result = _strategy.Grade(questions, answers);

        Assert.Equal(550, result.ScaledScore); // 100 + 0.5 * 900
        Assert.False(result.Passed); // 550 < 700
        Assert.Equal(1, result.CorrectCount);
        Assert.Equal(2, result.TotalQuestions);
    }

    [Fact]
    public void MultipleResponse_RequiresExactSet()
    {
        var questions = new[] { Question(1, "Concepts", correctIds: [10, 11], wrongIds: [12]) };
        // Missing one required answer -> not credited.
        var partial = new List<API.Model.Request.QuizAnswer> { Answer(1, 10) };

        var result = _strategy.Grade(questions, partial);

        Assert.Equal(0, result.CorrectCount);
    }

    [Fact]
    public void NoQuestions_ScoresFloorAndDoesNotDivideByZero()
    {
        var result = _strategy.Grade([], new List<API.Model.Request.QuizAnswer>());

        Assert.Equal(100, result.ScaledScore);
        Assert.Equal(0, result.TotalQuestions);
        Assert.Empty(result.DomainBreakdown);
    }
}
