import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { getCoacheeSelector } from 'selectors/coachees';
import { getCoachee } from 'api/coachees';
import useTypedSelector from 'selectors/typedSelector';
import CoacheeCard from 'components/CoacheeCard';
import CoacheeInfo from 'components/CoacheeInfo';
import ProcessCard from 'components/ProcessCard';
import Loading from 'components/Loading';

import useStyles from './styles';

type CoacheeDetailProps = {
  coacheeId: string;
};

const CoacheeDetail: React.FC<CoacheeDetailProps> = ({ coacheeId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const coachee = useTypedSelector(state => getCoacheeSelector(state, coacheeId));
  const {
    loading: { coacheeDetail: loading },
    mobile,
  } = useTypedSelector(state => state);

  React.useEffect(() => {
    if (!coacheeId) {
      return;
    }

    dispatch(getCoachee(coacheeId));
  }, [coacheeId]);

  return (
    <div
      className={cn('divide-y divide-gray-400 align-middle', {
        'overflow-y-scroll': mobile,
      })}
    >
      {!loading && coachee !== undefined && coachee.processes !== undefined ? (
        <>
          <div className="py-2 mb-10">
            <CoacheeCard
              coacheeId={coachee.coacheeId || coachee.email}
              company={coachee.company}
              displayName={coachee.fullName ? coachee.fullName : null}
              email={coachee.email}
              status={coachee.status}
              isDetail
            />
          </div>
          <div className="py-8 pr-6">
            <p className={cn('font-bold', classes.sectionText)}>Datos Personales</p>
            <CoacheeInfo
              birthCity={coachee.city}
              birthCountry={coachee.country}
              birthDate={coachee.birthDate}
              birthTime={coachee.birthTime}
            />
          </div>
          <div className="py-8 pr-6">
            <p className={cn('font-bold pb-8', classes.sectionText)}>Procesos</p>
            <ProcessCard
              coachee={coachee.fullName}
              company={coachee.company}
              processes={coachee.processes}
              isDetail
            />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

CoacheeDetail.propTypes = {
  coacheeId: PropTypes.string.isRequired,
};

export default CoacheeDetail;
