using API.Repositories;

namespace API.External;

using Newtonsoft.Json;
using Entities;

public class QuestionService
{
    private readonly QuizRepository _quizRepository;

    public QuestionService(QuizRepository quizRepository)
    {
        _quizRepository = quizRepository;
    }

    public async Task ProcessQuestions()
    {
        var existingTitles = (await _quizRepository.GetQuizzes())
            .Select(q => q.Title)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var quizzesToCreate = new List<Quiz>();

        foreach (var seed in QuizSeeds)
        {
            if (existingTitles.Contains(seed.Title))
            {
                continue;
            }

            if (!string.IsNullOrWhiteSpace(seed.QuestionsFileName))
            {
                quizzesToCreate.Add(BuildQuizWithQuestions(seed));
                continue;
            }

            quizzesToCreate.Add(seed.ToQuiz());
        }

        if (quizzesToCreate.Count == 0)
        {
            return;
        }

        await _quizRepository.CreateMany(quizzesToCreate);
    }

    private static Quiz BuildQuizWithQuestions(QuizSeed seed)
    {
        var quiz = seed.ToQuiz();
        var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "External", "questions", seed.QuestionsFileName);

        if (!File.Exists(filePath))
        {
            Console.WriteLine($"Questions file not found: {filePath}");
            return quiz;
        }

        var json = File.ReadAllText(filePath);
        var jsonQuestions = JsonConvert.DeserializeObject<List<QuestionPayload>>(json) ?? new List<QuestionPayload>();

        quiz.Questions = jsonQuestions.Select(question => new API.Entities.Question
        {
            Text = question.Text,
            Type = QuestionType.MultipleChoice,
            Answers = (question.Answers ?? new List<AnswerPayload>()).Select(answer => new API.Entities.Answer
            {
                Text = answer.Text,
                IsCorrect = answer.IsCorrect,
            }).ToList(),
        }).ToList();

        return quiz;
    }

    private static readonly List<QuizSeed> QuizSeeds =
    [
        new()
        {
            Title = "AWS Certified Cloud Practitioner (CLF-C02)",
            Description = "Build foundational AWS Cloud concepts, services, and terminology.",
            IconName = "cloud",
            QuizProvider = QuizProvider.AWS,
            QuizLevel = QuizLevel.Foundational,
            QuestionsFileName = "clf-c02.json",
            IsAvailable = true
        },
        new()
        {
            Title = "AWS Certified Developer Associate (DVA-C02)",
            Description = "Develop and deploy applications on AWS services and tools.",
            IconName = "code",
            QuizProvider = QuizProvider.AWS,
            QuizLevel = QuizLevel.Associate
        },
        new()
        {
            Title = "AWS Certified CloudOps Engineer Associate (SOA-C03)",
            Description = "Operate, manage, and automate workloads on AWS.",
            IconName = "monitor",
            QuizProvider = QuizProvider.AWS,
            QuizLevel = QuizLevel.Associate
        },
        new()
        {
            Title = "AWS Certified Solutions Architect Associate (SAA-C03)",
            Description = "Design secure, resilient, and cost-optimized AWS solutions.",
            IconName = "server",
            QuizProvider = QuizProvider.AWS,
            QuizLevel = QuizLevel.Associate
        },
        new()
        {
            Title = "AWS Certified Database Specialty (DBS-C01)",
            Description = "Design, deploy, and manage AWS database solutions.",
            IconName = "database",
            QuizProvider = QuizProvider.AWS,
            QuizLevel = QuizLevel.Specialist
        },
        new()
        {
            Title = "Microsoft Azure Administrator (AZ-104)",
            Description = "Implement and manage Azure compute, storage, and networking.",
            IconName = "settings",
            QuizProvider = QuizProvider.Azure,
            QuizLevel = QuizLevel.Associate
        },
        new()
        {
            Title = "Microsoft Azure Fundamentals (AZ-900)",
            Description = "Learn foundational Azure concepts, services, and pricing.",
            IconName = "book-open",
            QuizProvider = QuizProvider.Azure,
            QuizLevel = QuizLevel.Foundational
        },
        new()
        {
            Title = "Windows Server Hybrid Administrator Associate (AZ-800)",
            Description = "Manage Windows Server workloads in hybrid environments.",
            IconName = "hard-drive",
            QuizProvider = QuizProvider.Azure,
            QuizLevel = QuizLevel.Associate
        },
        new()
        {
            Title = "Microsoft Azure Security Engineer Associate (AZ-500)",
            Description = "Implement security controls and protect Azure workloads.",
            IconName = "shield",
            QuizProvider = QuizProvider.Azure,
            QuizLevel = QuizLevel.Associate
        },
        new()
        {
            Title = "Google Cloud Platform (GCP) Associate Cloud Engineer (ACE)",
            Description = "Deploy, manage, and monitor GCP resources and services.",
            IconName = "cpu",
            QuizProvider = QuizProvider.GCP,
            QuizLevel = QuizLevel.Associate
        }
    ];
}

public class QuestionPayload
{
    public string Text { get; set; }
    public string Type { get; set; }
    public List<AnswerPayload> Answers { get; set; }
}

public class AnswerPayload
{
    public string Text { get; set; }
    public bool IsCorrect { get; set; }
}

public class QuizSeed
{
    public string Title { get; init; }
    public string Description { get; init; }
    public string IconName { get; init; }

    public bool IsAvailable { get; set; } = false;
    public QuizProvider QuizProvider { get; init; }
    public QuizLevel QuizLevel { get; init; }
    public string QuestionsFileName { get; init; }

    public Quiz ToQuiz()
    {
        return new Quiz
        {
            Title = Title,
            Description = Description,
            IconName = IconName,
            IsAvailable = IsAvailable,
            QuizProvider = QuizProvider,
            QuizLevel = QuizLevel
        };
    }
}