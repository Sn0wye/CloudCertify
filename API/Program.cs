using System.Text.Json;
using System.Text.Json.Serialization;
using API;
using API.External;
using API.Repositories;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;

DotNetEnv.Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, ct) =>
    {
        document.Info.Title = "CloudCertify API";
        document.Info.Description = "CloudCertify API — a cloud certification quiz and exam prep platform.";
        document.Info.Version = "v1";
        document.Servers.Add(new OpenApiServer
        {
            Url = "https://api-cloudcertify.snowye.dev",
            Description = "Production"
        });
        return Task.CompletedTask;
    });

    options.AddSchemaTransformer((schema, context, ct) =>
    {
        if (context.JsonTypeInfo.Type.IsEnum)
        {
            schema.Type = "string";
            schema.Format = null;
            schema.Enum = Enum.GetNames(context.JsonTypeInfo.Type)
                .Select(n => (IOpenApiAny)new OpenApiString(
                    JsonNamingPolicy.SnakeCaseLower.ConvertName(n)))
                .ToList();
        }
        return Task.CompletedTask;
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            // .WithOrigins("https://cloudcertify.snowye.dev")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseLower));
    });

builder.Services.AddScoped<QuizRepository>();
builder.Services.AddScoped<QuestionRepository>();
builder.Services.AddScoped<SubmissionRepository>();

builder.Services.AddScoped<QuestionService>();
builder.Services.AddScoped<QuizService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("/docs", options =>
    {
        options.WithTitle("CloudCertify API");
    });
}
    
app.UseCors();
app.UseCors();
app.MapControllers();
app.UseHttpsRedirection();

app.Run();