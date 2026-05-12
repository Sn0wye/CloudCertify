using API.Entities;

namespace API.Model.Response;

public class SubmitQuizResponseDto
{
    public required int Score { get; set; }
    public required int TotalQuestions { get; set; }
    public required int CorrectCount { get; set; }
    public required List<QuizResultQuestionDto> Questions { get; set; }
}

public class QuizResultQuestionDto
{
    public required int Id { get; set; }
    public required string Text { get; set; }
    public required QuestionType Type { get; set; }
    public required List<QuizResultAnswerDto> Answers { get; set; }
}

public class QuizResultAnswerDto
{
    public required int Id { get; set; }
    public required string Text { get; set; }
    public required bool IsCorrect { get; set; }
    public required bool WasSelected { get; set; }
}
