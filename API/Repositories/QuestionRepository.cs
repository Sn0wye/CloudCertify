using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class QuestionRepository(ApplicationDbContext context)
{
    public async Task<List<Question>> GetQuestionsByIds(List<int> ids)
    {
        return await context.Question.Where(q => ids.Contains(q.Id))
            .Include(q => q.Answers)
            .ToListAsync();
    }
}