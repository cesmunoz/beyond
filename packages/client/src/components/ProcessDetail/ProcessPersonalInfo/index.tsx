import React from 'react';
import cn from 'classnames';

import { EDUCATION_OPTIONS } from '@beyond/lib/constants';
import { ProcessDetail } from 'appState/processes';

import useStyles from './styles';

type ProcessAnswersProps = {
  process: ProcessDetail;
};

const ProcessPersonalInfo = ({ process }: ProcessAnswersProps): JSX.Element => (
  <article className="border-b">
    <div className="bg-grey-lightest">
      <div>
        <ProcessPersonalInfo.Section data={(process.personalInfo || {}).company} label="Compañía" />
        <ProcessPersonalInfo.Section data={(process.personalInfo || {}).role} label="Rol" />
        <ProcessPersonalInfo.Section
          data={EDUCATION_OPTIONS[(process.personalInfo || {}).education]}
          label="Formación"
        />
        <ProcessPersonalInfo.Section
          label="¿Qué te gustaría lograr con el proceso?"
          data={process.expectation}
          direction="column"
        />
      </div>
    </div>
  </article>
);

type SectionProps = {
  label: string;
  data?: string;
  direction?: 'row' | 'column';
};

ProcessPersonalInfo.Section = ({ label, data, direction = 'row' }: SectionProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className="border-t border-b border-gray-200">
      <div className="flex">
        <div
          className={cn(classes.container, 'w-full flex', {
            'flex-col': direction === 'column',
            'items-center': direction === 'row',
          })}
        >
          <div
            className={cn(classes.base, classes.label, {
              [classes.labelColumn]: direction === 'column',
            })}
          >
            {label}
          </div>
          <div
            className={cn(classes.base, {
              [classes.dataColumn]: direction === 'column',
            })}
          >
            {data || '-'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessPersonalInfo;
