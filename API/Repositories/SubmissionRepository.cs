using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class SubmissionRepository(ApplicationDbContext context) : ISubmissionRepository
{
    public async Task<Submission> Create(Submission submission)
    {
        await context.Submission.AddAsync(submission);
        await context.SaveChangesAsync();
        return submission;
    }

    public async Task<Submission> Update(Submission submission)
    {
        context.Submission.Update(submission);
        await context.SaveChangesAsync();
        return submission;
    }
    
    public async Task<Submission?> GetById(int submissionId)
    {
        return await context.Submission
            .Include(s => s.RecordedAnswers)
            .FirstOrDefaultAsync(s => s.Id == submissionId);
    }

    public async Task RecordAnswer(RecordedAnswer recordedAnswer)
    {
        context.Set<RecordedAnswer>().Add(recordedAnswer);
        await context.SaveChangesAsync();
    }
}