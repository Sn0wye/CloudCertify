using Moq;

namespace API.Tests;

/// <summary>
/// Proves the test project compiles, runs, and that the Moq +
/// constructor-injection pattern works end to end. Future slices should
/// mirror <see cref="MockedDependency_IsInvokedThroughConstructor"/> when
/// unit-testing services against their (mocked) dependencies.
/// </summary>
public class SanityTests
{
    [Fact]
    public void TestProject_RunsGreen()
    {
        Assert.True(true);
    }

    // Issue #8: production repositories are still concrete classes, so this
    // self-contained example shows the intended pattern — depend on an
    // abstraction, inject it via the constructor, mock it with Moq — without
    // refactoring production code ahead of the slices that need it.
    [Fact]
    public void MockedDependency_IsInvokedThroughConstructor()
    {
        var repository = new Mock<IGreetingRepository>();
        repository.Setup(r => r.FindName(42)).Returns("Ada");

        var greeter = new GreetingService(repository.Object);
        string greeting = greeter.Greet(42);

        Assert.Equal("Hello, Ada", greeting);
        repository.Verify(r => r.FindName(42), Times.Once);
    }

    [Fact]
    public void MissingName_FallsBackToStranger()
    {
        var repository = new Mock<IGreetingRepository>();
        repository.Setup(r => r.FindName(It.IsAny<int>())).Returns((string?)null);

        var greeter = new GreetingService(repository.Object);

        Assert.Equal("Hello, stranger", greeter.Greet(1));
    }
}

/// <summary>Stand-in for an `IRepository`-style dependency used by the demo.</summary>
public interface IGreetingRepository
{
    string? FindName(int id);
}

/// <summary>Demo service: takes its dependency via the constructor so tests can inject a mock.</summary>
public class GreetingService(IGreetingRepository repository)
{
    public string Greet(int id)
    {
        string name = repository.FindName(id) ?? "stranger";
        return $"Hello, {name}";
    }
}
