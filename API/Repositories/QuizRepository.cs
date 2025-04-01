using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class QuizRepository(ApplicationDbContext context)
{
    public async Task Create(Quiz quiz)
    {
        await context.Quiz.AddAsync(quiz);
        await context.SaveChangesAsync();
    }
        
    public async Task<Quiz?> GetQuizById(int quizId)
    {
        return await context.Quiz
            .Include(q => q.Questions)
            .ThenInclude(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == quizId);
    }
    
    public async Task<List<Quiz>> GetQuizzes()
    {
        return await context.Quiz.ToListAsync();
    }
}