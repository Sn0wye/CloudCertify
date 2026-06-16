using API.Entities;
using API.Model.Request;

namespace API.Tests;

/// <summary>
/// Builds <see cref="Question"/>/<see cref="Answer"/> graphs and user answers for
/// grading tests, so each test states only the facts it cares about. Keeps the
/// fragile entity-wiring (back-references, ids) in one place.
/// </summary>
internal static class QuizBuilder
{
    /// <summary>A question whose correct answers are <paramref name="correctIds"/> and distractors <paramref name="wrongIds"/>.</summary>
    public static Question Question(int id, string? domain, int[] correctIds, int[] wrongIds)
    {
        var answers = correctIds.Select(aid => new Answer { Id = aid, IsCorrect = true })
            .Concat(wrongIds.Select(aid => new Answer { Id = aid, IsCorrect = false }))
            .ToList();
        return new Question { Id = id, Domain = domain, Answers = answers };
    }

    /// <summary>The user selecting <paramref name="answerIds"/> for question <paramref name="questionId"/>.</summary>
    public static QuizAnswer Answer(int questionId, params int[] answerIds)
    {
        return new QuizAnswer { QuestionId = questionId, AnswerIds = answerIds.ToList() };
    }
}
