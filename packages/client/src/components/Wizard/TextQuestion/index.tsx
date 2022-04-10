import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import TextArea from 'components/TextArea';
import { ValidAny } from '@beyond/lib/types';
import useStyles from './styles';
import Controls from '../Controls';
import { OnStepChangeProp } from '..';

type TextQuestionProps = {
  question: string;
  placeholder?: string;
  error?: string;
  initialValue: string;
  onSaveClick?: () => void;
  onChange: (answer: string) => void;
} & OnStepChangeProp;

const TextQuestion = ({
  question,
  placeholder,
  error,
  initialValue,
  onStepChange,
  onSaveClick,
  onChange,
}: TextQuestionProps): JSX.Element => {
  const [windowSize, setWindowSize] = React.useState<ValidAny>(null);
  const [appearKeyboard, setAppearKeyboard] = React.useState(false);
  const [value, setValue] = useState('');
  const classes = useStyles();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (windowSize && windowSize.height < 360) {
      setAppearKeyboard(true);
    } else {
      setAppearKeyboard(false);
    }
  }, [windowSize]);

  useEffect(() => {
    const handleOnWindowResize = (): void =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener('resize', handleOnWindowResize);

    return (): void => {
      window.removeEventListener('resize', handleOnWindowResize);
    };
  }, []);

  const handleOnAnswerChange = (answer: string): void => {
    setValue(answer);
    onChange(answer);
  };

  return (
    <div>
      <h3
        className={cn('font-extrabold', classes.title, {
          [classes.titleMobile]: appearKeyboard,
        })}
      >
        {question}
      </h3>

      <div
        className={cn({
          [classes.textAreaMobile]: appearKeyboard,
        })}
      >
        <TextArea
          onChange={(evt): void => handleOnAnswerChange(evt.target.value)}
          placeholder={placeholder || ''}
          id="coachee-text-question"
          error={error}
          value={value}
        />

        <Controls
          onSaveClick={onSaveClick}
          isFinalStep={!!onSaveClick}
          containerClassName={appearKeyboard ? classes.controlMobile : classes.controls}
          onStepChange={onStepChange}
        />
      </div>
    </div>
  );
};

export default TextQuestion;
