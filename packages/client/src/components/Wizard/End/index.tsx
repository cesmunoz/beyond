import React from 'react';
import cn from 'classnames';
import Success from 'components/Success';
import Button from 'components/Button';
import { useRouter } from 'next/router';
import { ROOT } from 'constants/routes';
import { ValidAny } from '@beyond/lib/types';

type EndProps = {
  isEvaluator: boolean;
  isTeamProcess: boolean;
  isExitButtonVisible: boolean;
  isAlreadyAnswered: boolean;
  isProcessCompleted: boolean;
};

const End = ({
  isEvaluator,
  isTeamProcess,
  isAlreadyAnswered,
  isExitButtonVisible,
  isProcessCompleted,
}: EndProps): JSX.Element => {
  const router = useRouter();

  const getMessage = (): string => {
    if (isAlreadyAnswered) {
      return 'Ya contestaste este cuestionario';
    }

    if (isEvaluator) {
      return 'Muchas gracias por tu ayuda!';
    }

    if (!isProcessCompleted) {
      return 'Guardaste el cuestionario para terminarlo después';
    }

    return `Ya completaste tu proceso ${isTeamProcess ? 'de equipo' : 'individual'}`;
  };

  return (
    <div className={cn('flex-column items-center xs', { 'mt-20': isAlreadyAnswered })}>
      <Success title={getMessage()} />
      {isExitButtonVisible && (
        <Button
          className="mt-10"
          text="Salir"
          type="button"
          onClick={(): ValidAny => router.push(ROOT)}
        />
      )}
    </div>
  );
};

export default End;
