import { ProcessDetail } from 'appState/processes';
import Accordion from 'components/Accordion';
import { Avatar } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { UserType } from '@beyond/lib/types';
import { COACH } from '@beyond/lib/constants';
import { getInitials } from 'utils/textTransform';
import { ProcessType } from '@beyond/lib/enums';
import ProcessPersonalInfo from '../ProcessPersonalInfo';
import ProcessEvaluators from '../ProcessEvaluators';
import ProcessCoacheeAnswers from '../ProcessCoacheeAnswers';

type ProcessAnswersProps = {
  process: ProcessDetail;
  viewType: UserType;
};

const ProcessAnswers = ({ process, viewType }: ProcessAnswersProps): JSX.Element => {
  const sections = [
    {
      id: 1,
      title:
        process.type === ProcessType.SINGLE ? 'Cuestionario Individual' : 'Cuestionario de Equipo',
      isOpen: false,
      content: (
        <ProcessCoacheeAnswers
          processId={process.key}
          formType={process.type}
          formVersion={process.formVersion}
        />
      ),
    },
    {
      id: 3,
      title: process.type === ProcessType.SINGLE ? 'Evaluadores' : 'Equipo',
      isOpen: false,
      content: (
        <ProcessEvaluators processId={process.processId} evaluators={process.collaborators} />
      ),
    },
  ];

  if (process.type === ProcessType.SINGLE) {
    sections.unshift({
      id: 0,
      title: 'Información Personal',
      isOpen: true,
      content: <ProcessPersonalInfo process={process} />,
    });
  }

  return (
    <div className="py-2">
      <section className="shadow">
        {viewType === COACH && (
          <article className="border-b">
            <div className="border-l-2 border-transparent">
              <header className="flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none">
                <span className="text-grey-darkest font-thin text-xl">
                  <div>
                    <Avatar>{getInitials(process.mainCoachee.fullName)}</Avatar>
                  </div>
                </span>
                <span className="text-grey-darkest font-thin text-xl  md:w-3/4">
                  <div>{process.mainCoachee.fullName}</div>
                  <div>{process.mainCoachee.company}</div>
                </span>
                <div className="rounded-full w-7 h-7 flex items-center justify-center">
                  <MoreVertIcon />
                </div>
              </header>
            </div>
          </article>
        )}
        <Accordion items={sections} />
      </section>
    </div>
  );
};

export default ProcessAnswers;
