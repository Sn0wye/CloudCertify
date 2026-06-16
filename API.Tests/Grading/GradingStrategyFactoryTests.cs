using API.Entities;
using API.Services.Grading;

namespace API.Tests.Grading;

public class GradingStrategyFactoryTests
{
    [Fact]
    public void ClfC02Slug_SelectsWeightedStrategy()
    {
        var quiz = new Quiz { Slug = "CLF-C02" };

        var strategy = GradingStrategyFactory.GetStrategy(quiz);

        Assert.IsType<ClfC02GradingStrategy>(strategy);
    }

    [Fact]
    public void UnknownSlug_FallsBackToDefaultStrategy()
    {
        var quiz = new Quiz { Slug = "SAA-C03" };

        var strategy = GradingStrategyFactory.GetStrategy(quiz);

        Assert.IsType<DefaultGradingStrategy>(strategy);
    }

    [Fact]
    public void GetSubquizStrategy_SelectsDomainSubquizStrategy()
    {
        var strategy = GradingStrategyFactory.GetSubquizStrategy();

        Assert.IsType<DomainSubquizGradingStrategy>(strategy);
    }
}
