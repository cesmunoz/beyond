import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApplicationResponse, created, success, error } from '../../../shared/util/HttpResponse';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import { insert } from '../../../shared/util/DynamoIO';

const data = [
  {
    email: 'cmunoz@morean.co',
    fullName: 'Cesar Munoz',
    GS1PK: 'COACH#cmunoz@morean.co',
    GS1SK: '#METADATA#cmunoz@morean.co',
    PK: 'COACH#cmunoz@morean.co',
    SK: '#METADATA#cmunoz@morean.co',
  },
  {
    company: 'Viemed',
    email: 'federicoalecci@gmail.com',
    fullName: 'Federico Alecci',
    PK: 'COACH#cmunoz@morean.co',
    SK: 'COACHEE#federicoalecci@gmail.com',
    userId: '2c17a0f3-be99-4b1a-a04a-199eb16965f3',
  },
  {
    coachees: [
      {
        company: 'Viemed',
        email: 'federicoalecci@gmail.com',
        fullName: 'Federico Alecci',
      },
    ],
    collaborators: [
      {
        company: 'Viemed',
        email: 'federicoalecci@gmail.com',
        fullName: 'Federico Alecci',
      },
    ],
    createdDate: '2020-09-18T05:43:36Z',
    PK: 'COACH#cmunoz@morean.co',
    processId: '1hfgygJ54S53pMfPWZwSuhSHqls',
    SK: 'PROCESS#1hfgygJ54S53pMfPWZwSuhSHqls',
    status: 0,
    type: 'equipo',
  },
  {
    email: 'falecci@morean.co',
    fullName: 'Federico Alecci',
    GS1PK: 'COACH#falecci@morean.co',
    GS1SK: '#METADATA#falecci@morean.co',
    PK: 'COACH#falecci@morean.co',
    SK: '#METADATA#falecci@morean.co',
  },
  {
    company: 'Viemed',
    email: 'federicoalecci@gmail.com',
    fullName: 'Federico Alecci',
    PK: 'COACH#falecci@morean.co',
    SK: 'COACHEE#federicoalecci@gmail.com',
    userId: '2c17a0f3-be99-4b1a-a04a-199eb16965f3',
  },
  {
    coachees: [
      {
        company: 'Viemed',
        email: 'federicoalecci@gmail.com',
        fullName: 'Federico Alecci',
      },
    ],
    collaborators: [
      {
        company: 'Viemed',
        email: 'federicoalecci@gmail.com',
        fullName: 'Federico Alecci',
      },
    ],
    createdDate: '2020-09-18T05:43:36Z',
    PK: 'COACH#falecci@morean.co',
    processId: '1hfgygJ54S53pMfPWZwSuhSHqls',
    SK: 'PROCESS#1hfgygJ54S53pMfPWZwSuhSHqls',
    status: 0,
    type: 'equipo',
  },
  {
    company: 'Viemed',
    email: 'federicoalecci@gmail.com',
    fullName: 'Federico Alecci',
    PK: 'COACHEE#federicoalecci@gmail.com',
    SK: '#METADATA#federicoalecci@gmail.com',
    userId: '2c17a0f3-be99-4b1a-a04a-199eb16965f3',
  },
  {
    coachees: [
      {
        company: 'Viemed',
        email: 'federicoalecci@gmail.com',
        fullName: 'Federico Alecci',
      },
    ],
    collaborators: [
      {
        company: 'Viemed',
        email: 'federicoalecci@gmail.com',
        fullName: 'Federico Alecci',
      },
    ],
    createdDate: '2020-09-18T05:43:36Z',
    PK: 'COACHEE#federicoalecci@gmail.com',
    processId: '1hfgygJ54S53pMfPWZwSuhSHqls',
    SK: 'PROCESS#1hfgygJ54S53pMfPWZwSuhSHqls',
    status: 0,
    type: 'equipo',
  },
  {
    currentVersion: 1,
    PK: 'FORMS#INDIVIDUAL',
    questionnaire: [
      {
        category: 'Introvertido/Extrovertido',
        questions: [
          {
            id: 1,
            question: 'Te resulta difícil presentarte a vos mismo ante otras personas',
            type: 'rate',
          },
          {
            id: 2,
            question:
              'Te sentís más cómodo y productivo en un entorno silencioso y calmo que en medio del ruido y rodeado de otras personas',
            type: 'rate',
          },
          {
            id: 3,
            question: 'No te importa ni te incomoda ser el centro de atención',
            type: 'rate',
          },
          {
            id: 4,
            question:
              'No te lleva mucho tiempo comenzar a integrarte en actividades sociales en tu nuevo entorno de trabajo',
            type: 'rate',
          },
          {
            id: 5,
            question: 'Te considerás una persona relativamente reservada y callada',
            type: 'rate',
          },
          {
            id: 6,
            question:
              'Te sentís más energizado y dinámico después de pasar tiempo con un grupo de personas',
            type: 'rate',
          },
          {
            id: 7,
            question: 'Tomás la iniciativa frecuentemente en situaciones sociales',
            type: 'rate',
          },
        ],
      },
      {
        category: 'Emocional/Mental',
        questions: [
          {
            id: 1,
            question: 'Es muy raro que la gente te haga sentir alterado o molesto',
            type: 'rate',
          },
          {
            id: 2,
            question:
              'Con frecuencia te resulta difícil entender los sentimientos de otras personas',
            type: 'rate',
          },
          {
            id: 3,
            question: 'Te resulta difícil distinguir tus emociones y ponerle nombre',
            type: 'rate',
          },
          {
            id: 4,
            question: 'Tu estado de ánimo o humor puede cambiar muy rápidamente',
            type: 'rate',
          },
          {
            id: 5,
            question: 'Tus emociones te controlan más de lo que vos las controlás a ellas',
            type: 'rate',
          },
          {
            id: 6,
            question:
              'Considerás que la lógica generalmente es más importante que el corazón cuando se trata de tomar decisiones importantes',
            type: 'rate',
          },
          {
            id: 7,
            question:
              'Si tu amigo o colega se siente triste por algo es más probable que le ofrezcas apoyo emocional que sugerirle formas de tratar el problema',
            type: 'rate',
          },
        ],
      },
      {
        category: 'Ejecución/Idealista',
        questions: [
          {
            id: 1,
            question: 'Te considerás una persona más práctica que creativa',
            type: 'rate',
          },
          {
            id: 2,
            question: 'Te ponés nervioso cuando las cosas no se concretan rápido',
            type: 'rate',
          },
          {
            id: 3,
            question:
              'Ser capaz de desarrollar un buen plan es la parte más importante de todo proyecto',
            type: 'rate',
          },
          {
            id: 4,
            question: 'Es muy raro que te dejes llevar por fantasías y sueños',
            type: 'rate',
          },
          {
            id: 5,
            question: 'Sos más una persona de acción que un planificador detallista',
            type: 'rate',
          },
          {
            id: 6,
            question: 'A menudo pasás tiempo explorando ideas poco prácticas pero interesantes',
            type: 'rate',
          },
          {
            id: 7,
            question: 'Por lo general confiás más en tu experiencia que en tu imaginación',
            type: 'rate',
          },
        ],
      },
    ],
    questionnaireType: 'INDIVIDUAL',
    SK: 'v0',
  },
  {
    currentVersion: 1,
    PK: 'FORMS#INDIVIDUAL',
    questionnaire: [
      {
        category: 'Introvertido/Extrovertido',
        questions: [
          {
            id: 1,
            question: 'Te resulta difícil presentarte a vos mismo ante otras personas',
            type: 'rate',
          },
          {
            id: 2,
            question:
              'Te sentís más cómodo y productivo en un entorno silencioso y calmo que en medio del ruido y rodeado de otras personas',
            type: 'rate',
          },
          {
            id: 3,
            question: 'No te importa ni te incomoda ser el centro de atención',
            type: 'rate',
          },
          {
            id: 4,
            question:
              'No te lleva mucho tiempo comenzar a integrarte en actividades sociales en tu nuevo entorno de trabajo',
            type: 'rate',
          },
          {
            id: 5,
            question: 'Te considerás una persona relativamente reservada y callada',
            type: 'rate',
          },
          {
            id: 6,
            question:
              'Te sentís más energizado y dinámico después de pasar tiempo con un grupo de personas',
            type: 'rate',
          },
          {
            id: 7,
            question: 'Tomás la iniciativa frecuentemente en situaciones sociales',
            type: 'rate',
          },
        ],
      },
      {
        category: 'Emocional/Mental',
        questions: [
          {
            id: 1,
            question: 'Es muy raro que la gente te haga sentir alterado o molesto',
            type: 'rate',
          },
          {
            id: 2,
            question:
              'Con frecuencia te resulta difícil entender los sentimientos de otras personas',
            type: 'rate',
          },
          {
            id: 3,
            question: 'Te resulta difícil distinguir tus emociones y ponerle nombre',
            type: 'rate',
          },
          {
            id: 4,
            question: 'Tu estado de ánimo o humor puede cambiar muy rápidamente',
            type: 'rate',
          },
          {
            id: 5,
            question: 'Tus emociones te controlan más de lo que vos las controlás a ellas',
            type: 'rate',
          },
          {
            id: 6,
            question:
              'Considerás que la lógica generalmente es más importante que el corazón cuando se trata de tomar decisiones importantes',
            type: 'rate',
          },
          {
            id: 7,
            question:
              'Si tu amigo o colega se siente triste por algo es más probable que le ofrezcas apoyo emocional que sugerirle formas de tratar el problema',
            type: 'rate',
          },
        ],
      },
      {
        category: 'Ejecución/Idealista',
        questions: [
          {
            id: 1,
            question: 'Te considerás una persona más práctica que creativa',
            type: 'rate',
          },
          {
            id: 2,
            question: 'Te ponés nervioso cuando las cosas no se concretan rápido',
            type: 'rate',
          },
          {
            id: 3,
            question:
              'Ser capaz de desarrollar un buen plan es la parte más importante de todo proyecto',
            type: 'rate',
          },
          {
            id: 4,
            question: 'Es muy raro que te dejes llevar por fantasías y sueños',
            type: 'rate',
          },
          {
            id: 5,
            question: 'Sos más una persona de acción que un planificador detallista',
            type: 'rate',
          },
          {
            id: 6,
            question: 'A menudo pasás tiempo explorando ideas poco prácticas pero interesantes',
            type: 'rate',
          },
          {
            id: 7,
            question: 'Por lo general confiás más en tu experiencia que en tu imaginación',
            type: 'rate',
          },
        ],
      },
    ],
    questionnaireType: 'INDIVIDUAL',
    SK: 'v1',
  },
  {
    currentVersion: 1,
    PK: 'FORMS#TEAM',
    questionnaire: [
      {
        category: 'Objetivos_y_Roles',
        questions: [
          {
            id: 1,
            question:
              'El equipo tiene un propósito común que es inspirador, entusiasma a sus miembros, y es compartido por todos',
            type: 'rate',
          },
          {
            id: 2,
            question: 'El equipo tiene claros sus objetivos o metas de desempeño',
            type: 'rate',
          },
          {
            id: 3,
            question: 'Los roles dentro del equipo están claramente definidos y acordados',
            type: 'rate',
          },
          {
            id: 4,
            question:
              'El rol del líder está claramente definido y es reconocido por los miembros del equipo',
            type: 'rate',
          },
        ],
      },
      {
        category: 'Acuerdos_y_manejo_de_desacuerdos',
        questions: [
          {
            id: 5,
            question:
              'Existen acuerdos operativos o reglas de funcionamiento definidas para el equipo',
            type: 'rate',
          },
          {
            id: 6,
            question:
              'Los miembros del equipo cumplen con los acuerdos y hay un alto grado de compromiso',
            type: 'rate',
          },
          {
            id: 7,
            question:
              'Se respetan los tiempos de los miembros del equipo en las reuniones, trabajos y toma de decisiones',
            type: 'rate',
          },
          {
            id: 8,
            question: 'Los conflictos se tratan de manera abierta y se resuelven constructivamente',
            type: 'rate',
          },
        ],
      },
      {
        category: 'Comunicacion ',
        questions: [
          {
            id: 9,
            question:
              'La información circula con la fluidez necesaria para tomar decisiones y que todos los miembros puedan aportar',
            type: 'rate',
          },
          {
            id: 10,
            question:
              'Existe apertura en el equipo para escucharse unos a otros sin juzgarse y dar la opinión propia de forma respetuosa',
            type: 'rate',
          },
          {
            id: 11,
            question: 'Los miembros del equipo se dan y reciben feedback de manera constructiva',
            type: 'rate',
          },
          {
            id: 12,
            question:
              'Hay confianza en el equipo, sobre las habilidades, intenciones y colaboración de cada uno, se respeta la confidencialidad y se limita el radiopasillo',
            type: 'rate',
          },
        ],
      },
      {
        category: 'Motivacion_y_trabajo_en_equipo',
        questions: [
          {
            id: 13,
            question:
              'Las emociones están presentes en el día a día del equipo, y se aprovecha su energía para el logro de los resultados',
            type: 'rate',
          },
          {
            id: 14,
            question:
              'Hay reconocimiento y celebración, tanto de los logros comunes como los individuales',
            type: 'rate',
          },
          {
            id: 15,
            question:
              'Los miembros del equipo disfrutan de trabajar juntos, y esto se contagia a otros en la organización',
            type: 'rate',
          },
          {
            id: 16,
            question:
              'El equipo prioriza tanto los logros y resultados de equipo, como las relaciones y el bienestar de las personas',
            type: 'rate',
          },
        ],
      },
      {
        category: 'Gestion de cambios e innovacion',
        questions: [
          {
            id: 17,
            question:
              'En el equipo predomina un clima de entusiasmo y de optimismo ante los desafíos',
            type: 'rate',
          },
          {
            id: 18,
            question: 'Los miembros del equipo están abiertos al cambio y a la innovación ',
            type: 'rate',
          },
          {
            id: 19,
            question:
              'Los miembros del equipo se relacionan de manera colaborativa con otros equipos',
            type: 'rate',
          },
          {
            id: 20,
            question:
              'Los estilos diversos de cada miembro del equipo son aceptados, valorados y aprovechados',
            type: 'rate',
          },
        ],
      },
    ],
    questionnaireType: 'TEAM',
    SK: 'v0',
  },
  {
    currentVersion: 1,
    PK: 'FORMS#TEAM',
    questionnaire: [
      {
        category: 'Objetivos_y_Roles',
        questions: [
          {
            id: 1,
            question:
              'El equipo tiene un propósito común que es inspirador, entusiasma a sus miembros, y es compartido por todos',
            type: 'rate',
          },
          {
            id: 2,
            question: 'El equipo tiene claros sus objetivos o metas de desempeño',
            type: 'rate',
          },
          {
            id: 3,
            question: 'Los roles dentro del equipo están claramente definidos y acordados',
            type: 'rate',
          },
          {
            id: 4,
            question:
              'El rol del líder está claramente definido y es reconocido por los miembros del equipo',
            type: 'rate',
          },
        ],
      },
      {
        category: 'Acuerdos_y_manejo_de_desacuerdos',
        questions: [
          {
            id: 5,
            question:
              'Existen acuerdos operativos o reglas de funcionamiento definidas para el equipo',
            type: 'rate',
          },
          {
            id: 6,
            question:
              'Los miembros del equipo cumplen con los acuerdos y hay un alto grado de compromiso',
            type: 'rate',
          },
          {
            id: 7,
            question:
              'Se respetan los tiempos de los miembros del equipo en las reuniones, trabajos y toma de decisiones',
            type: 'rate',
          },
          {
            id: 8,
            question: 'Los conflictos se tratan de manera abierta y se resuelven constructivamente',
            type: 'rate',
          },
        ],
      },
      {
        category: 'Comunicacion ',
        questions: [
          {
            id: 9,
            question:
              'La información circula con la fluidez necesaria para tomar decisiones y que todos los miembros puedan aportar',
            type: 'rate',
          },
          {
            id: 10,
            question:
              'Existe apertura en el equipo para escucharse unos a otros sin juzgarse y dar la opinión propia de forma respetuosa',
            type: 'rate',
          },
          {
            id: 11,
            question: 'Los miembros del equipo se dan y reciben feedback de manera constructiva',
            type: 'rate',
          },
          {
            id: 12,
            question:
              'Hay confianza en el equipo, sobre las habilidades, intenciones y colaboración de cada uno, se respeta la confidencialidad y se limita el radiopasillo',
            type: 'rate',
          },
        ],
      },
      {
        category: 'Motivacion_y_trabajo_en_equipo',
        questions: [
          {
            id: 13,
            question:
              'Las emociones están presentes en el día a día del equipo, y se aprovecha su energía para el logro de los resultados',
            type: 'rate',
          },
          {
            id: 14,
            question:
              'Hay reconocimiento y celebración, tanto de los logros comunes como los individuales',
            type: 'rate',
          },
          {
            id: 15,
            question:
              'Los miembros del equipo disfrutan de trabajar juntos, y esto se contagia a otros en la organización',
            type: 'rate',
          },
          {
            id: 16,
            question:
              'El equipo prioriza tanto los logros y resultados de equipo, como las relaciones y el bienestar de las personas',
            type: 'rate',
          },
        ],
      },
      {
        category: 'Gestion de cambios e innovacion',
        questions: [
          {
            id: 17,
            question:
              'En el equipo predomina un clima de entusiasmo y de optimismo ante los desafíos',
            type: 'rate',
          },
          {
            id: 18,
            question: 'Los miembros del equipo están abiertos al cambio y a la innovación ',
            type: 'rate',
          },
          {
            id: 19,
            question:
              'Los miembros del equipo se relacionan de manera colaborativa con otros equipos',
            type: 'rate',
          },
          {
            id: 20,
            question:
              'Los estilos diversos de cada miembro del equipo son aceptados, valorados y aprovechados',
            type: 'rate',
          },
        ],
      },
    ],
    questionnaireType: 'TEAM',
    SK: 'v1',
  },
  {
    coachees: [
      {
        company: 'Viemed',
        email: 'federicoalecci@gmail.com',
        fullName: 'Federico Alecci',
      },
    ],
    collaborators: [
      {
        company: 'Viemed',
        email: 'federicoalecci@gmail.com',
        fullName: 'Federico Alecci',
      },
    ],
    createdDate: '2020-09-18T05:43:36Z',
    form: [],
    formVersion: 1,
    owner: 'federicoalecci@gmail.com',
    PK: 'PROCESS#1hfgygJ54S53pMfPWZwSuhSHqls',
    processId: '1hfgygJ54S53pMfPWZwSuhSHqls',
    SK: '#METADATA#1hfgygJ54S53pMfPWZwSuhSHqls',
    status: 0,
    type: 'equipo',
  },
  {
    coachees: 1,
    finished: 0,
    pendingAnswers: 2,
    pendingReview: 0,
    PK: 'SUMMARY#SUMMARY',
    SK: 'SUMMARY',
  },
];

const process = async (): Promise<ApplicationResponse | ApplicationError> => {
  /* eslint-disable */
  for (const item of data) {
    await insert({
      TableName: 'Beyond',
      Item: item,
    });
  }
  /* eslint-enable */

  return created({
    message: 'Operation Successful',
  });
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  process().then(success).catch(error);
