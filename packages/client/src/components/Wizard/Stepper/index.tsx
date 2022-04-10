import React from 'react';
import cn from 'classnames';
import { Nullable } from '@beyond/lib/types';

import useTypedSelector from 'selectors/typedSelector';
import Dot from './Dot';
import Line from './Line';

type Step = {
  name: string;
  milestone: boolean;
  visible?: boolean;
};

type StepProps = {
  previous: boolean;
  filled: boolean;
  mini: boolean;
};

const Step = ({ previous, filled, mini }: StepProps): JSX.Element => {
  if (!previous) {
    return <Dot mini={mini} filled={filled} />;
  }

  return (
    <>
      <Line filled={filled} />
      <Dot mini={mini} filled={filled} />
    </>
  );
};

type StepperProps = {
  currentStep: Nullable<string>;
  steps: Step[];
  position: 'left' | 'center';
};

const Stepper = ({ position, steps, currentStep }: StepperProps): JSX.Element => {
  const { mobile } = useTypedSelector(state => state);
  const currentStepIndex = steps.findIndex(c => c.name === currentStep);

  return (
    <div style={{ marginBottom: '4.6vh', marginTop: mobile ? '5vh' : '10vh' }}>
      <div
        className={cn('flex items-center -ml-1', {
          'justify-center': position === 'center',
        })}
      >
        {steps
          .filter(s => s.visible)
          .map(step => (
            <Step
              key={`${step.name}_${step.milestone}`}
              mini={!step.milestone}
              filled={
                currentStep !== null &&
                steps.findIndex(c => c.name === step.name) <= currentStepIndex
              }
              previous={step.name !== 'Start'}
            />
          ))}
      </div>
    </div>
  );
};

export default Stepper;
