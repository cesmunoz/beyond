import React from 'react';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ValidAny } from '@beyond/lib/types';
// eslint-disable-next-line
// @ts-ignore
import { isDate } from 'validator';

import MaskedInput from 'react-text-mask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

import TextField from 'components/TextField';

import { setPersonalInfo } from 'appState/form';
import useTypedSelector from 'selectors/typedSelector';
import { getAboutMeInformation } from 'selectors/form';

import useStyles from './styles';
import { OnStepChangeProp } from '..';
import Controls from '../Controls';

const autoCorrectedDatePipe = createAutoCorrectedDatePipe('mm/dd/yyyy');
const autoCorrectedTimePipe = createAutoCorrectedDatePipe('HH:MM');

const pipeWithReset = (pipe: ValidAny) => (conformedValue: ValidAny): ValidAny => {
  if (!conformedValue) {
    return {
      value: conformedValue,
      indexesOfPipedChars: [],
    };
  }

  const result = pipe(conformedValue);

  if (typeof result === 'object') {
    return result;
  }

  return {
    value: conformedValue,
    indexesOfPipedChars: [],
  };
};

type AboutMeFormData = {
  fullName: string;
  city: string;
  country: string;
  birthDate: string;
  birthTime: string;
};

const AboutMe = ({ onStepChange }: OnStepChangeProp): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const aboutMe = useTypedSelector(getAboutMeInformation);
  const { mobile } = useTypedSelector(state => state);

  const { register, watch, errors, triggerValidation } = useForm<AboutMeFormData>({
    defaultValues: { ...aboutMe },
  });

  const { birthDate, birthTime, city, country, fullName } = watch();

  const handleOnStepChange = async (step: number): Promise<void> => {
    if (step === -1) {
      onStepChange(step);
      return;
    }

    const validForm = await triggerValidation();

    if (!validForm) {
      return;
    }

    dispatch(
      setPersonalInfo({
        birthDate,
        birthTime,
        city,
        country,
        fullName,
      }),
    );
    onStepChange(step);
  };

  return (
    <div className="h-full">
      <h3 className={cn('font-extrabold', classes.title)}>Acerca de mí</h3>

      <div className="flex-column justify-between">
        <div className={cn('w-full', classes.fieldsContainer)}>
          <TextField
            error={errors.fullName?.message?.toString()}
            ref={register({ required: 'Debes completar tu nombre y apellido' })}
            fullWidth
            id="coachee-fullname"
            label="Nombre y apellido"
            name="fullName"
          />

          <div className="flex justify-between">
            <MaskedInput
              mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
              pipe={pipeWithReset(autoCorrectedDatePipe)}
              placeholder="dd/mm/yyyy"
              name="birthDate"
              id="coachee-birthDate"
              pattern={mobile ? '\\d*' : '\\d\\d/\\d\\d/\\d\\d\\d\\d'}
              keepCharPositions
              render={(ref, props): JSX.Element => (
                <TextField
                  error={errors.birthDate?.message?.toString()}
                  ref={(e: HTMLInputElement): void => {
                    if (!e) {
                      return;
                    }
                    register(e, {
                      required: 'Debes completar tu fecha de nacimiento',
                      validate: (value: string) =>
                        isDate(value, 'DD/MM/YYYY') || 'La fecha debe tener un formato valido.',
                    });
                    ref(e);
                  }}
                  containerClassName={cn('max-w-1/2', { 'pr-1': mobile })}
                  label="Fecha de nacimiento"
                  {...props}
                />
              )}
            />

            <MaskedInput
              mask={[/\d/, /\d/, ':', /\d/, /\d/]}
              pipe={pipeWithReset(autoCorrectedTimePipe)}
              placeholder="hh:mm"
              name="birthTime"
              id="coachee-birthTime"
              pattern={mobile ? '\\d*' : '\\d\\d:\\d\\d'}
              keepCharPositions
              render={(ref, props): JSX.Element => (
                <TextField
                  error={errors.birthTime?.message?.toString()}
                  ref={(e: HTMLInputElement): void => {
                    if (!e) {
                      return;
                    }
                    register(e, {
                      required: 'Debes completar tu hora de nacimiento',
                      pattern: {
                        message: 'La hora debe tener un formato valido.',
                        value: /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/,
                      },
                    });
                    ref(e);
                  }}
                  containerClassName={cn('max-w-1/2', { 'pl-1': mobile })}
                  label="Hora de nac."
                  {...props}
                />
              )}
            />
          </div>

          <TextField
            error={errors.city?.message?.toString()}
            ref={register({ required: 'Debes completar tu ciudad' })}
            fullWidth
            id="coachee-city"
            label="Ciudad"
            name="city"
          />
          <TextField
            error={errors.country?.message?.toString()}
            ref={register({ required: 'Debes completar tu país' })}
            fullWidth
            id="coachee-country"
            label="País"
            name="country"
          />
        </div>

        <Controls onStepChange={handleOnStepChange} />
      </div>
    </div>
  );
};

export default AboutMe;
