import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { CoacheeFormData } from '@beyond/lib/types/coachees';
import Validator from 'validator';

import Modal from 'components/Modal';
import useTypedSelector from 'selectors/typedSelector';
import ErrorMessage from 'components/ErrorMessage';
import FormButtons from './FormButtons';
import FormInputs from './FormInputs';

type CoacheeFormProps = {
  error?: string;
  visible: boolean;
  onNewCoacheeSubmit: (coachee: CoacheeFormData) => void;
  onClose: () => void;
};

export const CoacheeForm: React.FC<CoacheeFormProps> = ({
  error,
  visible,
  onNewCoacheeSubmit,
  onClose,
}): JSX.Element | null => {
  const { errors, handleSubmit, register } = useForm<CoacheeFormData>();
  const {
    mobile,
    loading: { newCoachee: loading },
  } = useTypedSelector(state => state);

  const handleCoacheeSubmit = handleSubmit(coachee => {
    onNewCoacheeSubmit(coachee);
  });

  if (!visible) {
    return null;
  }

  return (
    <form noValidate onSubmit={handleCoacheeSubmit}>
      <Modal.Title>Ingresa los datos del coachee</Modal.Title>
      <Modal.Body>
        {mobile ? (
          <>
            <FormInputs.Email
              error={errors.email?.message?.toString()}
              mobile={mobile}
              ref={register({
                required: 'El correo electrónico es requerido',
                validate: (value: string) =>
                  Validator.isEmail(value) || 'El correo debe tener un formato valido.',
              })}
            />
            <FormInputs.FullName ref={register} mobile={mobile} />
            <FormInputs.Company ref={register} />
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <FormInputs.Email
                error={errors.email?.message?.toString()}
                mobile={mobile}
                ref={register({
                  required: 'El correo electrónico es requerido',
                  validate: value =>
                    Validator.isEmail(value) || 'El correo debe tener un formato valido.',
                })}
              />
              <FormInputs.FullName ref={register} mobile={mobile} />
            </div>
            <div className="flex pt-4 w-6/12">
              <FormInputs.Company ref={register} />
            </div>
          </>
        )}
        {error && <ErrorMessage message={error} className="margin-auto" />}
      </Modal.Body>
      <Modal.Footer>
        {mobile ? (
          <>
            <FormButtons.New loading={loading} mobile={mobile} />
            <FormButtons.Cancel onClose={onClose} />
          </>
        ) : (
          <>
            <FormButtons.Cancel onClose={onClose} />
            <FormButtons.New loading={loading} mobile={mobile} />
          </>
        )}
      </Modal.Footer>
    </form>
  );
};

CoacheeForm.propTypes = {
  error: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onNewCoacheeSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

CoacheeForm.defaultProps = {
  error: '',
};

export default CoacheeForm;
