using API.Dto;
using API.Entities;
using API.Model.Request;
using API.Repositories;

namespace API.Services;

public class QuizService
{
    public QuizService(QuizRepository quizRepository, QuestionRepository questionRepository)
    {
        _quizRepository = quizRepository;
        _questionRepository = questionRepository;
    }
        
    private readonly QuizRepository _quizRepository;
    private readonly QuestionRepository _questionRepository;
    
    public async Task<IEnumerable<QuizDto>> GetQuizzes()
    {
        var quizzes = await _quizRepository.GetQuizzes();
        return quizzes.Select(q => new QuizDto
        {
            Id = q.Id,
            Title = q.Title,
            Description = q.Description
        });
    }
    
    public async Task<QuizDetailDto?> GetQuizById(int quizId)
    {
        var quiz = await _quizRepository.GetQuizById(quizId);
        
        if (quiz == null)
        {
            return null;
        }

        return new QuizDetailDto
        {
            Id = quiz.Id,
            Title = quiz.Title,
            Description = quiz.Description,
            CreatedAt = quiz.CreatedAt,
            Questions = quiz.Questions
        };
    }
    
    public async Task<QuizDetailDto?> StartQuiz(int quizId)
    {
        var quiz = await _quizRepository.GetQuizById(quizId);
        
        if (quiz == null)
        {
            return null;
        }
        
        // get random 65 questions
        var randomQuestions = quiz.Questions.OrderBy(q => Guid.NewGuid()).Take(1).ToList();

        return new QuizDetailDto
        {
            Id = quiz.Id,
            Title = quiz.Title,
            Description = quiz.Description,
            CreatedAt = quiz.CreatedAt,
            Questions = randomQuestions
        };
    }

    public async Task<int> SubmitQuiz(int quizId, List<QuizAnswer> answers)
    {
        var questions = await _questionRepository.GetQuestionsByIds(answers.Select(a => a.QuestionId).ToList());
        int score = 0;

        foreach (var question in questions)
        {
            var userAnswers = answers.Where(a => a.QuestionId == question.Id).Select(a => a.AnswerId).ToList();
            var correctAnswers = question.Answers.Where(a => a.IsCorrect).Select(a => a.Id).ToList();
            
            if (userAnswers.Count == correctAnswers.Count && !userAnswers.Except(correctAnswers).Any())
            {
                score++;
            }
        }
        
        return score;
    }
    
    public async Task CreateQuiz(Quiz quiz)
    {
        await _quizRepository.Create(quiz);
    }
}