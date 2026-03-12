-- ============================================================================
-- ClinicaSim — Dados iniciais para desenvolvimento e testes
-- ============================================================================
-- Executar APÓS o script 01-criar-banco.sql
-- ============================================================================

-- ============================================================================
-- 1. USUARIOS (3 perfis de teste)
-- ============================================================================
INSERT INTO usuarios (nome_completo, email, senha_hash, perfil) VALUES
    ('Administrador do Sistema', 'admin@clinicasim.com',    NULL, 'Administrador'),
    ('Dr. Carlos García',       'carlos.garcia@med.edu',    NULL, 'Professor'),
    ('María López Rodríguez',   'maria.lopez@alumnos.edu',  NULL, 'Aluno'),
    ('Juan Pérez Martínez',     'juan.perez@alumnos.edu',   NULL, 'Aluno');

-- ============================================================================
-- 2. PERGUNTAS — Banco global de anamnese (paciente saudável = resposta padrão)

-- ============================================================================
-- 3. ACHADOS FÍSICOS — Banco global (paciente saudável = resultado padrão)
-- ============================================================================
INSERT INTO achados_fisicos (nome, sistema_categoria, descricao, resultado_padrao) VALUES
    -- Estado General
    ('Aspecto general',             'Estado General',               'Evaluación del estado general del paciente',               'Paciente en buen estado general, vigil, orientado, cooperador.'),
    ('Estado de consciencia',       'Estado General',               'Nivel de consciencia y orientación',                       'Consciente, alerta, orientado en tiempo, espacio y persona.'),
    ('Signos vitales',              'Estado General',               'Presión arterial, frecuencia cardíaca, temperatura, SpO2', 'PA: 120/80 mmHg, FC: 72 lpm, FR: 16 rpm, T: 36.5°C, SpO2: 98%.'),

    -- Aparato Cardiovascular
    ('Auscultación cardíaca',       'Aparato Cardiovascular',       'Ruidos cardíacos, soplos, ritmo',                          'Ruidos cardíacos rítmicos, sin soplos ni ruidos agregados.'),
    ('Pulsos periféricos',          'Aparato Cardiovascular',       'Pulsos radiales, pedios, poplíteos',                       'Pulsos periféricos presentes y simétricos.'),
    ('Presión arterial',            'Aparato Cardiovascular',       'Medición de presión arterial',                             'Presión arterial: 120/80 mmHg.'),
    ('Ingurgitación yugular',       'Aparato Cardiovascular',       'Evaluación de venas yugulares',                            'Sin ingurgitación yugular.'),

    -- Aparato Digestivo
    ('Inspección abdominal',        'Aparato Digestivo',            'Forma, distensión, cicatrices',                            'Abdomen plano, sin cicatrices, sin distensión.'),
    ('Palpación abdominal',         'Aparato Digestivo',            'Dolor, masas, hepatoesplenomegalia',                       'Abdomen blando, depresible, sin dolor a la palpación, sin masas.'),
    ('Peristaltismo',               'Aparato Digestivo',            'Ruidos hidroaéreos',                                       'Ruidos hidroaéreos presentes y normales.'),
    ('Signo de Murphy',             'Aparato Digestivo',            'Palpación del punto vesicular',                            'Signo de Murphy negativo.'),
    ('Signo de McBurney',           'Aparato Digestivo',            'Palpación del punto apendicular',                          'Signo de McBurney negativo.'),

    -- Sistema Respiratorio
    ('Inspección torácica',         'Sistema Respiratorio',         'Forma del tórax, expansibilidad',                          'Tórax simétrico, expansibilidad conservada.'),
    ('Auscultación pulmonar',       'Sistema Respiratorio',         'Murmullo vesicular, estertores, sibilancias',              'Murmullo vesicular conservado bilateral, sin ruidos agregados.'),
    ('Percusión torácica',          'Sistema Respiratorio',         'Sonoridad, matidez',                                       'Sonoridad conservada en ambos campos pulmonares.'),

    -- Sistema Nefrourológico
    ('Puño-percusión renal',        'Sistema Nefrourológico',       'Dolor a la puño-percusión lumbar',                         'Puño-percusión renal bilateral negativa.'),
    ('Puntos ureterales',           'Sistema Nefrourológico',       'Dolor en puntos ureterales',                               'Puntos ureterales superiores e inferiores indoloros.'),

    -- Sistema Neurológico
    ('Reflejos osteotendinosos',    'Sistema Neurológico',          'Reflejos rotulianos, aquileanos, bicipitales',             'Reflejos osteotendinosos presentes y simétricos (++/++++).' ),
    ('Fuerza muscular',             'Sistema Neurológico',          'Evaluación de fuerza en extremidades',                     'Fuerza muscular 5/5 en las 4 extremidades.'),
    ('Sensibilidad',                'Sistema Neurológico',          'Sensibilidad táctil, dolorosa, térmica',                   'Sensibilidad conservada en todos los dermatomas.'),
    ('Signos meníngeos',            'Sistema Neurológico',          'Rigidez de nuca, Kernig, Brudzinski',                      'Signos meníngeos negativos (Kernig y Brudzinski negativos).'),
    ('Pares craneales',             'Sistema Neurológico',          'Evaluación de los 12 pares craneales',                     'Pares craneales sin alteraciones.'),

    -- Sistema Osteoartromuscular
    ('Movilidad articular',         'Sistema Osteoartromuscular',   'Rango de movimiento de articulaciones',                    'Movilidad articular conservada sin restricciones.'),
    ('Columna vertebral',           'Sistema Osteoartromuscular',   'Inspección y palpación de la columna',                     'Columna vertebral sin desviaciones, sin dolor a la palpación.'),
    ('Marcha',                      'Sistema Osteoartromuscular',   'Evaluación de la marcha',                                  'Marcha normal, estable, sin claudicación.');

-- ============================================================================
-- 4. CASO CLÍNICO 1: Dolor torácico agudo (posible SCA)
-- ============================================================================
INSERT INTO casos_clinicos (titulo, nome_paciente, idade, sexo, queixa_principal, triagem, resumo, criado_por_usuario_id) VALUES
    ('Dolor torácico agudo',
     'Roberto Sánchez',
     58,
     'Masculino',
     'Dolor opresivo en el pecho que comenzó hace 2 horas',
     'Urgente',
     'Caso de síndrome coronario agudo. Paciente hipertenso con dolor torácico opresivo, irradiado a brazo izquierdo, con diaforesis.',
     2);  -- Dr. Carlos García

-- Respostas específicas do caso 1 (sobrescrevem as respostas padrão)
INSERT INTO respostas_casos_perguntas (caso_clinico_id, pergunta_id, texto_resposta, destacada) VALUES
    (1, 2,  'Sí, tengo un dolor fuerte en el pecho, como si me apretaran. Comenzó hace 2 horas mientras caminaba. Se irradia al brazo izquierdo.',  TRUE),
    (1, 1,  'Sí, también me duele un poco la cabeza.',                                                                                              FALSE),
    (1, 6,  'No tengo fiebre, pero estoy sudando mucho.',                                                                                          TRUE),
    (1, 8,  'Sí, me cuesta un poco respirar, siento que me falta el aire.',                                                                        TRUE),
    (1, 15, 'Sí, siento que el corazón me late muy rápido.',                                                                                       TRUE),
    (1, 20, 'Soy hipertenso desde hace 10 años y tengo colesterol alto. Mi padre falleció de un infarto a los 62 años.',                           TRUE),
    (1, 21, 'Tomo enalapril 10mg cada mañana y atorvastatina 20mg por la noche.',                                                                  TRUE),
    (1, 25, 'Fumé durante 20 años, lo dejé hace 5 años.',                                                                                         TRUE);

-- Achados físicos específicos do caso 1
INSERT INTO achados_fisicos_casos (caso_clinico_id, achado_fisico_id, presente, texto_detalhe, destacado) VALUES
    (1, 3,  TRUE,  'PA: 160/95 mmHg, FC: 110 lpm, FR: 22 rpm, T: 36.8°C, SpO2: 94%. Diaforesis profusa.',      TRUE),
    (1, 4,  TRUE,  'Ruidos cardíacos rítmicos, taquicárdicos, sin soplos. Se ausculta S4.',                       TRUE),
    (1, 14, TRUE,  'Murmullo vesicular conservado, estertores crepitantes bibasales.',                             TRUE),
    (1, 1,  TRUE,  'Paciente ansioso, diaforético, con facies de dolor. Regular estado general.',                  TRUE);

-- ============================================================================
-- 5. CASO CLÍNICO 2: Abdomen agudo
-- ============================================================================
INSERT INTO casos_clinicos (titulo, nome_paciente, idade, sexo, queixa_principal, triagem, resumo, criado_por_usuario_id) VALUES
    ('Dolor abdominal agudo',
     'Carmen Díaz',
     34,
     'Femenino',
     'Dolor intenso en el lado derecho del abdomen desde anoche',
     'Urgente',
     'Caso de apendicitis aguda. Paciente joven con dolor en fosa ilíaca derecha, fiebre y signos de irritación peritoneal.',
     2);

-- Respostas específicas do caso 2
INSERT INTO respostas_casos_perguntas (caso_clinico_id, pergunta_id, texto_resposta, destacada) VALUES
    (2, 3,  'Sí, me duele mucho aquí abajo a la derecha. Empezó anoche como un dolor alrededor del ombligo y luego se fue para abajo a la derecha. Me duele más cuando camino.',   TRUE),
    (2, 6,  'Sí, anoche tuve fiebre de 38.2°C.',                                                                                                                                   TRUE),
    (2, 11, 'Sí, anoche vomité dos veces. Ahora tengo náuseas pero no he vuelto a vomitar.',                                                                                      TRUE),
    (2, 14, 'No tengo hambre, no he comido nada desde ayer.',                                                                                                                      TRUE),
    (2, 12, 'No he ido al baño desde ayer.',                                                                                                                                        FALSE),
    (2, 20, 'No tengo ninguna enfermedad. Soy sana.',                                                                                                                              FALSE),
    (2, 22, 'No soy alérgica a nada.',                                                                                                                                             FALSE),
    (2, 23, 'Nunca me han operado.',                                                                                                                                                FALSE);

-- Achados físicos específicos do caso 2
INSERT INTO achados_fisicos_casos (caso_clinico_id, achado_fisico_id, presente, texto_detalhe, destacado) VALUES
    (2, 3,  TRUE,  'PA: 110/70 mmHg, FC: 98 lpm, FR: 18 rpm, T: 38.4°C, SpO2: 99%.',                                                        TRUE),
    (2, 8,  TRUE,  'Abdomen plano, con defensa muscular voluntaria en fosa ilíaca derecha.',                                                   TRUE),
    (2, 9,  TRUE,  'Dolor intenso a la palpación profunda en fosa ilíaca derecha. Signo de rebote positivo (Blumberg positivo).',              TRUE),
    (2, 10, TRUE,  'Ruidos hidroaéreos disminuidos.',                                                                                          TRUE),
    (2, 12, TRUE,  'Signo de McBurney positivo. Dolor exquisito en punto de McBurney.',                                                        TRUE),
    (2, 1,  TRUE,  'Paciente en posición antiálgica (flexión de cadera derecha), facies de dolor, febril.',                                    TRUE);

-- ============================================================================
-- 6. CASO CLÍNICO 3: Cefalea (caso mais simples)
-- ============================================================================
INSERT INTO casos_clinicos (titulo, nome_paciente, idade, sexo, queixa_principal, triagem, resumo, criado_por_usuario_id) VALUES
    ('Cefalea persistente',
     'Ana Torres',
     28,
     'Femenino',
     'Dolor de cabeza intenso que no cede con analgésicos desde hace 3 días',
     'Normal',
     'Caso de migraña con aura. Paciente joven con cefalea hemicránea pulsátil, fotofobia, fonofobia y náuseas.',
     2);

-- Respostas específicas do caso 3
INSERT INTO respostas_casos_perguntas (caso_clinico_id, pergunta_id, texto_resposta, destacada) VALUES
    (3, 1,  'Sí, me duele mucho la cabeza del lado izquierdo. Es un dolor pulsátil muy intenso. Empezó hace 3 días. Antes de que empezara, veía luces brillantes.',              TRUE),
    (3, 11, 'Sí, tengo náuseas constantemente pero no he vomitado.',                                                                                                              TRUE),
    (3, 19, 'Sí, antes de que empezara el dolor vi luces brillantes y zigzagueantes durante unos 20 minutos. Ahora la luz me molesta mucho.',                                     TRUE),
    (3, 17, 'Sí, me mareo un poco cuando me levanto rápido.',                                                                                                                     FALSE),
    (3, 6,  'No tengo fiebre.',                                                                                                                                                    FALSE),
    (3, 20, 'Mi madre también sufre de migrañas.',                                                                                                                                 TRUE),
    (3, 21, 'Tomo anticonceptivos orales. He tomado ibuprofeno y paracetamol pero no me hacen efecto.',                                                                            TRUE);

-- Achados físicos específicos do caso 3
INSERT INTO achados_fisicos_casos (caso_clinico_id, achado_fisico_id, presente, texto_detalhe, destacado) VALUES
    (3, 3,  TRUE,  'PA: 115/75 mmHg, FC: 78 lpm, FR: 16 rpm, T: 36.6°C, SpO2: 99%.',    FALSE),
    (3, 21, TRUE,  'Pares craneales sin alteraciones. Fotofobia marcada.',                  TRUE),
    (3, 20, TRUE,  'Signos meníngeos negativos (descarta meningitis).',                     TRUE),
    (3, 1,  TRUE,  'Paciente en buen estado general, con fotofobia. Prefiere ambiente oscuro y silencioso.', TRUE);

-- ============================================================================
-- 7. CONFIGURAÇÕES INICIAIS DO SISTEMA
-- ============================================================================
INSERT INTO configuracoes_sistema (chave, valor, descricao) VALUES
    ('max_diagnosticos_diferenciais',   '5',            'Número máximo de diagnósticos diferenciais por sessão'),
    ('tempo_maximo_sessao_minutos',     '120',          'Tempo máximo de uma sessão em minutos (0 = sem limite)'),
    ('permitir_sessao_anonima',         'true',         'Permitir iniciar sessão sem aluno logado (MVP)'),
    ('idioma_interface',                'es',           'Idioma da interface do aluno (es = espanhol)'),
    ('versao_sistema',                  '1.0.0-mvp',   'Versão atual do sistema');

-- ============================================================================
-- RESUMO DOS DADOS INSERIDOS
-- ============================================================================
SELECT 'Dados inseridos com sucesso!' AS resultado;
SELECT 'Usuarios: ' || COUNT(*) FROM usuarios;
SELECT 'Perguntas: ' || COUNT(*) FROM perguntas;
SELECT 'Achados fisicos: ' || COUNT(*) FROM achados_fisicos;
SELECT 'Casos clinicos: ' || COUNT(*) FROM casos_clinicos;
SELECT 'Respostas especificas: ' || COUNT(*) FROM respostas_casos_perguntas;
SELECT 'Achados especificos: ' || COUNT(*) FROM achados_fisicos_casos;
SELECT 'Configuracoes: ' || COUNT(*) FROM configuracoes_sistema;
