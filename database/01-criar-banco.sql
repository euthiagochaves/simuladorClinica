CREATE TABLE IF NOT EXISTS perguntas (
    id                  SERIAL PRIMARY KEY,
    texto               TEXT            NOT NULL,
    secao               VARCHAR(100)    NOT NULL DEFAULT 'Anamnesis',
    categoria           VARCHAR(100)    NOT NULL,
    resposta_padrao     TEXT            NOT NULL,
    ativo               BOOLEAN         NOT NULL DEFAULT TRUE,
    ordem_exibicao      INTEGER         NOT NULL DEFAULT 0,
    criado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

INSERT INTO perguntas (texto, secao, categoria, resposta_padrao, ordem_exibicao) VALUES

-- =========================
-- IDENTIFICACIÓN
-- =========================
('¿Cómo te llamás?','Anamnesis','Identificación','Me llamo Juan.',1),
('¿Cuántos años tenés?','Anamnesis','Identificación','Tengo 30 años.',2),
('¿En qué ciudad vivís?','Anamnesis','Identificación','Vivo en Buenos Aires.',3),
('¿A qué te dedicás o en qué trabajás?','Anamnesis','Identificación','Trabajo en una oficina.',4),
('¿Con quién vivís actualmente?','Anamnesis','Identificación','Vivo con mi pareja.',5),

-- =========================
-- MOTIVO DE CONSULTA
-- =========================
('¿Qué te trae hoy a la consulta?','Anamnesis','Motivo consulta','Vine para un control general.',6),
('¿Desde cuándo te sentís así?','Anamnesis','Motivo consulta','Me siento bien.',7),
('¿Tenés alguna molestia ahora?','Anamnesis','Motivo consulta','No.',8),
('¿Esto ya te pasó antes?','Anamnesis','Motivo consulta','No.',9),
('¿Algo te preocupa sobre tu salud?','Anamnesis','Motivo consulta','No.',10),

-- =========================
-- HISTORIA ACTUAL
-- =========================
('¿Notaste algún cambio reciente en tu salud?','Anamnesis','Historia actual','No.',11),
('¿Te hiciste algún control médico recientemente?','Anamnesis','Historia actual','Sí, hace un año.',12),
('¿Alguna vez tuviste síntomas parecidos a algo que te preocupe?','Anamnesis','Historia actual','No.',13),

-- =========================
-- DOLOR
-- =========================
('¿Sentís dolor en alguna parte del cuerpo?','Anamnesis','Dolor','No.',14),
('¿Dónde te duele exactamente?','Anamnesis','Dolor','No tengo dolor.',15),
('¿Cómo describirías el dolor?','Anamnesis','Dolor','No tengo dolor.',16),
('¿Desde cuándo te duele?','Anamnesis','Dolor','No tengo dolor.',17),
('¿El dolor se mueve hacia otra parte del cuerpo?','Anamnesis','Dolor','No.',18),
('¿El dolor aparece con esfuerzo?','Anamnesis','Dolor','No.',19),

-- =========================
-- ANTECEDENTES PERSONALES
-- =========================
('¿Tenés alguna enfermedad diagnosticada?','Anamnesis','Antecedentes personales','No.',20),
('¿Alguna vez te dijeron que tenés presión alta?','Anamnesis','Antecedentes personales','No.',21),
('¿Alguna vez te dijeron que tenés diabetes?','Anamnesis','Antecedentes personales','No.',22),
('¿Alguna vez te operaron?','Anamnesis','Antecedentes personales','No.',23),
('¿Alguna vez estuviste internado?','Anamnesis','Antecedentes personales','No.',24),
('¿Tuviste alguna fractura?','Anamnesis','Antecedentes personales','No.',25),
('¿Tuviste accidentes importantes?','Anamnesis','Antecedentes personales','No.',26),

-- =========================
-- MEDICACIÓN
-- =========================
('¿Tomás algún medicamento?','Anamnesis','Medicación','No.',27),
('¿Tomás vitaminas o suplementos?','Anamnesis','Medicación','A veces.',28),
('¿Tomás medicamentos sin receta?','Anamnesis','Medicación','No.',29),

-- =========================
-- ALERGIAS
-- =========================
('¿Sos alérgico a algún medicamento?','Anamnesis','Alergias','No.',30),
('¿Tenés alergia a alimentos?','Anamnesis','Alergias','No.',31),
('¿Tenés alergia ambiental (polvo, polen)?','Anamnesis','Alergias','No.',32),

-- =========================
-- ANTECEDENTES FAMILIARES
-- =========================
('¿Algún familiar tiene diabetes?','Anamnesis','Antecedentes familiares','No.',33),
('¿Algún familiar tiene presión alta?','Anamnesis','Antecedentes familiares','No.',34),
('¿Algún familiar tuvo infarto?','Anamnesis','Antecedentes familiares','No.',35),
('¿Algún familiar tuvo ACV?','Anamnesis','Antecedentes familiares','No.',36),
('¿Algún familiar tuvo cáncer?','Anamnesis','Antecedentes familiares','No.',37),

-- =========================
-- HÁBITOS
-- =========================
('¿Fumás?','Anamnesis','Hábitos','No.',38),
('¿Fumaste alguna vez?','Anamnesis','Hábitos','No.',39),
('¿Tomás alcohol?','Anamnesis','Hábitos','Solo ocasionalmente.',40),
('¿Consumís drogas recreativas?','Anamnesis','Hábitos','No.',41),
('¿Hacés actividad física?','Anamnesis','Hábitos','Sí.',42),
('¿Cuántas veces por semana hacés ejercicio?','Anamnesis','Hábitos','Tres veces por semana.',43),
('¿Qué tipo de ejercicio hacés?','Anamnesis','Hábitos','Caminar o gimnasio.',44),

-- =========================
-- SUEÑO
-- =========================
('¿Dormís bien?','Anamnesis','Sueño','Sí.',45),
('¿Cuántas horas dormís por noche?','Anamnesis','Sueño','Unas 7 horas.',46),
('¿Te despertás durante la noche?','Anamnesis','Sueño','No.',47),
('¿Roncás al dormir?','Anamnesis','Sueño','No que yo sepa.',48),
('¿Te sentís descansado al levantarte?','Anamnesis','Sueño','Sí.',49),

-- =========================
-- SÍNTOMAS GENERALES
-- =========================
('¿Tuviste fiebre recientemente?','Anamnesis','Síntomas generales','No.',50),

-- =========================
-- RESPIRATORIO
-- =========================
('¿Tenés tos?','Anamnesis','Respiratorio','No.',51),
('¿Hace cuánto tenés tos?','Anamnesis','Respiratorio','No tengo tos.',52),
('¿La tos tiene flema?','Anamnesis','Respiratorio','No.',53),
('¿La flema tiene sangre?','Anamnesis','Respiratorio','No.',54),
('¿Te falta el aire al caminar o hacer esfuerzo?','Anamnesis','Respiratorio','No.',55),
('¿Te falta el aire incluso estando en reposo?','Anamnesis','Respiratorio','No.',56),
('¿Te despertás de noche por falta de aire?','Anamnesis','Respiratorio','No.',57),
('¿Sentís opresión en el pecho al respirar?','Anamnesis','Respiratorio','No.',58),
('¿Tuviste infecciones respiratorias frecuentes?','Anamnesis','Respiratorio','No.',59),
('¿Alguna vez usaste inhaladores?','Anamnesis','Respiratorio','No.',60),

-- =========================
-- CARDIOVASCULAR
-- =========================
('¿Sentís palpitaciones o latidos fuertes del corazón?','Anamnesis','Cardiovascular','No.',61),
('¿Sentís presión o dolor en el pecho?','Anamnesis','Cardiovascular','No.',62),
('¿Te falta el aire al subir escaleras?','Anamnesis','Cardiovascular','No.',63),
('¿Se te hinchan los pies o tobillos?','Anamnesis','Cardiovascular','No.',64),
('¿Alguna vez te dijeron que tenés soplo cardíaco?','Anamnesis','Cardiovascular','No.',65),
('¿Te cansás más rápido que otras personas al caminar?','Anamnesis','Cardiovascular','No.',66),
('¿Alguna vez tuviste dolor en el pecho al hacer esfuerzo?','Anamnesis','Cardiovascular','No.',67),
('¿Te mareás cuando te levantás rápido?','Anamnesis','Cardiovascular','No.',68),
('¿Alguna vez te desmayaste?','Anamnesis','Cardiovascular','No.',69),
('¿Te controlaste la presión arterial alguna vez?','Anamnesis','Cardiovascular','Sí, en controles médicos.',70),

-- =========================
-- GASTROINTESTINAL
-- =========================
('¿Tenés náuseas?','Anamnesis','Gastrointestinal','No.',71),
('¿Estuviste vomitando últimamente?','Anamnesis','Gastrointestinal','No.',72),
('¿Tenés dolor en la panza?','Anamnesis','Gastrointestinal','No.',73),
('¿Dónde sentís el dolor en la panza?','Anamnesis','Gastrointestinal','No tengo dolor.',74),
('¿Tenés diarrea?','Anamnesis','Gastrointestinal','No.',75),
('¿Estás estreñido últimamente?','Anamnesis','Gastrointestinal','No.',76),
('¿Notaste sangre en la materia fecal?','Anamnesis','Gastrointestinal','No.',77),
('¿Sentís acidez después de comer?','Anamnesis','Gastrointestinal','No.',78),
('¿Tenés dificultad para tragar alimentos?','Anamnesis','Gastrointestinal','No.',79),
('¿Cómo es tu apetito?','Anamnesis','Gastrointestinal','Normal.',80),

-- =========================
-- URINARIO
-- =========================
('¿Te arde al orinar?','Anamnesis','Urinario','No.',81),
('¿Orinás más seguido de lo normal?','Anamnesis','Urinario','No.',82),
('¿Te levantás de noche para orinar?','Anamnesis','Urinario','No.',83),
('¿Notaste sangre en la orina?','Anamnesis','Urinario','No.',84),
('¿Sentís urgencia para orinar?','Anamnesis','Urinario','No.',85),
('¿Tenés dificultad para empezar a orinar?','Anamnesis','Urinario','No.',86),
('¿El chorro de orina es normal?','Anamnesis','Urinario','Sí.',87),
('¿Sentís que la vejiga queda vacía después de orinar?','Anamnesis','Urinario','Sí.',88),
('¿Tuviste infecciones urinarias antes?','Anamnesis','Urinario','No.',89),
('¿Tenés dolor en la parte baja de la espalda?','Anamnesis','Urinario','No.',90),

-- =========================
-- NEUROLÓGICO
-- =========================
('¿Tuviste dolor de cabeza recientemente?','Anamnesis','Neurológico','No.',91),
('¿Sentiste mareos?','Anamnesis','Neurológico','No.',92),
('¿Perdiste el conocimiento en algún momento?','Anamnesis','Neurológico','No.',93),
('¿Sentís debilidad en alguna parte del cuerpo?','Anamnesis','Neurológico','No.',94),
('¿Tenés hormigueo en brazos o piernas?','Anamnesis','Neurológico','No.',95),
('¿Tenés problemas de memoria?','Anamnesis','Neurológico','No.',96),
('¿Te cuesta mantener el equilibrio?','Anamnesis','Neurológico','No.',97),
('¿Tenés temblores en las manos?','Anamnesis','Neurológico','No.',98),
('¿Tenés dificultad para hablar?','Anamnesis','Neurológico','No.',99),
('¿Tenés problemas para ver claramente?','Anamnesis','Neurológico','No.',100),

-- =========================
-- SALUD MENTAL
-- =========================
('¿Te sentís ansioso con frecuencia?','Anamnesis','Salud mental','No.',101),
('¿Te sentís triste o desanimado la mayor parte del tiempo?','Anamnesis','Salud mental','No.',102),
('¿Tenés dificultad para concentrarte?','Anamnesis','Salud mental','No.',103),
('¿Dormís mal por estrés?','Anamnesis','Salud mental','No.',104),
('¿Tenés buen ánimo en general?','Anamnesis','Salud mental','Sí.',105),

-- =========================
-- SEXUAL
-- =========================
('¿Tenés pareja sexual actualmente?','Anamnesis','Sexual','Sí.',106),
('¿Usás protección en tus relaciones sexuales?','Anamnesis','Sexual','Sí.',107),
('¿Tuviste infecciones de transmisión sexual?','Anamnesis','Sexual','No.',108),

-- =========================
-- VACUNACIÓN
-- =========================
('¿Tenés el calendario de vacunas al día?','Anamnesis','Vacunación','Sí.',109),
('¿Recibiste vacuna contra COVID recientemente?','Anamnesis','Vacunación','Sí.',110),
('¿Te vacunaste contra la gripe este año?','Anamnesis','Vacunación','Sí.',111),

-- =========================
-- SOCIAL
-- =========================
('¿Trabajás actualmente?','Anamnesis','Social','Sí.',112),
('¿Tu trabajo implica esfuerzo físico?','Anamnesis','Social','No.',113),
('¿Tenés apoyo de tu familia?','Anamnesis','Social','Sí.',114),
('¿Vivís en un ambiente seguro?','Anamnesis','Social','Sí.',115),
('¿Tenés acceso fácil a atención médica?','Anamnesis','Social','Sí.',116),

-- =========================
-- GENERAL
-- =========================
('¿Te sentís sano en general?','Anamnesis','General','Sí.',117),
('¿Cómo describirías tu estado de salud?','Anamnesis','General','Bueno.',118),
('¿Tu salud limita tus actividades?','Anamnesis','General','No.',119),
('¿Tenés algún problema de salud actualmente?','Anamnesis','General','No.',120),
('¿Te controlás con médicos regularmente?','Anamnesis','General','Sí.',121),
('¿Te hacés análisis de sangre periódicamente?','Anamnesis','General','Sí.',122),
('¿Te controlás el colesterol?','Anamnesis','General','Sí.',123),
('¿Intentás mantener hábitos saludables?','Anamnesis','General','Sí.',124),
('¿Hacés ejercicio regularmente?','Anamnesis','General','Sí.',125),
('¿Te sentís con energía para tus actividades diarias?','Anamnesis','General','Sí.',126),
('¿Podés hacer ejercicio sin problemas?','Anamnesis','General','Sí.',127),
('¿Estás satisfecho con tu calidad de vida?','Anamnesis','General','Sí.',128),
('¿Hay algo que te preocupe sobre tu salud futura?','Anamnesis','General','No.',129),
('¿Tenés algún síntoma que no mencionamos?','Anamnesis','General','No.',130),
('¿Hay algo más sobre tu salud que te gustaría contar?','Anamnesis','General','No.',131),
('¿Tenés alguna pregunta para el médico?','Anamnesis','General','No.',132),
('¿Dormís bien la mayoría de las noches?','Anamnesis','General','Sí.',133),
('¿Te alimentás de forma equilibrada?','Anamnesis','General','Sí.',134),
('¿Tomás suficiente agua durante el día?','Anamnesis','General','Sí.',135),
('¿Evitás el consumo de tabaco?','Anamnesis','General','Sí.',136),
('¿Evitás el consumo excesivo de alcohol?','Anamnesis','General','Sí.',137),
('¿Te hacés controles odontológicos periódicos?','Anamnesis','General','Sí.',138),
('¿Te realizaste chequeos médicos en el último año?','Anamnesis','General','Sí.',139),
('¿Querés agregar algo más sobre tu salud?','Anamnesis','General','No.',140),
('¿Te sentís con buen estado de ánimo la mayor parte del tiempo?','Anamnesis','General','Sí.',141),
('¿Tu alimentación incluye frutas y verduras regularmente?','Anamnesis','General','Sí.',142),
('¿Consumís suficiente proteína en tu dieta?','Anamnesis','General','Sí.',143),
('¿Mantenés un peso estable?','Anamnesis','General','Sí.',144),
('¿Realizás actividad física al menos tres veces por semana?','Anamnesis','General','Sí.',145),
('¿Tenés tiempo para descansar durante la semana?','Anamnesis','General','Sí.',146),
('¿Te sentís satisfecho con tu rutina diaria?','Anamnesis','General','Sí.',147),
('¿Tenés hábitos que considerás saludables?','Anamnesis','General','Sí.',148),
('¿Te sentís apoyado por tu entorno social?','Anamnesis','General','Sí.',149),
('¿Considerás que tu salud es buena actualmente?','Anamnesis','General','Sí.',150);