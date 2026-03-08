import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CasoClinico } from '../models/caso-clinico.model';

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
}
