using API.Entities;

namespace API.Repositories;

/// <summary>Persistence for <see cref="Quiz"/> aggregates. Lets services be unit-tested against a mock.</summary>
public interface IQuizRepository
{
    Task Create(Quiz quiz);
    Task CreateMany(List<Quiz> quizzes);
    Task<Quiz?> GetQuizById(int quizId);
    Task<List<Quiz>> GetQuizzes();
}
