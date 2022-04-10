import { QuestionnaireSection } from 'appState/questionnaires';
import AnswersSection from './AnswerSection';
import AnswersItem from './AnswerItem';

type AnswersProps = {
  index: number;
  section: QuestionnaireSection;
};

const Answers = ({ section, index }: AnswersProps): JSX.Element => {
  return (
    <div>
      <AnswersSection category={section.category} />
      <div>
        {section.questions.map(question => (
          <AnswersItem
            key={`section_${index}_question_${question.id}`}
            question={question.question}
            value={question.value || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default Answers;
