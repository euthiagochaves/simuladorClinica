using Microsoft.EntityFrameworkCore;
using ClinicaSim.API.Data;
using ClinicaSim.API.DTOs.NotasClinicas;
using ClinicaSim.API.Models.Entities;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Services;

/// <summary>
/// Implementacao do servico de gerenciamento de notas clinicas.
/// Responsavel por salvar e recuperar a nota clinica e os diagnosticos diferenciais
/// escritos pelo aluno durante uma sessao de simulacao.
/// </summary>
public class NotaClinicaService : INotaClinicaService
{
    private readonly ClinicaSimDbContext _contexto;

    /// <summary>
    /// Inicializa uma nova instancia de <see cref="NotaClinicaService"/>.
    /// </summary>
    /// <param name="contexto">Contexto do banco de dados.</param>
    public NotaClinicaService(ClinicaSimDbContext contexto)
    {
        _contexto = contexto;
    }

    /// <inheritdoc />
    public async Task<NotaClinicaResponse?> ObterPorSessaoIdAsync(int sessaoId)
    {
        var nota = await _contexto.NotasClinicas
            .AsNoTracking()
            .FirstOrDefaultAsync(n => n.SessaoId == sessaoId);

        if (nota is null)
            return null;

        // Busca os diagnosticos diferenciais da sessao
        var diagnosticos = await _contexto.DiagnosticosDiferenciais
            .AsNoTracking()
            .Where(d => d.SessaoId == sessaoId)
            .OrderBy(d => d.OrdemPrioridade)
            .ToListAsync();

        return MapearParaResponse(nota, diagnosticos);
    }

    /// <inheritdoc />
    /// <remarks>
    /// Ao salvar, cria ou atualiza a nota clinica da sessao.
    /// Os diagnosticos diferenciais anteriores sao removidos e substituidos pelos novos.
    /// </remarks>
    public async Task<NotaClinicaResponse> SalvarAsync(int sessaoId, SalvarNotaClinicaRequest request)
    {
        // Verifica se a sessao existe
        var sessaoExiste = await _contexto.Sessoes.AnyAsync(s => s.Id == sessaoId);
        if (!sessaoExiste)
            throw new InvalidOperationException($"Sessao com Id {sessaoId} nao encontrada.");

        // Busca nota clinica existente ou cria uma nova
        var nota = await _contexto.NotasClinicas
            .FirstOrDefaultAsync(n => n.SessaoId == sessaoId);

        if (nota is null)
        {
            // Cria nova nota clinica
            nota = new NotaClinica
            {
                SessaoId = sessaoId,
                TextoResumo = request.TextoResumo,
                TextoDiagnosticoProvavel = request.TextoDiagnosticoProvavel,
                TextoConduta = request.TextoConduta
            };
            _contexto.NotasClinicas.Add(nota);
        }
        else
        {
            // Atualiza nota clinica existente
            nota.TextoResumo = request.TextoResumo;
            nota.TextoDiagnosticoProvavel = request.TextoDiagnosticoProvavel;
            nota.TextoConduta = request.TextoConduta;
        }

        // Remove diagnosticos diferenciais anteriores da sessao
        var diagnosticosAntigos = await _contexto.DiagnosticosDiferenciais
            .Where(d => d.SessaoId == sessaoId)
            .ToListAsync();

        if (diagnosticosAntigos.Any())
        {
            _contexto.DiagnosticosDiferenciais.RemoveRange(diagnosticosAntigos);
        }

        // Insere os novos diagnosticos diferenciais
        var diagnosticosNovos = request.DiagnosticosDiferenciais
            .Select(d => new DiagnosticoDiferencial
            {
                SessaoId = sessaoId,
                OrdemPrioridade = d.OrdemPrioridade,
                TextoDiagnostico = d.TextoDiagnostico
            })
            .ToList();

        _contexto.DiagnosticosDiferenciais.AddRange(diagnosticosNovos);

        await _contexto.SaveChangesAsync();

        return MapearParaResponse(nota, diagnosticosNovos);
    }

    // =====================================================================
    // Metodos auxiliares de mapeamento
    // =====================================================================

    /// <summary>
    /// Mapeia uma entidade <see cref="NotaClinica"/> e seus diagnosticos para o DTO <see cref="NotaClinicaResponse"/>.
    /// </summary>
    private static NotaClinicaResponse MapearParaResponse(NotaClinica nota, List<DiagnosticoDiferencial> diagnosticos)
    {
        var diagnosticosItens = diagnosticos
            .OrderBy(d => d.OrdemPrioridade)
            .Select(d => new DiagnosticoDiferencialItem(
                OrdemPrioridade: d.OrdemPrioridade,
                TextoDiagnostico: d.TextoDiagnostico
            ))
            .ToList();

        return new NotaClinicaResponse(
            Id: nota.Id,
            TextoResumo: nota.TextoResumo,
            TextoDiagnosticoProvavel: nota.TextoDiagnosticoProvavel,
            TextoConduta: nota.TextoConduta,
            DiagnosticosDiferenciais: diagnosticosItens,
            CriadoEm: nota.CriadoEm
        );
    }
}
