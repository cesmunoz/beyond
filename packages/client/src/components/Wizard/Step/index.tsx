import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { Nullable } from '@beyond/lib/types';

import { StepKey } from 'types';
import Stepper from '../Stepper';
import useStyles from './styles';

type Step = {
  name: StepKey;
  milestone: boolean;
  visible: boolean;
};

type StepProps = {
  steps: Step[];
  step: StepKey;
  currentStep: StepKey;
  hasStepsVisible: boolean;
  children: React.ReactNode;
};

const ANIMATION_DURATION = 200;

const Step = ({
  steps,
  step,
  hasStepsVisible,
  currentStep,
  children,
}: StepProps): Nullable<JSX.Element> => {
  const classes = useStyles();
  const [animated, setAnimated] = useState(true);
  const [visible, setVisible] = useState(false);

  const handleTimeout = (callback: () => void): NodeJS.Timeout =>
    setTimeout(callback, ANIMATION_DURATION);

  useEffect(() => {
    if (step === currentStep) {
      const t = handleTimeout(() => {
        setVisible(true);
        handleTimeout(() => setAnimated(true));
      });
      return (): void => clearTimeout(t);
    }
    setAnimated(false);
    const t = handleTimeout(() => setVisible(false));
    return (): void => clearTimeout(t);
  }, [step, currentStep]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(`full-size transition-opacity ease-in duration-${ANIMATION_DURATION}`, {
        'opacity-0': !animated,
        'opacity-1': animated,
      })}
    >
      {hasStepsVisible && (
        <Stepper
          position={currentStep === 'End' ? 'center' : 'left'}
          currentStep={currentStep}
          steps={steps}
        />
      )}

      <div
        className={cn(
          { 'h-full': ['Start', 'Interlude_1', 'Interlude_2', 'End'].includes(currentStep) },
          classes.content,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Step;
