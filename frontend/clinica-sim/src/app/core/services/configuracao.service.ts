import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfiguracaoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/configuracoes`;

  buscar(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  salvar(configuracoes: any): Observable<any> {
    return this.http.put(this.baseUrl, configuracoes);
  }
}
