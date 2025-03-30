using API.External;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("quiz")]
public class QuizController: ControllerBase
{
    public QuizController(QuizService quizService,
        QuestionService questionService
    )
    {
        _quizService = quizService;
        _questionService = questionService;
    }
    
    private readonly QuizService _quizService;
    private readonly QuestionService _questionService;
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Quiz>>> GetQuizzes()
    {
        var quizzes = await _quizService.GetQuizzes();

        return Ok(quizzes);
    }
    
    [HttpPost]
    public async Task ProcessQuestions()
    {
        await _questionService.ProcessQuestions();
    }
}