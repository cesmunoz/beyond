import Link from 'next/link';
import cn from 'classnames';

import { faCheckCircle, faHourglassStart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ValidAny } from '@beyond/lib/types';

import useTypedSelector from 'selectors/typedSelector';
import { ProcessEvaluators } from 'appState/processes';
import { createProcessKey } from 'utils/processes';
import useStyles from './styles';

type ProcessEvaluatorsProps = {
  evaluators: ProcessEvaluators[];
  processId: string;
};

const ProcessEvaluatorsSummary = ({
  processId,
  evaluators,
}: ProcessEvaluatorsProps): JSX.Element => {
  const { mobile } = useTypedSelector(state => state);
  const classes = useStyles();

  return (
    <>
      {evaluators &&
        evaluators.map((e: ValidAny) => {
          const fullName = e.personalInfo
            ? e.personalInfo.fullName || e.personalInfo.email
            : e.fullName || e.email;

          return (
            <div className="border-t border-b border-gray-200">
              <div className="flex">
                <Link href={`/processes?id=${createProcessKey(processId, e.email)}`}>
                  <div className={cn(classes.container, 'w-full flex items-center cursor-pointer')}>
                    <div
                      className={cn(classes.base, classes.label, {
                        [classes.labelMobile]: mobile,
                      })}
                    >
                      {fullName}
                    </div>
                    <div className={cn(classes.base, classes.status)}>
                      {e.answers ? (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          style={{
                            color: '#74c174',
                          }}
                        />
                      ) : (
                        <FontAwesomeIcon icon={faHourglassStart} style={{ color: '#f77a65' }} />
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default ProcessEvaluatorsSummary;
