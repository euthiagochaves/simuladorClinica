import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AchadoFisico } from '../models/achado-fisico.model';

@Injectable({ providedIn: 'root' })
export class AchadoFisicoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/achados-fisicos`;

  listar(somenteAtivos?: boolean): Observable<AchadoFisico[]> {
    let params = new HttpParams();
    if (somenteAtivos !== undefined) {
      params = params.set('apenasAtivos', String(somenteAtivos));
    }
    return this.http.get<AchadoFisico[]>(this.baseUrl, { params });
  }

  buscarPorId(id: number): Observable<AchadoFisico> {
    return this.http.get<AchadoFisico>(`${this.baseUrl}/${id}`);
  }

  criar(achado: Partial<AchadoFisico>): Observable<AchadoFisico> {
    return this.http.post<AchadoFisico>(this.baseUrl, achado);
  }

  atualizar(id: number, achado: Partial<AchadoFisico>): Observable<AchadoFisico> {
    return this.http.put<AchadoFisico>(`${this.baseUrl}/${id}`, achado);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
