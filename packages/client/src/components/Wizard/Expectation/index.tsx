import React, { useState, useEffect } from 'react';
import cn from 'classnames';

import { useDispatch } from 'react-redux';
import { setExpectation } from 'appState/form';
import useTypedSelector from 'selectors/typedSelector';
import { getExpectation } from 'selectors/form';
// import TextField from 'components/TextField';
import TextArea from 'components/TextArea';
import useStyles from './styles';
import Controls from '../Controls';
import { OnStepChangeProp } from '..';

const Expectation = ({ onStepChange }: OnStepChangeProp): JSX.Element => {
  const [error, setError] = useState('');
  const expectation = useTypedSelector(getExpectation);
  const [value, setValue] = useState(expectation);
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (expectation) {
      setValue(expectation);
    }
  }, [expectation]);

  const handleOnStepChange = (step: number): void => {
    if (step === -1) {
      onStepChange(step);
    }

    if (!value) {
      setError('Debes completar el motivo.');
      return;
    }

    dispatch(setExpectation(value));
    onStepChange(step);
  };

  return (
    <div>
      <h3 className={cn('font-extrabold', classes.title)}>¿Qué quiero lograr con este proceso?</h3>

      <div>
        <TextArea
          onChange={(evt): void => setValue(evt.target.value)}
          placeholder="Yo quisiera..."
          id="coachee-expectation"
          error={error}
          value={value}
        />

        <Controls containerClassName={classes.controls} onStepChange={handleOnStepChange} />
      </div>
    </div>
  );
};

export default Expectation;
