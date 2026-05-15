using API.Entities;

namespace API.Services.Grading;

public static class GradingStrategyFactory
{
    public static IGradingStrategy GetStrategy(Quiz quiz)
    {
        return quiz.Slug switch
        {
            "CLF-C02" => new ClfC02GradingStrategy(),
            _ => new DefaultGradingStrategy()
        };
    }
}
