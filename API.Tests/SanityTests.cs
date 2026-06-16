namespace API.Tests;

/// <summary>
/// Smoke test proving the test project compiles and runs. The Moq +
/// constructor-injection pattern for mocking repository dependencies is
/// demonstrated for real in <c>Services/QuizServiceTests</c>.
/// </summary>
public class SanityTests
{
    [Fact]
    public void TestProject_RunsGreen()
    {
        Assert.True(true);
    }
}
