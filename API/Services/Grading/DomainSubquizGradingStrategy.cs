using API.Entities;
using API.Model.Request;

namespace API.Services.Grading;

public class DomainSubquizGradingStrategy : IGradingStrategy
{
    public GradingResult Grade(IEnumerable<Question> questions, List<QuizAnswer> userAnswers)
    {
        var questionList = questions.ToList();
        int totalCorrect = 0;
        int totalQuestions = 0;

        foreach (var question in questionList)
        {
            var userAnswerIds = userAnswers
                .Where(a => a.QuestionId == question.Id)
                .SelectMany(a => a.AnswerIds)
                .ToList();

            var correctAnswerIds = question.Answers
                .Where(a => a.IsCorrect)
                .Select(a => a.Id)
                .ToList();

            bool isCorrect = userAnswerIds.Count == correctAnswerIds.Count && 
                             !userAnswerIds.Except(correctAnswerIds).Any();

            if (isCorrect)
                totalCorrect++;

            totalQuestions++;
        }

        int percentage = totalQuestions > 0 ? (int)Math.Round((double)totalCorrect * 100 / totalQuestions) : 0;
        bool passed = percentage >= 70;

        return new GradingResult(percentage, passed, totalCorrect, totalQuestions, new List<DomainResult>());
    }
}
