using Microsoft.EntityFrameworkCore;
using ClinicaSim.API.Data;
using ClinicaSim.API.DTOs.Perguntas;
using ClinicaSim.API.Models.Entities;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Services;

/// <summary>
/// Implementação do serviço de gerenciamento de perguntas do banco global de anamnese.
/// Responsável por operações CRUD sobre a entidade <see cref="Pergunta"/>.
/// </summary>
public class PerguntaService : IPerguntaService
{
    private readonly ClinicaSimDbContext _contexto;

    /// <summary>
    /// Inicializa uma nova instância de <see cref="PerguntaService"/>.
    /// </summary>
    /// <param name="contexto">Contexto do banco de dados.</param>
    public PerguntaService(ClinicaSimDbContext contexto)
    {
        _contexto = contexto;
    }

    /// <inheritdoc />
    public async Task<List<PerguntaResponse>> ObterTodasAsync(bool apenasAtivas = true)
    {
        var query = _contexto.Perguntas.AsNoTracking();

        if (apenasAtivas)
            query = query.Where(p => p.Ativo);

        var perguntas = await query
            .OrderBy(p => p.OrdemExibicao)
            .ThenBy(p => p.Texto)
            .ToListAsync();

        return perguntas.Select(MapearParaResponse).ToList();
    }

    /// <inheritdoc />
    public async Task<PerguntaResponse?> ObterPorIdAsync(int id)
    {
        var pergunta = await _contexto.Perguntas
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        return pergunta is null ? null : MapearParaResponse(pergunta);
    }

    /// <inheritdoc />
    public async Task<PerguntaResponse> CriarAsync(CriarPerguntaRequest request)
    {
        var pergunta = new Pergunta
        {
            Texto = request.Texto,
            Secao = request.Secao,
            Categoria = request.Categoria,
            RespostaPadrao = request.RespostaPadrao,
            OrdemExibicao = request.OrdemExibicao ?? 0,
            Ativo = true
        };

        _contexto.Perguntas.Add(pergunta);
        await _contexto.SaveChangesAsync();

        return MapearParaResponse(pergunta);
    }

    /// <inheritdoc />
    public async Task<PerguntaResponse?> AtualizarAsync(int id, AtualizarPerguntaRequest request)
    {
        var pergunta = await _contexto.Perguntas.FindAsync(id);
        if (pergunta is null)
            return null;

        pergunta.Texto = request.Texto;
        pergunta.Secao = request.Secao;
        pergunta.Categoria = request.Categoria;
        pergunta.RespostaPadrao = request.RespostaPadrao;
        pergunta.OrdemExibicao = request.OrdemExibicao ?? 0;
        pergunta.Ativo = request.Ativo;

        await _contexto.SaveChangesAsync();

        return MapearParaResponse(pergunta);
    }

    /// <inheritdoc />
    public async Task<bool> DeletarAsync(int id)
    {
        var pergunta = await _contexto.Perguntas.FindAsync(id);
        if (pergunta is null)
            return false;

        // Soft delete: desativa a pergunta em vez de remover do banco
        pergunta.Ativo = false;
        await _contexto.SaveChangesAsync();

        return true;
    }

    // =====================================================================
    // Métodos auxiliares de mapeamento
    // =====================================================================

    /// <summary>
    /// Converte um identificador inteiro em um Guid determinístico.
    /// </summary>
    private static Guid IntParaGuid(int id)
    {
        var bytes = new byte[16];
        BitConverter.GetBytes(id).CopyTo(bytes, 0);
        return new Guid(bytes);
    }

    /// <summary>
    /// Mapeia uma entidade <see cref="Pergunta"/> para o DTO <see cref="PerguntaResponse"/>.
    /// </summary>
    private static PerguntaResponse MapearParaResponse(Pergunta pergunta)
    {
        return new PerguntaResponse(
            Id: IntParaGuid(pergunta.Id),
            Texto: pergunta.Texto,
            Secao: pergunta.Secao,
            Categoria: pergunta.Categoria,
            RespostaPadrao: pergunta.RespostaPadrao,
            Ativo: pergunta.Ativo,
            OrdemExibicao: pergunta.OrdemExibicao
        );
    }
}
