import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ProcessFormData } from '@beyond/lib/types/processes';

import Modal from 'components/Modal';
import APIStatus from 'constants/apiStatus';
import useTypedSelector from 'selectors/typedSelector';

import SuccessModal from 'components/SuccessModal';
import ProcessForm from './ProcessForm';

type ProcessModalProps = {
  open: boolean;
  onClose: () => void;
  onNewProcessSubmit: (coachee: ProcessFormData) => void;
};

export const ProcessModal: React.FC<ProcessModalProps> = ({
  open,
  onClose,
  onNewProcessSubmit,
}): JSX.Element => {
  const {
    api: { newProcess: apiStatus },
  } = useTypedSelector(state => state);

  const [processAPIStatus, setProcessAPIStatus] = useState(apiStatus);

  const handleOnClose = (): void => {
    onClose();
  };

  useEffect(() => {
    setProcessAPIStatus(apiStatus);
  }, [apiStatus]);

  useEffect(() => {
    if (!open) {
      setProcessAPIStatus(APIStatus.Idle);
    }
  }, [open]);

  return (
    <Modal onClose={onClose} open={open}>
      <SuccessModal
        title="Proceso Creado"
        onActionClick={handleOnClose}
        visible={processAPIStatus === APIStatus.Success}
      />
      <ProcessForm
        error={
          processAPIStatus === APIStatus.Failure
            ? 'Hubo un error al intentar crear un nuevo proceso. Intentalo de nuevo, por favor.'
            : ''
        }
        visible={processAPIStatus !== APIStatus.Success}
        onClose={handleOnClose}
        onNewProcessSubmit={onNewProcessSubmit}
      />
    </Modal>
  );
};

ProcessModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onNewProcessSubmit: PropTypes.func.isRequired,
};

export default ProcessModal;
