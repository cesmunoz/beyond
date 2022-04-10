import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import useTypedSelector from 'selectors/typedSelector';
import { ChildrenProps } from 'types';

type ClassNameProps = {
  className?: string;
};

type ModalProps = {
  open: boolean;
  onClose: Function;
} & ChildrenProps;

const Modal = ({ open, onClose, children }: ModalProps): JSX.Element | null => {
  const { mobile } = useTypedSelector(state => state);
  const [animated, setAnimated] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleOnClose = (): void => {
    setAnimated(false);
  };

  const handleOnEscapeKeyPress = ({ key }: KeyboardEvent): void => {
    if (key === 'Escape' || key === 'esc') {
      handleOnClose();
    }
  };

  useEffect(() => {
    if (!animated && open) {
      setVisible(true);
    } else if (animated && !open) {
      handleOnClose();
    }
  }, [animated, open]);

  useEffect(() => {
    setAnimated(visible);
  }, [visible]);

  useEffect(() => {
    if (!animated && visible) {
      setTimeout(() => {
        setVisible(false);
        onClose(false);
      }, 200);
    }
  }, [animated]);

  useEffect(() => {
    window.addEventListener('keyup', handleOnEscapeKeyPress);

    return (): void => {
      window.removeEventListener('keyup', handleOnEscapeKeyPress);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        'transition-opacity ease-in duration-200 modal fixed full-size top-0 left-0 flex items-center justify-center z-max',
        {
          'opacity-0': !animated,
          'opacity-1': animated,
        },
      )}
      role="dialog"
    >
      <div
        className="modal-overlay absolute full-size bg-gray-900 opacity-50"
        onTouchEnd={handleOnClose}
      />
      <div
        className={cn(
          'modal-container bg-white w-11/12 md:max-w-2xl mx-auto rounded-lg shadow-lg z-50 overflow-y-auto',
          {
            'min-h-modal': !mobile,
            'h-modal': !mobile,
            'h-4/5': mobile,
          },
        )}
      >
        <div className="h-full flex-column justify-between modal-content text-left p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.Title = ({ children }: ChildrenProps): JSX.Element => {
  return (
    <div className="flex justify-between items-center pb-3">
      <p className="text-2xl font-bold">{children}</p>
    </div>
  );
};

Modal.Body = ({ children, className }: ChildrenProps & ClassNameProps): JSX.Element => (
  <div
    className={cn('h-4/5 py-8', {
      [className || '']: className,
    })}
  >
    {children}
  </div>
);

type FooterProps = {
  center?: boolean;
} & ChildrenProps;

Modal.Footer = ({ center = false, children }: FooterProps): JSX.Element => {
  const { mobile } = useTypedSelector(state => state);

  return (
    <div
      className={cn('flex items-center pt-2', {
        'flex-col': mobile,
        'justify-end': !center,
        'justify-center': center,
      })}
    >
      {children}
    </div>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
