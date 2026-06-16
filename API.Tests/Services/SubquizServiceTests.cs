using API.Entities;
using API.Model.Request;
using API.Repositories;
using API.Services;
using Moq;
using static API.Tests.QuizBuilder;

namespace API.Tests.Services;

public class SubquizServiceTests
{
    private readonly Mock<ISubquizRepository> _subquizzes = new();
    private readonly Mock<IQuestionRepository> _questions = new();
    private readonly Mock<ISubmissionRepository> _submissions = new();

    private SubquizService CreateService() =>
        new(_subquizzes.Object, _questions.Object, _submissions.Object);

    [Fact]
    public async Task StartSubquiz_ReturnsNull_WhenSubquizMissing()
    {
        _subquizzes.Setup(r => r.GetSubquizById(It.IsAny<int>())).ReturnsAsync((Subquiz?)null);

        var result = await CreateService().StartSubquiz(1, 2, "u@e.com");

        Assert.Null(result);
        _submissions.Verify(r => r.Create(It.IsAny<Submission>()), Times.Never);
    }

    [Fact]
    public async Task StartSubquiz_ReturnsNull_WhenSubquizBelongsToDifferentQuiz()
    {
        _subquizzes.Setup(r => r.GetSubquizById(2))
            .ReturnsAsync(new Subquiz { Id = 2, QuizId = 99, IsAvailable = true });

        var result = await CreateService().StartSubquiz(1, 2, "u@e.com");

        Assert.Null(result);
    }

    [Fact]
    public async Task StartSubquiz_Throws_WhenUnavailable()
    {
        _subquizzes.Setup(r => r.GetSubquizById(2))
            .ReturnsAsync(new Subquiz { Id = 2, QuizId = 1, IsAvailable = false });

        var service = CreateService();

        await Assert.ThrowsAsync<InvalidOperationException>(() => service.StartSubquiz(1, 2, "u@e.com"));
    }

    [Fact]
    public async Task StartSubquiz_CreatesSubmission_AndReturnsOnlyMatchingDomainQuestions()
    {
        _subquizzes.Setup(r => r.GetSubquizById(2)).ReturnsAsync(new Subquiz
        {
            Id = 2, QuizId = 1, Title = "Security", Domain = "Security and Compliance",
            Slug = "sec", IsAvailable = true
        });
        var inDomain = Question(10, "Security and Compliance", correctIds: [1], wrongIds: [2]);
        var otherDomain = Question(11, "Cloud Concepts", correctIds: [3], wrongIds: [4]);
        _questions.Setup(r => r.GetQuestionsByQuizId(1))
            .ReturnsAsync(new List<Question> { inDomain, otherDomain });

        var result = await CreateService().StartSubquiz(1, 2, "u@e.com");

        Assert.NotNull(result);
        var question = Assert.Single(result!.Questions);
        Assert.Equal(10, question.Id); // only the matching-domain question is included
        _submissions.Verify(r => r.Create(It.Is<Submission>(s =>
            s.QuizId == 1 && s.SubquizId == 2 && s.Email == "u@e.com")), Times.Once);
    }

    [Fact]
    public async Task SubmitSubquiz_Throws_WhenSubmissionDoesNotMatch()
    {
        _submissions.Setup(r => r.GetById(5))
            .ReturnsAsync(new Submission { Id = 5, QuizId = 99, SubquizId = 2 });

        var service = CreateService();

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.SubmitSubquiz(1, 2, 5, new List<QuizAnswer>()));
    }

    [Fact]
    public async Task SubmitSubquiz_Throws_WhenAlreadyFinished()
    {
        _submissions.Setup(r => r.GetById(5))
            .ReturnsAsync(new Submission { Id = 5, QuizId = 1, SubquizId = 2, Finished = true });

        var service = CreateService();

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.SubmitSubquiz(1, 2, 5, new List<QuizAnswer>()));
    }

    [Fact]
    public async Task SubmitSubquiz_GradesScoresAndPersistsFinishedSubmission()
    {
        var submission = new Submission { Id = 5, QuizId = 1, SubquizId = 2, Finished = false, Email = "u@e.com" };
        _submissions.Setup(r => r.GetById(5)).ReturnsAsync(submission);
        _subquizzes.Setup(r => r.GetSubquizById(2)).ReturnsAsync(new Subquiz { Id = 2, QuizId = 1, Domain = "D" });
        var question = Question(10, "D", correctIds: [1], wrongIds: [2]);
        _questions.Setup(r => r.GetQuestionsByIds(It.IsAny<List<int>>()))
            .ReturnsAsync(new List<Question> { question });

        var answers = new List<QuizAnswer> { Answer(10, 1) }; // fully correct

        var response = await CreateService().SubmitSubquiz(1, 2, 5, answers);

        Assert.Equal(1000, response.ScaledScore); // SUBQUIZ slug -> default strategy
        Assert.True(submission.Finished);
        Assert.Equal(1000, submission.Score);
        _submissions.Verify(r => r.Update(It.Is<Submission>(s => s.Finished && s.Score == 1000)), Times.Once);
    }
}
