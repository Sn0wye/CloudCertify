using API.Dto;
using API.Entities;
using API.Model.Request;
using API.Model.Response;
using API.Repositories;

namespace API.Services;

public class QuizService
{
    public QuizService(QuizRepository quizRepository, QuestionRepository questionRepository, SubmissionRepository submissionRepository)
    {
        _quizRepository = quizRepository;
        _questionRepository = questionRepository;
        _submissionRepository = submissionRepository;
    }
        
    private readonly QuizRepository _quizRepository;
    private readonly QuestionRepository _questionRepository;
    private readonly SubmissionRepository _submissionRepository;
    
    public async Task<IEnumerable<QuizDto>> GetQuizzes()
    {
        var quizzes = await _quizRepository.GetQuizzes();
        return quizzes.Select(q => new QuizDto
        {
            Id = q.Id,
            Title = q.Title,
            Description = q.Description,
            IconName = q.IconName,
            IsAvailable = q.IsAvailable,
            QuizProvider = q.QuizProvider,
            QuizLevel = q.QuizLevel,
            CreatedAt = q.CreatedAt,
            QuestionCount = q.Questions?.Count ?? 0
        });
    }
    
    public async Task<QuizDto?> GetQuizById(int quizId)
    {
        var quiz = await _quizRepository.GetQuizById(quizId);
        
        if (quiz == null)
        {
            return null;
        }

        return new QuizDto
        {
            Id = quiz.Id,
            Title = quiz.Title,
            Description = quiz.Description,
            IconName = quiz.IconName,
            IsAvailable = quiz.IsAvailable,
            QuizProvider = quiz.QuizProvider,
            QuizLevel = quiz.QuizLevel,
            CreatedAt = quiz.CreatedAt,
            QuestionCount = quiz.Questions?.Count ?? 0
        };
    }
    
    public async Task<QuizDetailDto?> StartQuiz(int quizId, string email)
    {
        var quiz = await _quizRepository.GetQuizById(quizId);
        
        if (quiz == null)
        {
            return null;
        }

        if (!quiz.IsAvailable)
        {
            throw new InvalidOperationException("Quiz is not available");
        }

        var submission = new Submission
        {
            Email = email,
            QuizId = quizId,
            Finished = false,
        };

        await _submissionRepository.Create(submission);
        
         // get random 65 questions (5 for testing)
         var randomQuestions = quiz.Questions?.OrderBy(q => Guid.NewGuid()).Take(5).ToList() ?? new List<Question>();

         return new QuizDetailDto
         {
             Id = quiz.Id,
             Title = quiz.Title,
             Description = quiz.Description,
             CreatedAt = quiz.CreatedAt,
             SubmissionId = submission.Id,
             Questions = randomQuestions.Select(q => new QuestionDto
             {
                 Id = q.Id,
                 Text = q.Text,
                 Images = q.Images,
                 Type = q.Type,
                 SelectCount = q.SelectCount,
                  Answers = q.Answers.Select(a => MapAnswerToDto(a)).ToList()
             }).ToList()
         };
    }

    public async Task<SubmitQuizResponseDto> SubmitQuiz(int quizId, int submissionId, List<QuizAnswer> answers)
    {
        var submission = await _submissionRepository.GetById(submissionId);
        
        if (submission == null)
        {
            throw new InvalidOperationException("Submission not found");
        }
        
        var questions = await _questionRepository.GetQuestionsByIds(answers.Select(a => a.QuestionId).ToList());
        int correctCount = 0;
        var resultQuestions = new List<QuizResultQuestionDto>();

        foreach (var question in questions)
        {
            var userAnswerIds = answers.Where(a => a.QuestionId == question.Id).Select(a => a.AnswerId).ToList();
            var correctAnswerIds = question.Answers.Where(a => a.IsCorrect).Select(a => a.Id).ToList();
            
            if (userAnswerIds.Count == correctAnswerIds.Count && !userAnswerIds.Except(correctAnswerIds).Any())
            {
                correctCount++;
            }

             resultQuestions.Add(new QuizResultQuestionDto
             {
                 Id = question.Id,
                 Text = question.Text,
                 Type = question.Type,
                 Domain = question.Domain,
                 Concepts = question.Concepts,
                 ServiceCategory = question.ServiceCategory,
                 Services = question.Services,
                 Explanation = question.Explanation,
                  Answers = question.Answers.Select(a => MapAnswerToResultDto(a, userAnswerIds.Contains(a.Id))).ToList()
             });
        }

        int totalQuestions = questions.Count();
        
        submission.Score = correctCount;
        submission.Finished = true;
        await _submissionRepository.Update(submission);
        
        return new SubmitQuizResponseDto
        {
            Score = correctCount,
            TotalQuestions = totalQuestions,
            CorrectCount = correctCount,
            Questions = resultQuestions
        };
    }
    
     public async Task CreateQuiz(Quiz quiz)
     {
         await _quizRepository.Create(quiz);
     }
     
     private static AnswerDto MapAnswerToDto(Answer answer)
     {
         return new AnswerDto
         {
             Id = answer.Id,
             Text = answer.Text,
             Image = answer.Image,
         };
     }
     
     private static QuizResultAnswerDto MapAnswerToResultDto(Answer answer, bool wasSelected)
     {
         return new QuizResultAnswerDto
         {
             Id = answer.Id,
             Text = answer.Text,
             Image = answer.Image,
             IsCorrect = answer.IsCorrect,
             WasSelected = wasSelected,
         };
     }
 }