using API.Entities;

namespace API.Services.Grading;

/// <summary>
/// Single source of the per-Question exact-match rule used at both Check time and
/// final grading: a Question is correct only when the selected answer ids are exactly
/// its correct answer ids — every correct one picked, no incorrect one picked. For a
/// multiple_response Question a partial selection is wrong (the AWS-matching rule).
/// </summary>
public static class QuestionCorrectness
{
    public static bool IsCorrect(Question question, IReadOnlyCollection<int> selectedAnswerIds)
    {
        var correctAnswerIds = question.Answers
            .Where(a => a.IsCorrect)
            .Select(a => a.Id)
            .ToList();

        return selectedAnswerIds.Count == correctAnswerIds.Count &&
               !selectedAnswerIds.Except(correctAnswerIds).Any();
    }
}
