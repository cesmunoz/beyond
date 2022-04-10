import React from 'react';
import cn from 'classnames';

type ErrorMessageProps = {
  message: string;
  className?: string;
};

const ErrorMessage = ({ message, className }: ErrorMessageProps): JSX.Element => (
  <span
    role="alert"
    className={cn('text-red-500 text-xs', {
      [className || '']: className,
    })}
  >
    {message}
  </span>
);

export default ErrorMessage;
