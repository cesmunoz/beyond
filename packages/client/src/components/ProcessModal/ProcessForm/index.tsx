import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { ProcessFormData } from '@beyond/lib/types/processes';
import { ProcessType } from '@beyond/lib/enums';

import Autocomplete from 'components/Autocomplete';
import ErrorMessage from 'components/ErrorMessage';
import Modal from 'components/Modal';
import useTypedSelector from 'selectors/typedSelector';
import { getCoachees } from 'api/coachees';
import { getCoacheesList } from 'selectors/coachees';
import { Pair } from 'types';
import ProcessTypeInput from './ProcessTypeInput';
import FormButtons from './FormButtons';

type ProcessFormProps = {
  error?: string;
  visible: boolean;
  onNewProcessSubmit: (process: ProcessFormData) => void;
  onClose: () => void;
};

type LocalFormData = {
  coachees: Pair[];
  type: ProcessType;
};

export const ProcessForm: React.FC<ProcessFormProps> = ({
  error,
  visible,
  onNewProcessSubmit,
  onClose,
}): JSX.Element | null => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCoachees());
  }, []);

  const { errors, handleSubmit, register, control } = useForm<LocalFormData>();
  const {
    mobile,
    loading: { newProcess: loading },
  } = useTypedSelector(state => state);
  const coacheesItems = useTypedSelector(getCoacheesList);
  const [coacheesError, setCoacheesError] = useState('');

  const handleProcessSubmit = handleSubmit(process => {
    setCoacheesError('');
    const coachees = (process.coachees || []).map(c => c.key);

    if (coachees.length === 0) {
      setCoacheesError('Debes seleccionar al menos un coachee.');

      return;
    }

    onNewProcessSubmit({
      coachees: coacheesItems.filter(c => coachees.includes(c.email)),
      type: process.type,
    });
  });

  const handleOnCoacheesChange = (): void => {
    setCoacheesError('');
  };

  if (!visible) {
    return null;
  }

  return (
    <form className="h-full" noValidate onSubmit={handleProcessSubmit}>
      <Modal.Title>Nuevo proceso</Modal.Title>
      <Modal.Body
        className={cn({
          'max-h-process-mobile': mobile,
          'max-h-process-desktop': !mobile,
        })}
      >
        <Controller
          as={
            <Autocomplete
              onCoacheeChange={handleOnCoacheesChange}
              error={coacheesError}
              items={coacheesItems.map(c => ({ key: c.email, value: c.fullName }))}
            />
          }
          control={control}
          name="coachees"
        />
        <div>
          <div className="flex-column">
            <span className="mb-4 mt-6">Tipo de Proceso</span>
            <ProcessTypeInput register={register} type={ProcessType.SINGLE} />
            <ProcessTypeInput register={register} type={ProcessType.TEAM} />
            {errors.type && (
              <ErrorMessage
                className="margin-auto"
                message={errors.type.message?.toString() || ''}
              />
            )}
          </div>
        </div>
        {error && <ErrorMessage className="margin-auto" message={error} />}
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

ProcessForm.propTypes = {
  error: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onNewProcessSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

ProcessForm.defaultProps = {
  error: '',
};

export default ProcessForm;
