using API.Entities;
using API.Model.Request;

namespace API.Services.Grading;

public interface IGradingStrategy
{
    GradingResult Grade(IEnumerable<Question> questions, List<QuizAnswer> userAnswers);
}
