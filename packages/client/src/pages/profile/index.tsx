import cn from 'classnames';
import { COACH, COACHEE } from '@beyond/lib/constants';
import Divider from '@material-ui/core/Divider';

import { Main } from 'components/Layout';
import { withAuth } from 'components/withAuth';

import TextField from 'components/TextField';
import Loading from 'components/Loading';
import { useForm } from 'react-hook-form';
import useTypedSelector from 'selectors/typedSelector';
import PictureUpload from 'components/PictureUpload';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUserInfo, updateProfile } from 'api/auth';
import { Nullable } from '@beyond/lib/types';
import useStyles from './styles';

type ProfileFormData = {
  fullName: string;
  company?: string;
};

const Profile = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [image, setImage] = useState<Nullable<FormData>>(null);

  useEffect(() => {
    dispatch(getUserInfo());
  }, []);

  const { auth, loading, mobile } = useTypedSelector(state => state);

  const isCoach = auth.role === COACH;

  const { register, errors, setValue, handleSubmit } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: auth.fullName,
      company: auth.company,
    },
  });

  useEffect(() => {
    setValue('fullName', auth.fullName);
    setValue('company', auth.company);
  }, [auth]);

  const handleOnFileChange = (file: FormData): void => {
    setImage(file);
  };

  const handleOnProfileSubmit = handleSubmit(form => {
    dispatch(updateProfile(auth.profileImgUploadUrl, form.fullName, form.company || '', image));
  });

  return (
    <Main activeMenu="Mi perfil">
      <div
        className={cn('full-size', {
          'flex-column items-center py-8': mobile,
          [classes.container]: !mobile,
        })}
      >
        {!mobile && <h1 className={classes.title}>Mi perfil</h1>}

        <PictureUpload
          onFileChange={handleOnFileChange}
          fullName={auth.fullName || auth.email}
          avatarUrl={auth.avatarUrl}
        />

        <Divider className={cn({ 'w-7/12': !mobile, 'w-11/12': mobile })} />

        <form
          noValidate
          onSubmit={handleOnProfileSubmit}
          className={cn(classes.form, 'flex-column', {
            'w-3/12': !mobile,
            'w-11/12': mobile,
          })}
        >
          <TextField
            label="Nombre y apellido"
            id="profile-fullName"
            name="fullName"
            error={errors.fullName?.message?.toString()}
            ref={register({ required: 'Debes completar tu nombre y apellido' })}
          />
          {!isCoach && (
            <TextField
              label="Empresa"
              id="profile-company"
              name="company"
              error={errors.company?.message?.toString()}
              ref={register({ required: 'Debes completar tu empresa' })}
            />
          )}

          <button className={classes.submit} style={{ width: mobile ? '100%' : 210 }} type="submit">
            {loading.updateProfile ? <Loading /> : 'MODIFICAR'}
          </button>
        </form>
      </div>
    </Main>
  );
};
export default withAuth(Profile, [COACHEE, COACH]);
