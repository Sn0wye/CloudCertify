using API.Entities;

namespace API.Repositories;

/// <summary>Read access to <see cref="Question"/> graphs used during quiz grading.</summary>
public interface IQuestionRepository
{
    Task<List<Question>> GetQuestionsByIds(List<int> ids);
    Task<List<Question>> GetQuestionsByQuizId(int quizId);
}
