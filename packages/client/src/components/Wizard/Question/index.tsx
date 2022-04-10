import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setAnswer } from 'appState/form';
import useTypedSelector from 'selectors/typedSelector';
import { getQuestionValue } from 'selectors/form';

import { OnStepChangeProp } from '..';
import RateQuestion from '../RateQuestion';
import TextQuestion from '../TextQuestion';

type Answer = number | string;

type QuestionProps = {
  category: string;
  id: number;
  text: string;
  onSaveClick?: () => void;
  type: 'rate' | 'text';
} & OnStepChangeProp;

const Question = ({
  id,
  category,
  text,
  onStepChange,
  onSaveClick,
  type,
}: QuestionProps): JSX.Element => {
  const dispatch = useDispatch();
  const currentValue = useTypedSelector(state => getQuestionValue(state, type, category, id));
  const [error, setError] = useState('');
  const [value, setValue] = useState<Answer>(currentValue);

  useEffect(() => {
    if (currentValue) {
      setValue(currentValue);

      if (onSaveClick) {
        setTimeout(onSaveClick, 100);
      }
    }
  }, [currentValue]);

  const handleOnAnswerChangeChange = (answer: Answer): void => {
    setValue(answer);
  };

  const handleOnStepChange = (step: number): void => {
    if (step === -1) {
      onStepChange(step);
      return;
    }

    if (!value) {
      setError('Debes elegir una respuesta');
      return;
    }

    dispatch(
      setAnswer({
        category,
        id,
        value,
      }),
    );
    onStepChange(step);
  };

  const handleOnSaveClick = (): void => {
    if (!onSaveClick) {
      return;
    }

    if (!value) {
      setError('Debes elegir una respuesta');
      return;
    }

    dispatch(
      setAnswer({
        category,
        id,
        value,
      }),
    );
  };

  return type === 'rate' ? (
    <RateQuestion
      onSaveClick={onSaveClick ? handleOnSaveClick : undefined}
      onStepChange={handleOnStepChange}
      onChange={handleOnAnswerChangeChange}
      initialValue={value as number}
      error={error}
      text={text}
    />
  ) : (
    <TextQuestion
      onSaveClick={onSaveClick ? handleOnSaveClick : undefined}
      onStepChange={handleOnStepChange}
      initialValue={value as string}
      onChange={handleOnAnswerChangeChange}
      error={error}
      question={text}
    />
  );
};

export default Question;
