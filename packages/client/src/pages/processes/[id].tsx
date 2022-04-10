import React from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { COACH, COACHEE } from '@beyond/lib/constants';
import { withAuth } from 'components/withAuth';
import { Main } from 'components/Layout';
import ProcessDetail from 'components/ProcessDetail';
import useTypedSelector from 'selectors/typedSelector';

export const ProcessDetailPage: React.FC = (): JSX.Element => {
  const { mobile } = useTypedSelector(state => state);

  const router = useRouter();
  const { id } = router.query;
  const processId = Array.isArray(id) ? id[0] : id;

  return (
    <Main activeMenu="Procesos">
      <div
        className={cn('flex flex-col justify-between h-full w-full', {
          'p-12': !mobile,
          'p-4 py-20 bg-white': mobile,
        })}
      >
        <ProcessDetail processKey={processId} />
      </div>
    </Main>
  );
};

export default withAuth(ProcessDetailPage, [COACH, COACHEE]);
