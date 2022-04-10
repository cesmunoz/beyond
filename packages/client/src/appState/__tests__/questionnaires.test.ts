import questionnairesReducer, { getQuestionnairesSuccess } from 'appState/questionnaires';

describe('questionnaires', () => {
  describe('reducer', () => {
    it('should update reducer correctly', () => {
      const questionnaireType = 'INDIVIDUAL';
      const currentVersion = 1;

      const state = questionnairesReducer(
        undefined,
        getQuestionnairesSuccess()({
          endpoint: '',
          headers: {},
          data: [
            {
              version: '0',
              currentVersion: '1',
              questionnaireType: 'INDIVIDUAL',
              questionnaire: [
                {
                  category: 'Introvertido/Extrovertido',
                  questions: [
                    {
                      type: 'rate',
                      question:
                        'Te resulta difícil presentarte a vos mismo ante otras personas (5 es Introvertido)',
                      id: 1,
                      evaluator: 'sarasa',
                    },
                  ],
                },
              ],
            },
          ],
        }),
      );

      const key = `${questionnaireType}_${currentVersion}`;

      expect(state[key].currentVersion).toEqual(currentVersion.toString());
      expect(state[key].questionnaireType).toEqual(questionnaireType);

      expect(state[key].questionnaire[0].questions[0].id).toBe(1);
      expect(state[key].questionnaire[0].questions[0].type).toBe('rate');
      expect(state[key].questionnaire[0].questions[0].question).toBe(
        'Te resulta difícil presentarte a vos mismo ante otras personas (5 es Introvertido)',
      );
    });
  });
});
