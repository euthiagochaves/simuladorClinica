import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResultadoImportacao } from '../models/importacao.model';

@Injectable({ providedIn: 'root' })
export class ImportacaoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/importacao`;

  importarYaml(arquivo: File): Observable<ResultadoImportacao> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    return this.http.post<ResultadoImportacao>(`${this.baseUrl}/yaml`, formData);
  }

  descargarPlantillaYaml(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/yaml/template`, { responseType: 'blob' });
  }
}
