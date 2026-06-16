using API.Entities;
using API.Model.Request;
using API.Repositories;
using API.Services;
using Moq;
using static API.Tests.QuizBuilder;

namespace API.Tests.Services;

public class QuizServiceTests
{
    private readonly Mock<IQuizRepository> _quizzes = new();
    private readonly Mock<IQuestionRepository> _questions = new();
    private readonly Mock<ISubmissionRepository> _submissions = new();

    private QuizService CreateService() =>
        new(_quizzes.Object, _questions.Object, _submissions.Object);

    [Fact]
    public async Task GetQuizById_ReturnsNull_WhenQuizMissing()
    {
        _quizzes.Setup(r => r.GetQuizById(99)).ReturnsAsync((Quiz?)null);

        var result = await CreateService().GetQuizById(99);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetQuizById_MapsQuizToDto_WhenFound()
    {
        var quiz = new Quiz { Id = 7, Title = "AWS CLF-C02", Slug = "CLF-C02", IsAvailable = true };
        _quizzes.Setup(r => r.GetQuizById(7)).ReturnsAsync(quiz);

        var result = await CreateService().GetQuizById(7);

        Assert.NotNull(result);
        Assert.Equal(7, result!.Id);
        Assert.Equal("AWS CLF-C02", result.Title);
        Assert.Equal("CLF-C02", result.Slug);
    }

    [Fact]
    public async Task StartQuiz_ReturnsNull_WhenQuizMissing()
    {
        _quizzes.Setup(r => r.GetQuizById(It.IsAny<int>())).ReturnsAsync((Quiz?)null);

        var result = await CreateService().StartQuiz(1, "user@example.com");

        Assert.Null(result);
        _submissions.Verify(r => r.Create(It.IsAny<Submission>()), Times.Never);
    }

    [Fact]
    public async Task StartQuiz_Throws_WhenQuizUnavailable()
    {
        var quiz = new Quiz { Id = 1, IsAvailable = false };
        _quizzes.Setup(r => r.GetQuizById(1)).ReturnsAsync(quiz);

        var service = CreateService();

        await Assert.ThrowsAsync<InvalidOperationException>(() => service.StartQuiz(1, "user@example.com"));
        _submissions.Verify(r => r.Create(It.IsAny<Submission>()), Times.Never);
    }

    [Fact]
    public async Task StartQuiz_CreatesSubmission_AndReturnsDetail_WhenAvailable()
    {
        var quiz = new Quiz
        {
            Id = 1, Title = "Quiz", Slug = "q", IsAvailable = true,
            Questions = new List<Question> { Question(100, "D", correctIds: [1], wrongIds: [2]) }
        };
        _quizzes.Setup(r => r.GetQuizById(1)).ReturnsAsync(quiz);

        var result = await CreateService().StartQuiz(1, "user@example.com");

        Assert.NotNull(result);
        _submissions.Verify(r => r.Create(It.Is<Submission>(s =>
            s.QuizId == 1 && s.Email == "user@example.com" && !s.Finished)), Times.Once);
    }

    [Fact]
    public async Task SubmitQuiz_Throws_WhenSubmissionMissing()
    {
        _submissions.Setup(r => r.GetById(5)).ReturnsAsync((Submission?)null);

        var service = CreateService();

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.SubmitQuiz(1, 5, new List<QuizAnswer>()));
    }

    [Fact]
    public async Task SubmitQuiz_Throws_WhenQuizMissing()
    {
        _submissions.Setup(r => r.GetById(5)).ReturnsAsync(new Submission { Id = 5, QuizId = 1, Email = "u@e.com" });
        _quizzes.Setup(r => r.GetQuizById(1)).ReturnsAsync((Quiz?)null);

        var service = CreateService();

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.SubmitQuiz(1, 5, new List<QuizAnswer>()));
    }

    [Fact]
    public async Task SubmitQuiz_GradesScoresAndPersistsFinishedSubmission()
    {
        var submission = new Submission { Id = 5, QuizId = 1, Email = "u@e.com", Finished = false };
        var quiz = new Quiz { Id = 1, Slug = "SAA-C03" }; // non-CLF -> default strategy
        var question = Question(100, "D", correctIds: [1], wrongIds: [2]);

        _submissions.Setup(r => r.GetById(5)).ReturnsAsync(submission);
        _quizzes.Setup(r => r.GetQuizById(1)).ReturnsAsync(quiz);
        _questions.Setup(r => r.GetQuestionsByIds(It.IsAny<List<int>>()))
            .ReturnsAsync(new List<Question> { question });

        var answers = new List<QuizAnswer> { Answer(100, 1) }; // fully correct

        var response = await CreateService().SubmitQuiz(1, 5, answers);

        Assert.Equal(1000, response.ScaledScore); // default strategy, 100% correct
        Assert.True(response.Passed);
        Assert.Equal(1, response.CorrectCount);
        Assert.True(submission.Finished);
        Assert.Equal(1000, submission.Score);
        _submissions.Verify(r => r.Update(It.Is<Submission>(s => s.Finished && s.Score == 1000)), Times.Once);
    }
}
