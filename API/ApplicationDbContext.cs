using API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace API;

public class ApplicationDbContext: DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Quiz> Quiz { get; set; }
    public DbSet<Question> Question { get; set; }
    public DbSet<Answer> Answer { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Quiz>(entity =>
        {
            entity.HasKey(q => q.Id);
            entity.Property(q => q.Title).IsRequired().HasMaxLength(255);
            entity.Property(q => q.Description).IsRequired().HasMaxLength(255);
            entity.Property(q => q.CreatedAt).IsRequired();
        
            entity.HasMany(q => q.Questions)
                .WithOne(q => q.Quiz)
                .HasForeignKey(q => q.QuizId);
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(q => q.Id);
            entity.Property(q => q.Text).IsRequired().HasColumnType("text");
            entity.Property(q => q.Type).IsRequired();
            entity.Property(q => q.CreatedAt).IsRequired();

            entity.HasOne(q => q.Quiz)
                .WithMany(q => q.Questions)
                .HasForeignKey(q => q.QuizId);

            entity.HasMany(q => q.Answers)
                .WithOne(a => a.Question)
                .HasForeignKey(a => a.QuestionId);
        });

        modelBuilder.Entity<Answer>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Text).IsRequired().HasMaxLength(255);
            entity.Property(a => a.IsCorrect).IsRequired();
            entity.Property(a => a.CreatedAt).IsRequired();

            entity.HasOne(a => a.Question)
                .WithMany(q => q.Answers)
                .HasForeignKey(a => a.QuestionId);
        });
    }
}