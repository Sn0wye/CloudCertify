using API.Entities;
using API.External;
using API.Repositories;

namespace API.Tests.Services;

public class QuizCatalogSeederTests
{
    private readonly InMemoryQuizRepository _quizzes = new();
    private readonly InMemorySubquizRepository _subquizzes = new();

    private QuizCatalogSeeder CreateSeeder() => new(_quizzes, _subquizzes);

    [Fact]
    public async Task SeedCatalog_PopulatesParentQuizzesAndSubquizzes_OnFreshDatabase()
    {
        await CreateSeeder().SeedCatalog();

        Assert.Equal(11, _quizzes.Store.Count);
        Assert.Equal(4, _subquizzes.Store.Count);
        Assert.Contains(_quizzes.Store, q => q.Slug == "CLF-C02");
    }

    [Fact]
    public async Task SeedCatalog_ResolvesParentId_ForSubquizzes()
    {
        await CreateSeeder().SeedCatalog();

        var parent = _quizzes.Store.Single(q => q.Slug == "CLF-C02");
        Assert.All(_subquizzes.Store, sub => Assert.Equal(parent.Id, sub.QuizId));
    }

    [Fact]
    public async Task SeedCatalog_IsIdempotent_SecondBootCreatesNothing()
    {
        var seeder = CreateSeeder();
        await seeder.SeedCatalog();

        await seeder.SeedCatalog();

        // Repeat boot skips already-seeded quizzes: no extra rows, no second write.
        Assert.Equal(11, _quizzes.Store.Count);
        Assert.Equal(4, _subquizzes.Store.Count);
        Assert.Equal(1, _quizzes.CreateManyCalls);
        Assert.Equal(1, _subquizzes.CreateManyCalls);
    }
}

/// <summary>In-memory <see cref="IQuizRepository"/> that assigns identities like the database would.</summary>
internal class InMemoryQuizRepository : IQuizRepository
{
    public List<Quiz> Store { get; } = new();
    public int CreateManyCalls { get; private set; }
    private int _nextId = 1;

    public Task CreateMany(List<Quiz> quizzes)
    {
        CreateManyCalls++;
        foreach (var quiz in quizzes)
        {
            Store.Add(new Quiz
            {
                Id = _nextId++,
                Title = quiz.Title,
                Description = quiz.Description,
                IconName = quiz.IconName,
                IsAvailable = quiz.IsAvailable,
                QuizProvider = quiz.QuizProvider,
                QuizLevel = quiz.QuizLevel,
                Slug = quiz.Slug,
                Questions = quiz.Questions
            });
        }
        return Task.CompletedTask;
    }

    public Task<List<Quiz>> GetQuizzes() => Task.FromResult(Store.ToList());
    public Task Create(Quiz quiz) => throw new NotSupportedException();
    public Task<Quiz?> GetQuizById(int quizId) => throw new NotSupportedException();
}

/// <summary>In-memory <see cref="ISubquizRepository"/> capturing what the seeder persists.</summary>
internal class InMemorySubquizRepository : ISubquizRepository
{
    public List<Subquiz> Store { get; } = new();
    public int CreateManyCalls { get; private set; }

    public Task CreateMany(List<Subquiz> subquizzes)
    {
        CreateManyCalls++;
        Store.AddRange(subquizzes);
        return Task.CompletedTask;
    }

    public Task<List<Subquiz>> GetAllSubquizzes() => Task.FromResult(Store.ToList());
    public Task Create(Subquiz subquiz) => throw new NotSupportedException();
    public Task<Subquiz?> GetSubquizById(int subquizId) => throw new NotSupportedException();
    public Task<List<Subquiz>> GetSubquizzesByQuizId(int quizId) => throw new NotSupportedException();
}
