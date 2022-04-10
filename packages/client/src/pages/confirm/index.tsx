import React, { useState } from 'react';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import Box from 'components/Box';
import Button from 'components/Button';
import Colors from 'styles/colors';
import ErrorMessage from 'components/ErrorMessage';
import TextField from 'components/TextField';
import { withAuth } from 'components/withAuth';

import useTypedSelector from 'selectors/typedSelector';

import { changePassword } from 'api/auth';
import APIStatus from 'constants/apiStatus';
import SuccessModal from 'components/SuccessModal';
import { ROOT } from 'constants/routes';
import CloudBackground from '../../../public/clouds.svg';

import useStyles from './styles';

type ConfirmFormData = {
  password: string;
  passwordConfirm: string;
};

export const Confirm: React.FC = () => {
  const router = useRouter();
  const classes = useStyles();
  const { query } = router;
  const { mobile } = useTypedSelector(state => state);
  const apiStatus = useTypedSelector(state => state.api.changePassword);
  const dispatch = useDispatch();
  const loading = useTypedSelector(state => state.loading.changePassword);
  const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);

  const { handleSubmit, register, errors } = useForm<ConfirmFormData>();

  const handleOnPasswordChange = handleSubmit(async ({ password, passwordConfirm }) => {
    if (password !== passwordConfirm) {
      setPasswordsDoNotMatch(true);
      return;
    }

    dispatch(
      changePassword({
        confirmHash: query.hash as string,
        email: query.email as string,
        password,
      }),
    );
  });

  const handleOnRedirectClick = (): void => {
    router.push(ROOT);
  };

  return (
    <main className="page-background flex-center-x h-full w-full py-8">
      <Box
        className={cn({
          [classes.container]: !mobile,
        })}
      >
        {apiStatus === APIStatus.Success ? (
          <SuccessModal
            title="¡Cuenta activada!"
            subtitle={`Usa tu correo <strong>${query.email}</strong> como usuario para loguearte.`}
            actionText="Loguearme"
            filled
            onActionClick={handleOnRedirectClick}
            visible
          />
        ) : (
          <>
            <h1 className={classes.title}>¡Bienvenido!</h1>
            <span className={`${classes.subtitle} -mt-10`}>
              Crea una contraseña con la que accederás de ahora en adelante.
            </span>

            <div className={`flex-column justify-between -mt-10 ${mobile ? 'w-full' : 'w-9/12'}`}>
              <form
                className="flex-column items-center justify-center -mt-10"
                noValidate
                onSubmit={handleOnPasswordChange}
              >
                <div className="mb-3">
                  <TextField
                    error={errors.password?.message?.toString()}
                    fullWidth
                    id="password"
                    label="Contraseña"
                    name="password"
                    type="password"
                    ref={register({ required: 'El usuario es requerido' })}
                  />
                  <TextField
                    error={errors.passwordConfirm?.message?.toString()}
                    fullWidth
                    id="password"
                    label="Confirmar Contraseña"
                    name="passwordConfirm"
                    ref={register({ required: 'La contraseña es requerida' })}
                    type="password"
                  />
                </div>
                <span className="pl-5 pr-2 mb-6 text-xs">
                  * La contraseña debe tener mínimo 8 caracteres y contar con una minúscula, una
                  mayúscula, un número y un caracter especial.
                </span>
                {apiStatus === APIStatus.Failure && (
                  <ErrorMessage
                    className="my-4"
                    message="Hubo un error. Por favor, intenta de nuevo"
                  />
                )}
                {passwordsDoNotMatch && (
                  <div className="text-red-700 rounded px-1 py-1 pl-5 pr-2 mb-4 text-xs">
                    Las contraseñas no coinciden. Intente nuevamente.
                  </div>
                )}
                <Button
                  name="submit"
                  filled
                  loading={loading}
                  text="Activar cuenta"
                  type="submit"
                />
              </form>
            </div>
          </>
        )}
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

export default withAuth(Confirm);
