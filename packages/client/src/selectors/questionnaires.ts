import { RootState } from 'store';
import { QuestionnaireSection } from 'appState/questionnaires';
import { ValidAny } from '@beyond/lib/types';
import { ProcessType } from '@beyond/lib/enums';
import { parseProcessKey } from 'utils/processes';

export const getQuestionnaireByTypeAndVersion = (
  state: RootState,
  formType: string,
  formVersion: number,
  processId: string,
): QuestionnaireSection[] => {
  if (!formType) {
    return [];
  }

  const [id, email] = parseProcessKey(processId);

  const process = state.processes[id];

  if (!process) {
    return [];
  }

  const realFormType = formType === 'equipo' ? 'team' : formType;

  const key = `${realFormType.toUpperCase()}_${formVersion || 1}`;
  const form = state.questionnaires[key];

  if (!form) {
    return [];
  }

  const result = {
    ...form,
    questionnaire: form.questionnaire
      .filter(q => !q.onlyEvaluator)
      .map(section => ({
        ...section,
        category: section.category.replace(/_/g, ' '),
        questions: section.questions.map(question => {
          let value = 0;

          const questionnaire =
            process.type === ProcessType.TEAM
              ? (process.collaborators &&
                  process.collaborators.find(c => c.email === email)?.answers) ||
                {}
              : process.questionnaire;

          if (questionnaire && questionnaire[section.category]) {
            value = questionnaire[section.category].find((x: ValidAny) => x.id === question.id)
              .value;
          }

          return {
            ...question,
            value,
          };
        }),
      })),
  };

  return result.questionnaire;
};
