using API.Entities;
using API.Model.Request;

namespace API.Services.Grading;

// Source: https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html
public class ClfC02GradingStrategy : IGradingStrategy
{
    private static readonly Dictionary<string, double> DomainWeights = new()
    {
        { "Cloud Concepts", 0.24 },
        { "Security and Compliance", 0.30 },
        { "Cloud Technology and Services", 0.34 },
        { "Billing, Pricing, and Support", 0.12 }
    };

    public GradingResult Grade(IEnumerable<Question> questions, List<QuizAnswer> userAnswers)
    {
        var questionList = questions.ToList();
        var domainStats = new Dictionary<string, (int correct, int total)>();
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

            string domain = question.Domain ?? "Unknown";
            if (!domainStats.ContainsKey(domain))
                domainStats[domain] = (0, 0);

            var (correct, total) = domainStats[domain];
            domainStats[domain] = (isCorrect ? correct + 1 : correct, total + 1);
        }

        // Calculate weighted score
        double weightedScore = 0;
        foreach (var (domain, weight) in DomainWeights)
        {
            if (domainStats.TryGetValue(domain, out var stat))
            {
                var (correct, total) = stat;
                double domainScore = total > 0 ? (double)correct / total : 0;
                weightedScore += domainScore * weight;
            }
        }

        int scaledScore = (int)Math.Round(100 + weightedScore * 900);
        bool passed = scaledScore >= 700;

        var domainBreakdown = DomainWeights.Keys
            .Where(d => domainStats.ContainsKey(d))
            .Select(d => {
                var (correct, total) = domainStats[d];
                return new DomainResult(d, correct, total, DomainWeights[d]);
            })
            .ToList();

        return new GradingResult(scaledScore, passed, totalCorrect, totalQuestions, domainBreakdown);
    }
}
