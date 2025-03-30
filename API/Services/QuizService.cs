using API.Models;
using API.Repositories;

namespace API.Services;

public class QuizService
{
    public QuizService(QuizRepository quizRepository)
    {
        _quizRepository = quizRepository;
    }
        
    private readonly QuizRepository _quizRepository;
    
    public async Task<IEnumerable<Quiz>> GetQuizzes()
    {
        return await _quizRepository.GetQuizzes();
    }
    
    public async Task<Quiz?> GetQuizById(int quizId)
    {
        return await _quizRepository.GetQuizById(quizId);
    }
    
    public async Task CreateQuiz(Quiz quiz)
    {
        await _quizRepository.Create(quiz);
    }
}