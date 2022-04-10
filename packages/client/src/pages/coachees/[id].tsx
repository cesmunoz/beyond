import React from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { COACH } from '@beyond/lib/constants';
import { withAuth } from 'components/withAuth';
import { Main } from 'components/Layout';
import CoacheeDetail from 'components/CoacheeDetail';
import useTypedSelector from 'selectors/typedSelector';

export const CoacheeDetailPage: React.FC = (): JSX.Element => {
  const { mobile } = useTypedSelector(state => state);

  const router = useRouter();
  const { id } = router.query;
  const coacheeId = Array.isArray(id) ? id[0] : id;

  return (
    <Main activeMenu="Coachees">
      <div
        className={cn('flex flex-col justify-between h-full w-full', {
          'p-12': !mobile,
          'p-4 py-20 bg-white': mobile,
        })}
      >
        <CoacheeDetail coacheeId={coacheeId} />
      </div>
    </Main>
  );
};

export default withAuth(CoacheeDetailPage, [COACH]);
