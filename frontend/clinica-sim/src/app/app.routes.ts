import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AtendimentoComponent } from './pages/atendimento/atendimento.component';
import { ResultadoComponent } from './pages/resultado/resultado.component';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { ListaCasosComponent } from './pages/admin/gerenciar-casos/lista-casos/lista-casos.component';
import { FormularioCasoComponent } from './pages/admin/gerenciar-casos/formulario-caso/formulario-caso.component';
import { ListaPerguntasComponent } from './pages/admin/gerenciar-perguntas/lista-perguntas/lista-perguntas.component';
import { FormularioPerguntaComponent } from './pages/admin/gerenciar-perguntas/formulario-pergunta/formulario-pergunta.component';
import { ListaAchadosComponent } from './pages/admin/gerenciar-achados/lista-achados/lista-achados.component';
import { FormularioAchadoComponent } from './pages/admin/gerenciar-achados/formulario-achado/formulario-achado.component';
import { ListaUsuariosComponent } from './pages/admin/gerenciar-usuarios/lista-usuarios/lista-usuarios.component';
import { FormularioUsuarioComponent } from './pages/admin/gerenciar-usuarios/formulario-usuario/formulario-usuario.component';
import { ImportacaoYamlComponent } from './pages/admin/importacao-yaml/importacao-yaml.component';
import { ConfiguracoesComponent } from './pages/admin/configuracoes/configuracoes.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'atendimento/:sessaoId', component: AtendimentoComponent },
  { path: 'resultado/:sessaoId', component: ResultadoComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'casos', pathMatch: 'full' },
      { path: 'casos', component: ListaCasosComponent },
      { path: 'casos/novo', component: FormularioCasoComponent },
      { path: 'casos/:id/editar', component: FormularioCasoComponent },
      { path: 'perguntas', component: ListaPerguntasComponent },
      { path: 'perguntas/nova', component: FormularioPerguntaComponent },
      { path: 'perguntas/:id/editar', component: FormularioPerguntaComponent },
      { path: 'achados', component: ListaAchadosComponent },
      { path: 'achados/novo', component: FormularioAchadoComponent },
      { path: 'achados/:id/editar', component: FormularioAchadoComponent },
      { path: 'usuarios', component: ListaUsuariosComponent },
      { path: 'usuarios/novo', component: FormularioUsuarioComponent },
      { path: 'usuarios/:id/editar', component: FormularioUsuarioComponent },
      { path: 'importacao', component: ImportacaoYamlComponent },
      { path: 'configuracoes', component: ConfiguracoesComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
