import React from 'react';
import cn from 'classnames';

import TextField from 'components/TextField';

type InputRef = (ref: HTMLInputElement | null) => void;

type MobileProp = {
  mobile: boolean;
};

type ValueProp = {
  value?: string;
};

type EmailInputProps = {
  error?: string;
  ref?: InputRef;
} & MobileProp &
  ValueProp;

const FormInputs = {
  Email: React.forwardRef(
    ({ error, mobile }: EmailInputProps, ref): JSX.Element => (
      <TextField
        containerClassName={cn({ 'w-6/12': !mobile })}
        error={error}
        fullWidth={mobile}
        id="coachee-email"
        label="Correo electrónico"
        name="email"
        ref={ref}
      />
    ),
  ),
  FullName: React.forwardRef(
    ({ mobile }: MobileProp & ValueProp, ref): JSX.Element => (
      <TextField
        fullWidth={mobile}
        containerClassName={cn({
          'w-6/12 ml-2': !mobile,
        })}
        id="coachee-fullname"
        label="Nombre y apellido (opcional)"
        name="fullName"
        ref={ref as InputRef}
      />
    ),
  ),
  Company: React.forwardRef(
    (_, ref): JSX.Element => (
      <TextField
        fullWidth
        containerClassName="mr-2"
        id="coachee-company"
        label="Empresa (opcional)"
        name="company"
        ref={ref}
      />
    ),
  ),
};

export default FormInputs;
