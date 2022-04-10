import React, { useState } from 'react';
import cn from 'classnames';

import ErrorMessage from 'components/ErrorMessage';

import useStyles from './styles';
import RateButton from './RateButton';
import { OnStepChangeProp } from '..';
import Controls from '../Controls';

const RATES = [1, 2, 3, 4, 5];

type RateQuestionProps = {
  initialValue: number;
  text: string;
  error?: string;
  onSaveClick?: () => void;
  onChange: (rate: number) => void;
} & OnStepChangeProp;

const RateQuestion = ({
  text,
  error,
  initialValue,
  onChange,
  onStepChange,
  onSaveClick,
}: RateQuestionProps): JSX.Element => {
  const classes = useStyles();
  const [currentRate, setCurrentRate] = useState<number>(initialValue);

  const handleOnRateChange = (rate: number): void => {
    setCurrentRate(rate);
    onChange(rate);
  };

  return (
    <div className="flex-column">
      <h3 className={cn('font-extrabold', classes.questionText)}>{text}</h3>
      <div className={cn('inline-flex', classes.rateContainer)}>
        {RATES.map(rate => (
          <RateButton
            key={rate}
            first={rate === 1}
            last={rate === RATES.length}
            rate={rate}
            selected={rate === currentRate}
            onClick={handleOnRateChange}
          />
        ))}
      </div>
      <div className={classes.rateTextContainer}>
        <div className={classes.rateLeftContainer}>
          <span className={classes.rateText}>No me siento para nada identificado</span>
        </div>
        <div className={classes.rateRightContainer}>
          <span className={classes.rateText}>Me siento muy identificado</span>
        </div>
      </div>

      {error && <ErrorMessage className="mt-4" message={error} />}

      <Controls
        onSaveClick={onSaveClick}
        isFinalStep={!!onSaveClick}
        containerClassName="mt-10"
        onStepChange={onStepChange}
      />
    </div>
  );
};

export default RateQuestion;
