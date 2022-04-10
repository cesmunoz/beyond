import React from 'react';
import { StepKey } from 'types';
import Step from './Step';

export type OnStepChangeProp = {
  onStepChange: (step: number) => void;
};

export type OnSaveClickProp = {
  onSaveClick?: () => void;
};

type StepType = {
  name: StepKey;
  milestone: boolean;
  visible: boolean;
};

type WizardProps = {
  steps: StepType[];
  currentStep: StepKey;
  children: React.ReactNode;
};

const Wizard = ({ steps, currentStep, children }: WizardProps): JSX.Element => (
  <div className="flex-column full-size justify-start">
    {React.Children.map(children, (child, index) => (
      <Step
        step={(steps[index] || {}).name}
        steps={steps}
        currentStep={currentStep}
        hasStepsVisible={index !== 0}
      >
        {child}
      </Step>
    ))}
  </div>
);

export default Wizard;
