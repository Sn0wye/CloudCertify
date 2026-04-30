using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class SubmissionRepository(ApplicationDbContext context)
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
            .FirstOrDefaultAsync(s => s.Id == submissionId);
    }
}