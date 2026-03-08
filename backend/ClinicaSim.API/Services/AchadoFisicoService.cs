using Microsoft.EntityFrameworkCore;
using ClinicaSim.API.Data;
using ClinicaSim.API.DTOs.AchadosFisicos;
using ClinicaSim.API.Models.Entities;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Services;

/// <summary>
/// Implementação do serviço de gerenciamento de achados físicos do banco global.
/// Responsável por operações CRUD sobre a entidade <see cref="AchadoFisico"/>.
/// </summary>
public class AchadoFisicoService : IAchadoFisicoService
{
    private readonly ClinicaSimDbContext _contexto;

    /// <summary>
    /// Inicializa uma nova instância de <see cref="AchadoFisicoService"/>.
    /// </summary>
    /// <param name="contexto">Contexto do banco de dados.</param>
    public AchadoFisicoService(ClinicaSimDbContext contexto)
    {
        _contexto = contexto;
    }

    /// <inheritdoc />
    public async Task<List<AchadoFisicoResponse>> ObterTodosAsync(bool apenasAtivos = true)
    {
        var query = _contexto.AchadosFisicos.AsNoTracking();

        if (apenasAtivos)
            query = query.Where(a => a.Ativo);

        var achados = await query
            .OrderBy(a => a.SistemaCategoria)
            .ThenBy(a => a.Nome)
            .ToListAsync();

        return achados.Select(MapearParaResponse).ToList();
    }

    /// <inheritdoc />
    public async Task<AchadoFisicoResponse?> ObterPorIdAsync(int id)
    {
        var achado = await _contexto.AchadosFisicos
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);

        return achado is null ? null : MapearParaResponse(achado);
    }

    /// <inheritdoc />
    public async Task<AchadoFisicoResponse> CriarAsync(CriarAchadoFisicoRequest request)
    {
        var achado = new AchadoFisico
        {
            Nome = request.Nome,
            SistemaCategoria = request.SistemaCategoria,
            Descricao = request.Descricao,
            ResultadoPadrao = request.ResultadoPadrao,
            Ativo = true
        };

        _contexto.AchadosFisicos.Add(achado);
        await _contexto.SaveChangesAsync();

        return MapearParaResponse(achado);
    }

    /// <inheritdoc />
    public async Task<AchadoFisicoResponse?> AtualizarAsync(int id, AtualizarAchadoFisicoRequest request)
    {
        var achado = await _contexto.AchadosFisicos.FindAsync(id);
        if (achado is null)
            return null;

        achado.Nome = request.Nome;
        achado.SistemaCategoria = request.SistemaCategoria;
        achado.Descricao = request.Descricao;
        achado.ResultadoPadrao = request.ResultadoPadrao;
        achado.Ativo = request.Ativo;

        await _contexto.SaveChangesAsync();

        return MapearParaResponse(achado);
    }

    /// <inheritdoc />
    public async Task<bool> DeletarAsync(int id)
    {
        var achado = await _contexto.AchadosFisicos.FindAsync(id);
        if (achado is null)
            return false;

        // Soft delete: desativa o achado em vez de remover do banco
        achado.Ativo = false;
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
    /// Mapeia uma entidade <see cref="AchadoFisico"/> para o DTO <see cref="AchadoFisicoResponse"/>.
    /// </summary>
    private static AchadoFisicoResponse MapearParaResponse(AchadoFisico achado)
    {
        return new AchadoFisicoResponse(
            Id: IntParaGuid(achado.Id),
            Nome: achado.Nome,
            SistemaCategoria: achado.SistemaCategoria,
            Descricao: achado.Descricao,
            ResultadoPadrao: achado.ResultadoPadrao,
            Ativo: achado.Ativo
        );
    }
}
