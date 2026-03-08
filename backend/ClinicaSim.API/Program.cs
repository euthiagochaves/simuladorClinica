using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using ClinicaSim.API.Data;
using ClinicaSim.API.Services;
using ClinicaSim.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// =========================================================================
// Registro de servicos no container de injecao de dependencia
// =========================================================================

// Contexto do banco de dados PostgreSQL (Npgsql)
builder.Services.AddDbContext<ClinicaSimDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Controllers da API
builder.Services.AddControllers();

// Documentacao OpenAPI / Swagger
builder.Services.AddOpenApi();

// --- Servicos de dominio ---
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<ICasoClinicoService, CasoClinicoService>();
builder.Services.AddScoped<IPerguntaService, PerguntaService>();
builder.Services.AddScoped<IAchadoFisicoService, AchadoFisicoService>();
builder.Services.AddScoped<ISessaoService, SessaoService>();
builder.Services.AddScoped<INotaClinicaService, NotaClinicaService>();
builder.Services.AddScoped<IImportacaoService, ImportacaoService>();
builder.Services.AddScoped<IConfiguracaoSistemaService, ConfiguracaoSistemaService>();

// Politica de CORS para permitir o frontend Angular em desenvolvimento
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// =========================================================================
// Pipeline de middlewares HTTP
// =========================================================================

// Documentacao da API disponivel apenas em desenvolvimento
if (app.Environment.IsDevelopment())
{
    // Endpoint OpenAPI JSON: /openapi/v1.json
    app.MapOpenApi();

    // Interface visual Scalar: /scalar/v1
    app.MapScalarApiReference(options =>
    {
        options
            .WithTitle("ClinicaSim API")
            .WithTheme(ScalarTheme.BluePlanet)
            .WithDefaultHttpClient(ScalarTarget.JavaScript, ScalarClient.Fetch);
    });

    // Redirecionar /swagger para /scalar/v1 (conveniencia)
    app.MapGet("/swagger", () => Results.Redirect("/scalar/v1"))
       .ExcludeFromDescription();
    app.MapGet("/swagger/index.html", () => Results.Redirect("/scalar/v1"))
       .ExcludeFromDescription();
}

// Habilitar CORS antes dos demais middlewares
app.UseCors("PermitirFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
