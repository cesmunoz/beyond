import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import Modal from 'components/Modal';
import Success from 'components/Success';
import Button from 'components/Button';

type SuccessModalProps = {
  actionText?: string;
  title: string;
  subtitle?: string;
  visible: boolean;
  filled?: boolean;
  onActionClick: () => void;
};

const ANIMATION_DURATION = 200;

export const SuccessModal: React.FC<SuccessModalProps> = ({
  title,
  visible,
  onActionClick,
  subtitle,
  filled = false,
  actionText = 'Salir',
}): JSX.Element | null => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimated(visible);
    }, ANIMATION_DURATION);
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(`transition-opacity duration-${ANIMATION_DURATION} ease-linear`, {
        'opacity-0': !animated,
        'opacity-100': animated,
      })}
    >
      <Modal.Body>
        <Success title={title} subtitle={subtitle} />
      </Modal.Body>
      <Modal.Footer center>
        <Button onClick={onActionClick} text={actionText} filled={filled} />
      </Modal.Footer>
    </div>
  );
};

SuccessModal.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onActionClick: PropTypes.func.isRequired,
  filled: PropTypes.bool,
  actionText: PropTypes.string,
  subtitle: PropTypes.string,
};

SuccessModal.defaultProps = {
  actionText: 'Salir',
  filled: false,
  subtitle: '',
};

export default SuccessModal;
