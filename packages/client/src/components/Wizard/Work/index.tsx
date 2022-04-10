import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import cn from 'classnames';
import { SENIORITY_OPTIONS } from '@beyond/lib/constants';

import { setPersonalInfo } from 'appState/form';
import TextField from 'components/TextField';
import Dropdown from 'components/Dropdown';
import { Pair } from 'types';
import useTypedSelector from 'selectors/typedSelector';
import { getWorkInformation } from 'selectors/form';
import Controls from '../Controls';

import { OnStepChangeProp } from '..';

import useStyles from './styles';

const ITEMS: Pair[] = Object.entries(SENIORITY_OPTIONS).map(([key, value]) => ({
  key,
  value,
}));

type WorkFormData = {
  company: string;
  role: string;
};

const Work = ({ onStepChange }: OnStepChangeProp): JSX.Element => {
  const [seniority, setSeniority] = useState('');
  const [seniorityError, setSeniorityError] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const workInformation = useTypedSelector(getWorkInformation);
  const { register, watch, errors, triggerValidation } = useForm<WorkFormData>({
    defaultValues: { ...workInformation },
  });

  useEffect(() => {
    if (workInformation.seniority) {
      setSeniority(workInformation.seniority);
    }
  }, []);

  const { company, role } = watch();

  const handleOnSeniorityChange = (selectedValue: string): void => {
    setSeniorityError(false);
    setSeniority(selectedValue);
  };

  const handleOnStepChange = async (step: number): Promise<void> => {
    if (step === -1) {
      onStepChange(step);
      return;
    }

    let validForm = await triggerValidation();

    if (!seniority) {
      setSeniorityError(true);
      validForm = false;
    }

    if (!validForm) {
      return;
    }

    dispatch(
      setPersonalInfo({
        company,
        role,
        seniority,
      }),
    );
    onStepChange(step);
  };

  return (
    <div>
      <h3 className={cn('font-extrabold', classes.title)}>Acerca de mi trabajo</h3>

      <div>
        <TextField
          error={errors.company?.message?.toString()}
          fullWidth
          id="coachee-company"
          label="Compañía"
          name="company"
          ref={register({ required: 'Debes completar la compañía' })}
        />

        <TextField
          error={errors.role?.message?.toString()}
          fullWidth
          id="coachee-role"
          label="Rol"
          name="role"
          ref={register({ required: 'Debes completar tu rol' })}
        />

        <Dropdown
          value={seniority}
          error={seniorityError}
          onChange={handleOnSeniorityChange}
          items={ITEMS}
          label="Tiempo en el rol"
        />
      </div>

      <Controls containerClassName={classes.controls} onStepChange={handleOnStepChange} />
    </div>
  );
};

export default Work;
