import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConfiguracaoSistema } from '../models/configuracao-sistema.model';

@Injectable({ providedIn: 'root' })
export class ConfiguracaoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/configuracoes`;

  listar(): Observable<ConfiguracaoSistema[]> {
    return this.http.get<ConfiguracaoSistema[]>(this.baseUrl);
  }

  buscarPorChave(chave: string): Observable<ConfiguracaoSistema> {
    return this.http.get<ConfiguracaoSistema>(`${this.baseUrl}/${chave}`);
  }

  atualizar(chave: string, valor: string, descricao?: string): Observable<ConfiguracaoSistema> {
    return this.http.put<ConfiguracaoSistema>(`${this.baseUrl}/${chave}`, { valor, descricao });
  }
}
