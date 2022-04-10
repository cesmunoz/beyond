import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { COACH } from '@beyond/lib/constants';
import { CoacheeFormData } from '@beyond/lib/types/coachees';

import { Main } from 'components/Layout';
import { withAuth } from 'components/withAuth';
import CoacheeCard from 'components/CoacheeCard';
import CoacheeDetail from 'components/CoacheeDetail';
import CoacheeModal from 'components/CoacheeModal';
import TwoPanels from 'components/TwoPanels';

import { getCoachees, postCoachee } from 'api/coachees';
import { CoacheeSummary } from 'appState/coachees';
import { COACHEES } from 'constants/routes';
import useTypedSelector from 'selectors/typedSelector';

export const Coachees: React.FC = (): JSX.Element => {
  const router = useRouter();
  const [selectedCoachee, setSelectedCoachee] = React.useState<null | string>(null);
  const [open, setOpen] = useState(false);
  const {
    mobile,
    coachees,
    loading: { coachees: loading },
  } = useTypedSelector(state => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCoachees());
  }, []);

  const handleOnCoacheeClick = (coacheeId?: string) => (): void | Promise<boolean> => {
    if (!coacheeId) {
      return;
    }

    if (mobile) {
      Router.push(`${COACHEES}/[id]`, `${COACHEES}/${coacheeId}`);
      return;
    }

    router.replace(`${COACHEES}?id=${coacheeId}`);
    setSelectedCoachee(coacheeId);
  };

  useEffect(() => {
    const coacheeEmail = router.query.id;

    if (!coacheeEmail) {
      return;
    }

    handleOnCoacheeClick(coacheeEmail as string)();
  }, [router.query.id]);

  const handleOnNewCoacheeSubmit = (coachee: CoacheeFormData): void => {
    dispatch(postCoachee(coachee));
  };

  return (
    <Main activeMenu="Coachees">
      <CoacheeModal
        onNewCoacheeSubmit={handleOnNewCoacheeSubmit}
        onClose={(): void => setOpen(false)}
        open={open}
      />
      <TwoPanels
        loading={loading}
        mobile={mobile}
        title="Coachee"
        onNewItemClick={(): void => setOpen(true)}
        leftPanel={
          Object.values(coachees).length > 0 ? (
            Object.values(coachees).map((coachee: CoacheeSummary) => (
              <CoacheeCard
                key={coachee.coacheeId || coachee.email}
                selected={selectedCoachee === coachee.email}
                coacheeId={coachee.coacheeId || coachee.email}
                company={coachee.company}
                displayName={coachee.fullName ? coachee.fullName : coachee.email}
                email={coachee.email}
                status={coachee.status}
                onClick={handleOnCoacheeClick(coachee.email)}
              />
            ))
          ) : (
            <div className="font-bold text-center p-12">No hay coachees</div>
          )
        }
        isEmpty={Object.values(coachees).length === 0}
        rightPanel={
          selectedCoachee ? (
            <CoacheeDetail coacheeId={selectedCoachee} />
          ) : (
            <div className="font-bold text-center p-12">
              Cliquea sobre algún coachee de la lista
            </div>
          )
        }
      />
    </Main>
  );
};

export default withAuth(Coachees, [COACH]);
