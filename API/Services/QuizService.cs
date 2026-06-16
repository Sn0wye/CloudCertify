using API.Dto;
using API.Entities;
using API.Model.Request;
using API.Model.Response;
using API.Repositories;
using API.Services.Grading;

namespace API.Services;

public class QuizService
{
    public QuizService(IQuizRepository quizRepository, ISubmissionRepository submissionRepository, SubmissionGrader submissionGrader)
    {
        _quizRepository = quizRepository;
        _submissionRepository = submissionRepository;
        _submissionGrader = submissionGrader;
    }

    private readonly IQuizRepository _quizRepository;
    private readonly ISubmissionRepository _submissionRepository;
    private readonly SubmissionGrader _submissionGrader;
    
    public async Task<IEnumerable<QuizDto>> GetQuizzes()
    {
        var quizzes = await _quizRepository.GetQuizzes();
        return quizzes
            .Select(q => MapQuizToDto(q));
    }

    private static QuizDto MapQuizToDto(Quiz q)
    {
        return new QuizDto
        {
            Id = q.Id,
            Title = q.Title,
            Description = q.Description,
            IconName = q.IconName,
            IsAvailable = q.IsAvailable,
            QuizProvider = q.QuizProvider,
            QuizLevel = q.QuizLevel,
            Slug = q.Slug,
            CreatedAt = q.CreatedAt,
            QuestionCount = q.Questions?.Count ?? 0,
            SubQuizzes = q.SubQuizzes?.Select(sq => new SubquizDto
            {
                Id = sq.Id,
                Title = sq.Title,
                Domain = sq.Domain ?? "",
                Slug = sq.Slug,
                IsAvailable = sq.IsAvailable
            }).ToList()
        };
    }
    
    public async Task<QuizDto?> GetQuizById(int quizId)
    {
        var quiz = await _quizRepository.GetQuizById(quizId);
        
        if (quiz == null)
        {
            return null;
        }

        return MapQuizToDto(quiz);
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

          var randomQuestions = quiz.Questions?.OrderBy(q => Guid.NewGuid()).Take(65).ToList() ?? new List<Question>();

          var submission = new Submission
          {
              Email = email,
              QuizId = quizId,
              Finished = false,
              ServedQuestionIds = randomQuestions.Select(q => q.Id).ToList(),
          };

          await _submissionRepository.Create(submission);

           return new QuizDetailDto
           {
               Id = quiz.Id,
               Title = quiz.Title,
               Description = quiz.Description,
               Slug = quiz.Slug,
               CreatedAt = quiz.CreatedAt,
               SubmissionId = submission.Id,
               Questions = randomQuestions.Select(q => new QuestionDto
               {
                   Id = q.Id,
                   Text = q.Text,
                   Images = q.Images,
                   Type = q.Type,
                   SelectCount = q.SelectCount,
                    Answers = q.Answers.OrderBy(a => Guid.NewGuid()).Select(AnswerMapper.ToDto).ToList()
               }).ToList()
           };
      }

     public async Task<SubmitQuizResponseDto> SubmitQuiz(int quizId, int submissionId, List<QuizAnswer> answers)
     {
         var quiz = await _quizRepository.GetQuizById(quizId);
         if (quiz == null)
         {
             throw new InvalidOperationException($"Quiz {quizId} not found");
         }

         var strategy = GradingStrategyFactory.GetStrategy(quiz);

         // Lifecycle guards (ownership + finished) and the grade-and-map flow live in the shared
         // grader so the full-quiz and subquiz paths cannot diverge again (issue #12).
         return await _submissionGrader.GradeAndFinish(submissionId, quizId, expectedSubquizId: null, strategy, answers);
     }

     public async Task CreateQuiz(Quiz quiz)
     {
         await _quizRepository.Create(quiz);
     }
 }