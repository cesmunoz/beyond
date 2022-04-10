import React from 'react';
import cn from 'classnames';

import Button from 'components/Button';

import useTypedSelector from 'selectors/typedSelector';
import { useDesktopStyles, useMobileStyles } from './styles';

type StartProps = {
  name: string;
  isEvaluator: boolean;
  isTeamProcess: boolean;
  onClick: () => void;
};

const Start = ({ name, isTeamProcess, isEvaluator, onClick }: StartProps): JSX.Element => {
  const { mobile } = useTypedSelector(state => state);
  const classes = mobile ? useMobileStyles() : useDesktopStyles();

  const getTitle = (): string => {
    if (isEvaluator) {
      return 'Ayudanos a contestar estas preguntas';
    }

    if (isTeamProcess) {
      return '¿Estás listo para descubrir el potencial de tu equipo?';
    }

    return '¿Estás listo para descubrir todo tu potencial?';
  };

  return (
    <div
      className={cn('flex flex-col h-full py-4', {
        'items-center': !mobile,
      })}
    >
      <h4 className={cn(classes.base, classes.welcome)}>¡Hola {name}!</h4>
      <h2 className={cn(classes.base, classes.title)}>{getTitle()}</h2>
      <h3 className={cn(classes.base, classes.description)}>
        Te tomará algunos minutos. Podrás guardar tus respuestas en cualquier momento.
      </h3>
      <Button onClick={onClick} className={classes.startButton} text="Comenzar" />
    </div>
  );
};
export default Start;
