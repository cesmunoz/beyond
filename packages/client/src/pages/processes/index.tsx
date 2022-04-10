import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { COACH, COACHEE } from '@beyond/lib/constants';
import { ProcessFormData } from '@beyond/lib/types/processes';

import { Main } from 'components/Layout';
import { withAuth } from 'components/withAuth';
import ProcessCard from 'components/ProcessCard';
import ProcessDetail from 'components/ProcessDetail';
import ProcessModal from 'components/ProcessModal';
import TwoPanels from 'components/TwoPanels';

import { getProcesses, postProcess } from 'api/processes';
import { PROCESSES } from 'constants/routes';
import { groupProcessesByCoachee } from 'selectors/processes';
import useTypedSelector from 'selectors/typedSelector';
import APIStatus from 'constants/apiStatus';

const Processes: React.FC = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const coachees = useSelector(groupProcessesByCoachee);
  const [open, setOpen] = useState(false);
  const {
    mobile,
    auth: { role },
    api,
    loading: { processes: loading },
  } = useTypedSelector(state => state);
  const [selectedProcess, setSelectedProcess] = useState<null | string>(null);

  useEffect(() => {
    dispatch(getProcesses());
  }, []);

  useEffect(() => {
    if (api.newProcess === APIStatus.Success) {
      dispatch(getProcesses());
    }
  }, [api.newProcess]);

  const handleOnProcessClick = (processId?: string): void => {
    if (!processId) {
      return;
    }

    if (mobile) {
      router.push(`${PROCESSES}/[id]`, `${PROCESSES}/${processId}`);
      return;
    }

    router.replace(`${PROCESSES}?id=${processId}`);
    setSelectedProcess(processId);
  };

  useEffect(() => {
    const processId = router.query.id;

    if (!processId) {
      return;
    }

    handleOnProcessClick(processId as string);
  }, [router.query.id]);

  const handleOnNewProcessSubmit = (process: ProcessFormData): void => {
    dispatch(postProcess(process));
  };

  return (
    <Main activeMenu="Procesos">
      <ProcessModal
        onNewProcessSubmit={handleOnNewProcessSubmit}
        onClose={(): void => setOpen(false)}
        open={open}
      />
      <TwoPanels
        loading={loading}
        mobile={mobile}
        title="Proceso"
        hideNewButton={role !== COACH}
        onNewItemClick={(): void => setOpen(true)}
        isEmpty={!coachees || (coachees && coachees.length === 0)}
        leftPanel={
          coachees && coachees.length > 0 ? (
            Object.values(coachees).map(coachee => (
              <ProcessCard
                key={coachee.email}
                coachee={coachee.fullName}
                company={coachee.company}
                processes={coachee.processes}
                processSelected={selectedProcess}
                onClick={!mobile ? handleOnProcessClick : undefined}
              />
            ))
          ) : (
            <div className="font-bold text-center p-12">No hay procesos</div>
          )
        }
        rightPanel={
          selectedProcess ? (
            <ProcessDetail processKey={selectedProcess} />
          ) : (
            <div className="font-bold text-center p-12">
              Cliquea sobre algún proceso de la lista
            </div>
          )
        }
      />
    </Main>
  );
};

export default withAuth(Processes, [COACH, COACHEE]);
