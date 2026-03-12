import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pergunta } from '../models/pergunta.model';

@Injectable({ providedIn: 'root' })
export class PerguntaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/perguntas`;

  listar(somenteAtivas?: boolean, casoClinicoId?: number): Observable<Pergunta[]> {
    let params = new HttpParams();
    if (somenteAtivas !== undefined) {
      params = params.set('apenasAtivas', String(somenteAtivas));
    }
    if (casoClinicoId !== undefined) {
      params = params.set('casoClinicoId', String(casoClinicoId));
    }
    return this.http.get<Pergunta[]>(this.baseUrl, { params });
  }

  buscarPorId(id: number): Observable<Pergunta> {
    return this.http.get<Pergunta>(`${this.baseUrl}/${id}`);
  }

  criar(pergunta: Partial<Pergunta>): Observable<Pergunta> {
    return this.http.post<Pergunta>(this.baseUrl, pergunta);
  }

  atualizar(id: number, pergunta: Partial<Pergunta>): Observable<Pergunta> {
    return this.http.put<Pergunta>(`${this.baseUrl}/${id}`, pergunta);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
