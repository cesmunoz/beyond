import React from 'react';
import cn from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import Button from 'components/Button';

import useTypedSelector from 'selectors/typedSelector';
import useStyles from './styles';
import { OnStepChangeProp, OnSaveClickProp } from '..';

type ControlsProps = {
  isFinalStep?: boolean;
  containerClassName?: string;
} & OnStepChangeProp &
  OnSaveClickProp;

const Controls = ({
  onSaveClick,
  containerClassName,
  onStepChange,
  isFinalStep,
}: ControlsProps): JSX.Element => {
  const { mobile } = useTypedSelector(state => state);
  const loading = useTypedSelector(state => state.loading.createAnswers);
  const classes = useStyles();

  const handleOnNextClick = (): void => onStepChange(1);
  const handleOnPrevClick = (): void => onStepChange(-1);

  return (
    <div
      className={cn('flex', {
        'justify-end': !onSaveClick || isFinalStep,
        'justify-between': onSaveClick && !isFinalStep,
        'absolute right-0 bottom-0': mobile,
        [classes.mobileContainer]: mobile,
        [containerClassName || '']: containerClassName,
      })}
    >
      {onSaveClick && (
        <Button
          className={classes.saveButton}
          filled={false}
          fullWidth={false}
          onClick={onSaveClick}
          text={isFinalStep ? 'Guardar y enviar' : 'Guardar'}
          type="button"
          loading={loading}
        />
      )}
      {!isFinalStep && (
        <div className="flex">
          <Button
            onClick={handleOnPrevClick}
            className={cn(classes.button, classes.leftButton, {
              [classes.withMargin]: !mobile,
            })}
            text={<FontAwesomeIcon size="lg" icon={faArrowLeft} />}
          />
          <Button
            onClick={handleOnNextClick}
            className={cn(classes.button, 'mr-4', {
              [classes.withMargin]: !mobile,
            })}
            text={<FontAwesomeIcon size="lg" icon={faArrowRight} />}
          />
        </div>
      )}
    </div>
  );
};

export default Controls;
