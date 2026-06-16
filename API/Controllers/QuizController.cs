using API.Dto;
using API.Entities;
using API.Model.Request;
using API.Model.Response;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("quiz")]
public class QuizController: ControllerBase
{
    public QuizController(QuizService quizService)
    {
        _quizService = quizService;
    }

    private readonly QuizService _quizService;
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<QuizDto>>> GetQuizzes()
    {
        var quizzes = await _quizService.GetQuizzes();

        return Ok(quizzes);
    }

    [HttpGet("{quizId}")]
    public async Task<ActionResult<QuizDto>> GetQuizById(int quizId)
    {
        var quiz = await _quizService.GetQuizById(quizId);
        
        if (quiz == null)
        {
            return NotFound();
        }
        
        return Ok(quiz);
    }
    
    [HttpPost("{quizId}/start")]
    public async Task<ActionResult<QuizDetailDto>> StartQuiz(int quizId, [FromBody] StartQuizRequestDto request)
    {
        var quiz = await _quizService.StartQuiz(quizId, request.Email);

        if (quiz == null)
        {
            return NotFound();
        }

        return Ok(quiz);
    }

    [HttpPost("{quizId}/submit")]
    public async Task<ActionResult<SubmitQuizResponseDto>> SubmitQuiz(int quizId, [FromBody] SubmitQuizRequestDto request)
    {
        var answers = request.Answers;
        
        var result = await _quizService.SubmitQuiz(quizId, request.SubmissionId, answers);
        
        return Ok(result);
    }
}