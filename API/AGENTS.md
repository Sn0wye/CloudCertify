# CloudCertify API

## Agent Guidelines

- **Always use caveman skill** — All responses must apply `/caveman full` mode for token efficiency. Drop filler, fragments OK, short synonyms only. See caveman skill for intensity levels (lite/full/ultra).
- **Reference RTK.md** — For terminal work, always use `rtk` prefix on commands. RTK filters output automatically. Never run commands without `rtk` wrapper.

### Development instructions

- **Build**: `dotnet build API/API.csproj` to compile & check errors.
- **Run**: `dotnet run --project API` from root. Starts on http://0.0.0.0:8080. API docs at http://localhost:8080/docs
- **EF Core migrations**:
  - Create: `dotnet ef migrations add <MigrationName> --project API`
  - Apply: `dotnet ef database update --project API`
  - Revert: `dotnet ef database update <PreviousMigration> --project API`
- **Database**: Uses PostgreSQL. Configure `ConnectionStrings.DefaultConnection` in appsettings.json or .env
- **Docker**: Run `docker compose up` to start PostgreSQL container. API auto-migrates on startup.
- **Swagger**: always document endpoints with XML comments. View docs at http://localhost:8080/scalar/v1

## Testing instructions

- If there are preexisting tests, update them to reflect the changes you made, even if nobody asked.
- **Setup**: Create `API.Tests.csproj` with xUnit or NUnit for unit tests. Use Moq for mocking.
- **Run**: `dotnet test` from root or `dotnet test API.Tests/API.Tests.csproj` for specific project.
- **Focus**: Use test class name filter: `dotnet test --filter "ClassName"` or `dotnet test --logger "console;verbosity=detailed"`
- **Repositories**: Mock `IRepository` interfaces. Inject via dependency injection.
- **Services**: Test business logic isolated from DB. Mock repositories. Test edge cases (null, empty lists, validation).
- **Controllers**: Test endpoint responses, status codes, error handling. Mock services.
- **Coverage**: Use OpenCover or Coverlet: `dotnet add package coverlet.collector` then `dotnet test /p:CollectCoverage=true`
- **Before commit**: Run `dotnet test` + `dotnet build` — fix warnings/errors until all green.

## PR instructions

- Title format: <feat/fix/refactor>/<short-description> (kebab-case)
- Description: Brief summary of changes, relevant context if strictly necessary.
