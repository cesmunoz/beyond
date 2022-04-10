import React from 'react';
import PropTypes from 'prop-types';
import { ProcessType } from '@beyond/lib/enums';
import { ValidAny } from '@beyond/lib/types';

type ProcessTypeInputProps = {
  type: ProcessType;
  register: ValidAny;
};

const ProcessTypeData: Record<ProcessType, { id: string; text: string }> = {
  [ProcessType.SINGLE]: {
    id: 'single-type',
    text: 'Individual',
  },
  [ProcessType.TEAM]: {
    id: 'team-type',
    text: 'Equipo',
  },
};

const ProcessTypeInput = ({ register, type }: ProcessTypeInputProps): JSX.Element => (
  <label htmlFor={ProcessTypeData[type].id} className="flex items-center mb-2 text-base">
    <input
      ref={register({ required: 'Elige un tipo de proceso.' })}
      value={type}
      id={ProcessTypeData[type].id}
      name="type"
      type="radio"
    />
    <span className="ml-2">{ProcessTypeData[type].text}</span>
  </label>
);

ProcessTypeInput.propTypes = {
  type: PropTypes.oneOf([ProcessType.SINGLE, ProcessType.TEAM]).isRequired,
  register: PropTypes.any.isRequired, // eslint-disable-line
};

export default ProcessTypeInput;
