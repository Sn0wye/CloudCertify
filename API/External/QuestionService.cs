using API.Models;
using API.Repositories;

namespace API.External;

using Newtonsoft.Json;

public class Question
{
    public string Text { get; set; }
    public string Type { get; set; }
    public List<Answer> Answers { get; set; }
}

public class Answer
{
    public string Text { get; set; }
    public bool IsCorrect { get; set; }
}

public class QuestionService
{
    private readonly QuizRepository _quizRepository;

    public QuestionService(QuizRepository quizRepository)
    {
        _quizRepository = quizRepository;
    }


    public async Task ProcessQuestions()
    {
        string filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "External", "questions.json");

        if (!File.Exists(filePath))
        {
            Console.WriteLine("File not found.");
            return;
        }

        string json = File.ReadAllText(filePath);
        var jsonQuestions = JsonConvert.DeserializeObject<List<Question>>(json);
        var quiz = new Quiz
        {
            Title = "AWS Cloud Practitioner (CLF-C02)",
            Description = "",
        };

        var questions = new List<API.Models.Question>();

        if (jsonQuestions != null)
        {
            foreach (var question in jsonQuestions)
            {
                var q = new API.Models.Question
                {
                    Text = question.Text,
                    Type = QuestionType.MultipleChoice,
                    Answers = question.Answers.Select(a => new API.Models.Answer
                    {
                        Text = a.Text,
                        IsCorrect = a.IsCorrect,
                    }).ToList(),
                };
                questions.Add(q);
            }
        }
        else
        {
            Console.WriteLine("No questions found in the file.");
        }

        quiz.Questions = questions;

        await _quizRepository.Create(quiz);
    }
}