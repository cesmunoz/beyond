import useTypedSelector from 'selectors/typedSelector';
import { getQuestionnaireByTypeAndVersion } from 'selectors/questionnaires';
import Answers from 'components/Answers';

type ProcessAnswersProps = {
  processId: string;
  formType: string;
  formVersion: number;
};

const ProcessCoacheeAnswers = ({
  processId,
  formType,
  formVersion,
}: ProcessAnswersProps): JSX.Element => {
  const questions = useTypedSelector(state =>
    getQuestionnaireByTypeAndVersion(state, formType, formVersion, processId),
  );

  return (
    <article className="border-b">
      <div>
        {questions.map((section, index) => (
          <Answers key={section.category} section={section} index={index} />
        ))}
      </div>
    </article>
  );
};

export default ProcessCoacheeAnswers;
