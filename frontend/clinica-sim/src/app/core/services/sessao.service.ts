import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Sessao, CriarSessaoRequest, RespostaInteracaoResponse } from '../models/sessao.model';
import { EventoSessao } from '../models/evento-sessao.model';
import { NotaClinica, NotaClinicaRequest } from '../models/nota-clinica.model';
import { Pergunta } from '../models/pergunta.model';

@Injectable({ providedIn: 'root' })
export class SessaoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/sessoes`;

  criar(request: CriarSessaoRequest): Observable<Sessao> {
    return this.http.post<Sessao>(this.baseUrl, request);
  }

  buscarPorId(id: number): Observable<Sessao> {
    return this.http.get<Sessao>(`${this.baseUrl}/${id}`);
  }

  fazerPergunta(sessaoId: number, pergunta: Pergunta): Observable<RespostaInteracaoResponse> {
    const payload = pergunta.ehPerguntaCaso
      ? { perguntaId: null, perguntaCasoId: pergunta.id }
      : { perguntaId: pergunta.id, perguntaCasoId: null };

    return this.http.post<RespostaInteracaoResponse>(
      `${this.baseUrl}/${sessaoId}/perguntas`,
      payload
    );
  }

  selecionarAchado(sessaoId: number, achadoFisicoId: number): Observable<RespostaInteracaoResponse> {
    return this.http.post<RespostaInteracaoResponse>(
      `${this.baseUrl}/${sessaoId}/achados`,
      { achadoFisicoId }
    );
  }

  listarEventos(sessaoId: number): Observable<EventoSessao[]> {
    return this.http.get<EventoSessao[]>(`${this.baseUrl}/${sessaoId}/eventos`);
  }

  buscarNotaClinica(sessaoId: number): Observable<NotaClinica> {
    return this.http.get<NotaClinica>(`${this.baseUrl}/${sessaoId}/nota-clinica`);
  }

  salvarNotaClinica(sessaoId: number, nota: NotaClinicaRequest): Observable<NotaClinica> {
    return this.http.put<NotaClinica>(`${this.baseUrl}/${sessaoId}/nota-clinica`, nota);
  }

  finalizar(sessaoId: number): Observable<Sessao> {
    return this.http.post<Sessao>(`${this.baseUrl}/${sessaoId}/finalizar`, {});
  }
}
