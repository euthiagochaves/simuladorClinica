# 08 - Endpoints da API REST

## Base URL
```
http://localhost:5000/api
```

---

## Usuarios (`api/usuarios`)

| Método | Rota              | Descrição                    |
|--------|-------------------|------------------------------|
| GET    | `/`               | Listar todos os usuários     |
| GET    | `/{id}`           | Buscar usuário por ID        |
| POST   | `/`               | Criar novo usuário           |
| PUT    | `/{id}`           | Atualizar usuário            |
| DELETE | `/{id}`           | Desativar usuário            |

---

## Casos Clínicos (`api/casos-clinicos`)

| Método | Rota                       | Descrição                                    |
|--------|----------------------------|----------------------------------------------|
| GET    | `/`                        | Listar casos (filtro: somente ativos)        |
| GET    | `/{id}`                    | Buscar caso por ID                           |
| POST   | `/`                        | Criar novo caso clínico                      |
| PUT    | `/{id}`                    | Atualizar caso clínico                       |
| DELETE | `/{id}`                    | Desativar caso clínico                       |
| GET    | `/{id}/respostas`          | Listar respostas específicas do caso         |
| POST   | `/{id}/respostas`          | Adicionar resposta específica ao caso        |
| GET    | `/{id}/achados-fisicos`    | Listar achados físicos específicos do caso   |
| POST   | `/{id}/achados-fisicos`    | Adicionar achado físico ao caso              |

---

## Perguntas (`api/perguntas`)

| Método | Rota              | Descrição                           |
|--------|--------------------|-------------------------------------|
| GET    | `/`               | Listar perguntas (filtro: ativas)   |
| GET    | `/{id}`           | Buscar pergunta por ID              |
| POST   | `/`               | Criar nova pergunta                 |
| PUT    | `/{id}`           | Atualizar pergunta                  |
| DELETE | `/{id}`           | Desativar pergunta                  |

---

## Achados Físicos (`api/achados-fisicos`)

| Método | Rota              | Descrição                              |
|--------|--------------------|----------------------------------------|
| GET    | `/`               | Listar achados (filtro: ativos)        |
| GET    | `/{id}`           | Buscar achado por ID                   |
| POST   | `/`               | Criar novo achado físico               |
| PUT    | `/{id}`           | Atualizar achado físico                |
| DELETE | `/{id}`           | Desativar achado físico                |

---

## Sessões (`api/sessoes`) — Controller principal

| Método | Rota                       | Descrição                                        |
|--------|----------------------------|--------------------------------------------------|
| POST   | `/`                        | Iniciar nova sessão de atendimento               |
| GET    | `/{id}`                    | Buscar sessão por ID                             |
| GET    | `/codigo/{codigo}`         | Buscar sessão pelo código único                  |
| POST   | `/{id}/perguntas`          | Fazer pergunta (resolve caso > global, registra evento) |
| POST   | `/{id}/achados`            | Selecionar achado (resolve caso > global, registra evento) |
| GET    | `/{id}/eventos`            | Listar eventos da sessão em ordem cronológica    |
| GET    | `/{id}/nota-clinica`       | Buscar nota clínica da sessão                    |
| PUT    | `/{id}/nota-clinica`       | Salvar/atualizar nota clínica + diagnósticos     |
| POST   | `/{id}/finalizar`          | Finalizar sessão (valida campos obrigatórios)    |

---

## Importação (`api/importacao`)

| Método | Rota              | Descrição                              |
|--------|--------------------|----------------------------------------|
| POST   | `/yaml`           | Importar caso clínico via YAML         |

---

## Configurações do Sistema (`api/configuracoes`)

| Método | Rota              | Descrição                              |
|--------|--------------------|----------------------------------------|
| GET    | `/`               | Listar todas as configurações          |
| GET    | `/{chave}`        | Buscar configuração por chave          |
| PUT    | `/{chave}`        | Atualizar valor de configuração        |

---

## Total: 40 endpoints

## Padrão de Respostas HTTP

| Código | Uso                                          |
|--------|----------------------------------------------|
| 200    | Sucesso (GET, PUT, DELETE)                   |
| 201    | Criado com sucesso (POST)                    |
| 400    | Dados inválidos ou validação falhou          |
| 404    | Recurso não encontrado                       |
| 500    | Erro interno do servidor                     |
