using API.Dto;
using API.Entities;
using API.Model.Request;
using API.Model.Response;
using API.Repositories;
using API.Services.Grading;

namespace API.Services;

public class SubquizService
{
    public SubquizService(ISubquizRepository subquizRepository, IQuestionRepository questionRepository, ISubmissionRepository submissionRepository)
    {
        _subquizRepository = subquizRepository;
        _questionRepository = questionRepository;
        _submissionRepository = submissionRepository;
    }

    private readonly ISubquizRepository _subquizRepository;
    private readonly IQuestionRepository _questionRepository;
    private readonly ISubmissionRepository _submissionRepository;

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
                Answers = q.Answers.OrderBy(a => Guid.NewGuid()).Select(a => MapAnswerToDto(a)).ToList()
            }).ToList()
        };
    }

    public async Task<SubmitQuizResponseDto> SubmitSubquiz(int quizId, int subquizId, int submissionId, List<QuizAnswer> answers)
    {
        var submission = await _submissionRepository.GetById(submissionId);

        if (submission == null || submission.QuizId != quizId || submission.SubquizId != subquizId)
        {
            throw new InvalidOperationException("Invalid submission");
        }

        if (submission.Finished)
        {
            throw new InvalidOperationException("Submission already finished");
        }

        var subquiz = await _subquizRepository.GetSubquizById(subquizId);

        if (subquiz == null)
        {
            throw new InvalidOperationException("Subquiz not found");
        }

        // Grade against the served set so skipped questions count as wrong (issue #11).
        var questions = await _questionRepository.GetQuestionsByIds(submission.ServedQuestionIds);
        var strategy = GradingStrategyFactory.GetSubquizStrategy();

        var gradingResult = strategy.Grade(questions, answers);

        // Map questions to result format
        var resultQuestions = new List<QuizResultQuestionDto>();
        foreach (var question in questions)
        {
            var userAnswerIds = answers.Where(a => a.QuestionId == question.Id).SelectMany(a => a.AnswerIds).ToList();

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

        submission.Score = gradingResult.ScaledScore;
        submission.Finished = true;

        await _submissionRepository.Update(submission);

        return new SubmitQuizResponseDto
        {
            Score = gradingResult.ScaledScore,
            TotalQuestions = gradingResult.TotalQuestions,
            CorrectCount = gradingResult.CorrectCount,
            ScaledScore = gradingResult.ScaledScore,
            Passed = gradingResult.Passed,
            DomainBreakdown = gradingResult.DomainBreakdown,
            Questions = resultQuestions
        };
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

    private static AnswerDto MapAnswerToDto(Answer a)
    {
        return new AnswerDto
        {
            Id = a.Id,
            Text = a.Text,
            Image = a.Image
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
