import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CasoClinico } from '../models/caso-clinico.model';
import {
  RespostaCaso,
  CriarRespostaCasoRequest,
  AtualizarRespostaCasoRequest
} from '../models/resposta-caso.model';
import {
  PerguntaCaso,
  CriarPerguntaCasoRequest,
  AtualizarPerguntaCasoRequest
} from '../models/pergunta-caso.model';
import {
  AchadoCaso,
  CriarAchadoCasoRequest,
  AtualizarAchadoCasoRequest
} from '../models/achado-caso.model';

@Injectable({ providedIn: 'root' })
export class CasoClinicoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/casos-clinicos`;

  listar(somenteAtivos?: boolean): Observable<CasoClinico[]> {
    let params = new HttpParams();
    if (somenteAtivos !== undefined) {
      params = params.set('apenasAtivos', String(somenteAtivos));
    }
    return this.http.get<CasoClinico[]>(this.baseUrl, { params });
  }

  buscarPorId(id: number): Observable<CasoClinico> {
    return this.http.get<CasoClinico>(`${this.baseUrl}/${id}`);
  }

  criar(caso: Partial<CasoClinico>): Observable<CasoClinico> {
    return this.http.post<CasoClinico>(this.baseUrl, caso);
  }

  atualizar(id: number, caso: Partial<CasoClinico>): Observable<CasoClinico> {
    return this.http.put<CasoClinico>(`${this.baseUrl}/${id}`, caso);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  listarRespostasCaso(casoClinicoId: number): Observable<RespostaCaso[]> {
    return this.http.get<RespostaCaso[]>(`${this.baseUrl}/${casoClinicoId}/respostas`);
  }

  criarRespostaCaso(casoClinicoId: number, request: CriarRespostaCasoRequest): Observable<RespostaCaso> {
    return this.http.post<RespostaCaso>(`${this.baseUrl}/${casoClinicoId}/respostas`, request);
  }

  atualizarRespostaCaso(casoClinicoId: number, respostaId: number, request: AtualizarRespostaCasoRequest): Observable<RespostaCaso> {
    return this.http.put<RespostaCaso>(`${this.baseUrl}/${casoClinicoId}/respostas/${respostaId}`, request);
  }

  removerRespostaCaso(casoClinicoId: number, respostaId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${casoClinicoId}/respostas/${respostaId}`);
  }

  listarPerguntasCasos(casoClinicoId: number): Observable<PerguntaCaso[]> {
    return this.http.get<PerguntaCaso[]>(`${this.baseUrl}/${casoClinicoId}/perguntas-casos`);
  }

  criarPerguntaCaso(casoClinicoId: number, request: CriarPerguntaCasoRequest): Observable<PerguntaCaso> {
    return this.http.post<PerguntaCaso>(`${this.baseUrl}/${casoClinicoId}/perguntas-casos`, request);
  }

  atualizarPerguntaCaso(
    casoClinicoId: number,
    perguntaCasoId: number,
    request: AtualizarPerguntaCasoRequest
  ): Observable<PerguntaCaso> {
    return this.http.put<PerguntaCaso>(`${this.baseUrl}/${casoClinicoId}/perguntas-casos/${perguntaCasoId}`, request);
  }

  removerPerguntaCaso(casoClinicoId: number, perguntaCasoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${casoClinicoId}/perguntas-casos/${perguntaCasoId}`);
  }

  listarAchadosFisicosCaso(casoClinicoId: number): Observable<AchadoCaso[]> {
    return this.http.get<AchadoCaso[]>(`${this.baseUrl}/${casoClinicoId}/achados-fisicos`);
  }

  criarAchadoFisicoCaso(casoClinicoId: number, request: CriarAchadoCasoRequest): Observable<AchadoCaso> {
    return this.http.post<AchadoCaso>(`${this.baseUrl}/${casoClinicoId}/achados-fisicos`, request);
  }

  atualizarAchadoFisicoCaso(
    casoClinicoId: number,
    achadoCasoId: number,
    request: AtualizarAchadoCasoRequest
  ): Observable<AchadoCaso> {
    return this.http.put<AchadoCaso>(`${this.baseUrl}/${casoClinicoId}/achados-fisicos/${achadoCasoId}`, request);
  }

  removerAchadoFisicoCaso(casoClinicoId: number, achadoCasoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${casoClinicoId}/achados-fisicos/${achadoCasoId}`);
  }
}
