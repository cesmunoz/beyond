import React, { useState } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';

import AuthCodes from 'constants/authCodes';
import Box from 'components/Box';
import Button from 'components/Button';
import ErrorMessage from 'components/ErrorMessage';
import TextField from 'components/TextField';
import Colors from 'styles/colors';
import { withAuth } from 'components/withAuth';
import { login } from 'utils/auth';
import { ROOT } from 'constants/routes';
import useTypedSelector from 'selectors/typedSelector';
import CloudBackground from '../../../public/clouds.svg';

type SignInFormData = {
  email: string;
  password: string;
};

export const SignIn: React.FC = () => {
  const { mobile } = useTypedSelector(state => state);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { handleSubmit, register, errors } = useForm<SignInFormData>();

  const handleOnSignIn = handleSubmit(async ({ email, password }) => {
    setLoading(true);
    setLoginError('');

    const emailUser = email.toLowerCase();
    const error = await login(emailUser, password);

    if (error) {
      setLoading(false);
      setLoginError(error);
      return;
    }

    Router.push(ROOT);
  });

  return (
    <main className="page-background flex-center-x h-full w-full py-8">
      <Box>
        <h1 className="h-1/5 text-4xl mt-16">¡Bienvenido!</h1>
        <form className="flex justify-center h-4/5 mt-8" noValidate onSubmit={handleOnSignIn}>
          <div
            className={`flex-column justify-between items-center h-full ${
              mobile ? 'w-full' : 'w-9/12'
            }`}
          >
            <div className="h-4/5 text-center">
              <TextField
                error={errors.email?.message?.toString()}
                fullWidth
                id="email"
                label="Usuario"
                name="email"
                ref={register({ required: 'El usuario es requerido' })}
              />
              <TextField
                error={errors.password?.message?.toString()}
                fullWidth
                id="password"
                label="Contraseña"
                name="password"
                ref={register({ required: 'La contraseña es requerida' })}
                type="password"
              />
              {loginError && <ErrorMessage message={AuthCodes[loginError]} />}
            </div>
            <Button
              name="submit"
              filled
              className="mb-8"
              loading={loading}
              text="Ingresar"
              type="submit"
            />
          </div>
        </form>
      </Box>
      <style jsx>
        {`
          .page-background {
            background: url(${CloudBackground}) no-repeat center/70%,
              linear-gradient(
                to bottom,
                ${Colors.Backgrounds.LightTurquoise} 0%,
                ${Colors.Backgrounds.Gray} 100%
              );
          }
        `}
      </style>
    </main>
  );
};

export default withAuth(SignIn);
