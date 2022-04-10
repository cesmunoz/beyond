import React, { useState, forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { ValidAny } from '@beyond/lib/types';

import ErrorMessage from 'components/ErrorMessage';

type TextFieldProps = {
  id: string;
  label: string;
  name: string;
  onChange?: (evt: ValidAny) => void;
  containerClassName?: string;
  fullWidth?: boolean;
  gutterBottom?: boolean;
  error?: string;
  type?: string;
  value?: string | number | string[] | undefined;
  placeholder?: string;
  ref?: (ref: ValidAny) => void;
};

const TextField = forwardRef(
  (
    {
      id,
      label,
      name,
      containerClassName,
      fullWidth,
      error,
      type,
      gutterBottom,
      placeholder,
      onChange,
      ...props
    }: TextFieldProps,
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const localRef = useRef<HTMLInputElement>();
    const labelId = `${id}-label`;
    const errorId = `${id}-error`;
    const value = localRef.current ? localRef.current.value : '';

    let timeoutId: NodeJS.Timeout;

    const handleOnBlur = (): void => {
      timeoutId = setTimeout(() => {
        if (focused) {
          setFocused(false);
        }
      }, 0);
    };

    const handleOnFocus = (): void => {
      clearTimeout(timeoutId);

      if (!focused) {
        setFocused(true);
      }
    };

    return (
      <div
        className={cn('relative inline-flex flex-col text-left', {
          'w-full': fullWidth,
          'mb-4': gutterBottom && !error,
          [containerClassName || '']: containerClassName,
        })}
      >
        <label
          className={cn(
            'block absolute font-semibold tracking-beyond transition-all duration-200 ease-out select-none',
            {
              'transform -translate-y-2 text-xxs': focused || !!value,
              'transform translate-y-3 text-xs': !focused && !value,
              'text-red-500': error,
            },
          )}
          id={labelId}
          htmlFor={name}
        >
          {label}
        </label>

        <input
          aria-labelledby={labelId}
          aria-describedby={errorId}
          className={cn('input rounded-none outline-none border-solid w-full leading-7 py-1', {
            'border-b border-gray-600': !focused && !error,
            'border-b-2 border-gray-800': focused,
            'border-b-2 border-red-500': error,
          })}
          id={id}
          name={name}
          type={type}
          ref={(e: HTMLInputElement): void => {
            if (ref) {
              (ref as ValidAny)(e);
            }
            localRef.current = e;
          }}
          style={{ borderRadius: 'none' }}
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
          onChange={onChange}
          placeholder={focused ? placeholder : ''}
          {...props}
        />
        {error && <ErrorMessage className="my-1" message={error} />}
      </div>
    );
  },
);

TextField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  containerClassName: PropTypes.string,
  error: PropTypes.string,
  fullWidth: PropTypes.bool,
  gutterBottom: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.string.isRequired),
  ]),
};

TextField.defaultProps = {
  containerClassName: '',
  error: '',
  fullWidth: false,
  gutterBottom: true,
  type: 'text',
  value: undefined,
};

TextField.displayName = 'TextField';

export default TextField;
