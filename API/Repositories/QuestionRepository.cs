using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class QuestionRepository(ApplicationDbContext context) : IQuestionRepository
{
    public async Task<List<Question>> GetQuestionsByIds(List<int> ids)
    {
        return await context.Question.Where(q => ids.Contains(q.Id))
            .Include(q => q.Answers)
            .ToListAsync();
    }

    public async Task<List<Question>> GetQuestionsByQuizId(int quizId)
    {
        return await context.Question
            .Where(q => q.QuizId == quizId)
            .Include(q => q.Answers)
            .ToListAsync();
    }
}