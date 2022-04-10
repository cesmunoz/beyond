import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CoacheeFormData } from '@beyond/lib/types/coachees';

import Modal from 'components/Modal';
import APIStatus from 'constants/apiStatus';
import useTypedSelector from 'selectors/typedSelector';

import SuccessModal from 'components/SuccessModal';
import CoacheeForm from './CoacheeForm';

type CoacheeModalProps = {
  open: boolean;
  onClose: () => void;
  onNewCoacheeSubmit: (coachee: CoacheeFormData) => void;
};

export const CoacheeModal: React.FC<CoacheeModalProps> = ({
  open,
  onClose,
  onNewCoacheeSubmit,
}): JSX.Element => {
  const {
    api: { newCoachee: apiStatus },
  } = useTypedSelector(state => state);

  const [coacheeAPIStatus, setCoacheeAPIStatus] = useState(apiStatus);

  const handleOnClose = (): void => {
    onClose();
  };

  useEffect(() => {
    setCoacheeAPIStatus(apiStatus);
  }, [apiStatus]);

  useEffect(() => {
    if (!open) {
      setCoacheeAPIStatus(APIStatus.Idle);
    }
  }, [open]);

  return (
    <Modal onClose={onClose} open={open}>
      <SuccessModal
        title="Coachee Creado"
        onActionClick={handleOnClose}
        visible={coacheeAPIStatus === APIStatus.Success}
      />
      <CoacheeForm
        error={
          coacheeAPIStatus === APIStatus.Failure
            ? 'Hubo un error al intentar agregar el nuevo coachee. Intentalo de nuevo, por favor.'
            : ''
        }
        visible={coacheeAPIStatus !== APIStatus.Success}
        onClose={handleOnClose}
        onNewCoacheeSubmit={onNewCoacheeSubmit}
      />
    </Modal>
  );
};

CoacheeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onNewCoacheeSubmit: PropTypes.func.isRequired,
};

export default CoacheeModal;
