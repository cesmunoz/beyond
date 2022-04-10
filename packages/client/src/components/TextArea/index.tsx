import React, { useState, useRef } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { ValidAny } from '@beyond/lib/types';

import ErrorMessage from 'components/ErrorMessage';

import useStyles from './styles';

type TextAreaProps = {
  id: string;
  placeholder: string;
  onChange?: (evt: ValidAny) => void;
  error?: string;
  value?: string | undefined;
  maxLength?: number;
};

const TextArea = ({
  error,
  placeholder,
  onChange,
  maxLength = 250,
}: TextAreaProps): JSX.Element => {
  const classes = useStyles();
  const localRef = useRef<HTMLTextAreaElement>();
  const [textAreaMetadata, setTextAreaMetadata] = useState({ rows: 1, minRows: 1 });
  const [focused, setFocused] = useState(false);
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

  const handleOnChange = (evt: ValidAny): void => {
    if (evt.target.value.length > maxLength) {
      return;
    }

    const textareaLineHeight = 20;
    const { minRows } = textAreaMetadata;

    const previousRows = evt.target.rows;

    /* eslint-disable */
    evt.target.rows = minRows;
    const currentRows = ~~(evt.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      evt.target.rows = currentRows;
    }

    evt.target.rows = currentRows;
    evt.target.scrollTop = evt.target.scrollHeight;
    /* eslint-enable */

    setTextAreaMetadata({
      ...textAreaMetadata,
      rows: currentRows,
    });

    if (onChange) {
      onChange(evt);
    }
  };

  return (
    <div className="mt-20 text-right">
      <textarea
        className={cn(
          'input rounded-none outline-none border-solid w-full leading-7 py-1',
          classes.textArea,
          {
            'border-b border-gray-600': !focused && !error,
            'border-b-2 border-gray-800': focused,
            'border-b-2 border-red-500': error,
          },
        )}
        ref={localRef as ValidAny}
        rows={textAreaMetadata.rows}
        value={value}
        placeholder={placeholder}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
      />
      <span className="mt-2 text-xs">
        {value?.length}/{maxLength}
      </span>
      {error && <ErrorMessage className="my-1" message={error} />}
    </div>
  );
};

TextArea.propTypes = {
  error: PropTypes.string,
};

TextArea.defaultProps = {
  error: '',
};

TextArea.displayName = 'TextArea';

export default TextArea;
