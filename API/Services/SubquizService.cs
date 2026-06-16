using API.Dto;
using API.Entities;
using API.Model.Request;
using API.Model.Response;
using API.Repositories;
using API.Services.Grading;

namespace API.Services;

public class SubquizService
{
    public SubquizService(ISubquizRepository subquizRepository, IQuestionRepository questionRepository, ISubmissionRepository submissionRepository, SubmissionGrader submissionGrader)
    {
        _subquizRepository = subquizRepository;
        _questionRepository = questionRepository;
        _submissionRepository = submissionRepository;
        _submissionGrader = submissionGrader;
    }

    private readonly ISubquizRepository _subquizRepository;
    private readonly IQuestionRepository _questionRepository;
    private readonly ISubmissionRepository _submissionRepository;
    private readonly SubmissionGrader _submissionGrader;

    public async Task<List<SubquizDto>> GetSubquizzesByQuizId(int quizId)
    {
        var subquizzes = await _subquizRepository.GetSubquizzesByQuizId(quizId);
        return subquizzes.Select(MapSubquizToDto).ToList();
    }

    public async Task<SubquizDetailDto?> StartSubquiz(int quizId, int subquizId, string email)
    {
        var subquiz = await _subquizRepository.GetSubquizById(subquizId);

        if (subquiz == null || subquiz.QuizId != quizId)
        {
            return null;
        }

        if (!subquiz.IsAvailable)
        {
            throw new InvalidOperationException("Subquiz is not available");
        }

        // Get parent quiz to fetch questions by domain
        var parentQuiz = await _questionRepository.GetQuestionsByQuizId(quizId);

        var randomQuestions = parentQuiz
            .Where(q => q.Domain == subquiz.Domain)
            .OrderBy(q => Guid.NewGuid())
            .Take(15)
            .ToList();

        var submission = new Submission
        {
            Email = email,
            QuizId = quizId,
            SubquizId = subquizId,
            Finished = false,
            ServedQuestionIds = randomQuestions.Select(q => q.Id).ToList(),
        };

        await _submissionRepository.Create(submission);

        return new SubquizDetailDto
        {
            Id = subquiz.Id,
            Title = subquiz.Title,
            Domain = subquiz.Domain,
            Slug = subquiz.Slug,
            CreatedAt = subquiz.CreatedAt,
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

    public async Task<SubmitQuizResponseDto> SubmitSubquiz(int quizId, int subquizId, int submissionId, List<QuizAnswer> answers)
    {
        var strategy = GradingStrategyFactory.GetSubquizStrategy();

        // Lifecycle guards (ownership + finished) and the grade-and-map flow live in the shared
        // grader so the full-quiz and subquiz paths cannot diverge again (issue #12).
        return await _submissionGrader.GradeAndFinish(submissionId, quizId, subquizId, strategy, answers);
    }

    private static SubquizDto MapSubquizToDto(Subquiz sq)
    {
        return new SubquizDto
        {
            Id = sq.Id,
            Title = sq.Title,
            Domain = sq.Domain,
            Slug = sq.Slug,
            IsAvailable = sq.IsAvailable
        };
    }
}
