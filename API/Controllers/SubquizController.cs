using API.Dto;
using API.Model.Request;
using API.Model.Response;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Subquiz endpoints: domain-specific subquizzes under parent quiz
/// </summary>
[ApiController]
[Route("quiz/{quizId}/subquizzes")]
public class SubquizController : ControllerBase
{
    private readonly SubquizService _subquizService;

    public SubquizController(SubquizService subquizService)
    {
        _subquizService = subquizService;
    }

    /// <summary>
    /// Get all subquizzes for a quiz
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<SubquizDto>>> GetSubquizzes(int quizId)
    {
        var subquizzes = await _subquizService.GetSubquizzesByQuizId(quizId);
        return Ok(subquizzes);
    }

    /// <summary>
    /// Start a subquiz session
    /// </summary>
    [HttpPost("{subquizId}/start")]
    public async Task<ActionResult<SubquizDetailDto>> StartSubquiz(int quizId, int subquizId, [FromBody] StartQuizRequestDto request)
    {
        var subquizDetail = await _subquizService.StartSubquiz(quizId, subquizId, request.Email);

        if (subquizDetail == null)
        {
            return NotFound();
        }

        return Ok(subquizDetail);
    }

    /// <summary>
    /// Submit subquiz answers
    /// </summary>
    [HttpPost("{subquizId}/submit")]
    public async Task<ActionResult<SubmitQuizResponseDto>> SubmitSubquiz(int quizId, int subquizId, [FromBody] SubmitQuizRequestDto request)
    {
        var result = await _subquizService.SubmitSubquiz(quizId, subquizId, request.SubmissionId, request.Answers);
        return Ok(result);
    }
}
