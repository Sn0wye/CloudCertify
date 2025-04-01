using API.Dto;
using API.External;
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
    public async Task<ActionResult<IEnumerable<QuizDto>>> GetQuizzes()
    {
        var quizzes = await _quizService.GetQuizzes();

        return Ok(quizzes);
    }
    
    [HttpPost("{quizId}/start")]
    public async Task<ActionResult<QuizDetailDto>> StartQuiz(int quizId)
    {
        var quiz = await _quizService.StartQuiz(quizId);

        if (quiz == null)
        {
            return NotFound();
        }

        return Ok(quiz);
    }

    [HttpPost("{quizId}/submit")]
    public async Task<ActionResult<SubmitQuizResponseDto>> SubmitQuiz(int quizId, [FromBody] SubmitQuizRequestDto requestDto)
    {
        var answers = requestDto.Answers;
        
        var score = await _quizService.SubmitQuiz(quizId, answers);
        
        return Ok(new SubmitQuizResponseDto
        {
            Score = score
        });
    }
    
    [HttpPost("process")]
    public async Task ProcessQuestions()
    {
        await _questionService.ProcessQuestions();
    }
}