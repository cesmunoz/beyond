import React, { useState, useEffect } from 'react';
import cn from 'classnames';

import Dropdown from 'components/Dropdown';
import { EDUCATION_OPTIONS } from '@beyond/lib/constants';
import { Pair } from 'types';
import { useDispatch } from 'react-redux';
import { setPersonalInfo } from 'appState/form';
import useTypedSelector from 'selectors/typedSelector';
import { getEducationInformation } from 'selectors/form';
import useStyles from './styles';
import Controls from '../Controls';
import { OnStepChangeProp } from '..';

const ITEMS: Pair[] = Object.entries(EDUCATION_OPTIONS).map(([key, value]) => ({
  key,
  value,
}));

const Education = ({ onStepChange }: OnStepChangeProp): JSX.Element => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const { education } = useTypedSelector(getEducationInformation);
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (education) {
      setValue(education);
    }
  }, []);

  const handleOnOptionChange = (selectedValue: string): void => {
    setError('');
    setValue(selectedValue);
  };

  const handleOnStepChange = (step: number): void => {
    if (step === -1) {
      onStepChange(step);
    }

    if (!value) {
      setError('Debes seleccionar una opción.');
      return;
    }

    dispatch(setPersonalInfo({ education: value }));
    onStepChange(step);
  };

  return (
    <div>
      <h3 className={cn('font-extrabold', classes.title)}>Mi formación académica</h3>

      <div>
        <Dropdown
          value={value}
          label="Educación"
          error={!!error}
          items={ITEMS}
          onChange={handleOnOptionChange}
        />

        <Controls containerClassName={classes.controls} onStepChange={handleOnStepChange} />
      </div>
    </div>
  );
};

export default Education;
