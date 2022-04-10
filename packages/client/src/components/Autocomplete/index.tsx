import React, { useState } from 'react';
import cn from 'classnames';
import Downshift from 'downshift';
import TextField from 'components/TextField';
import { Nullable } from '@beyond/lib/types';
import { Pair } from 'types';
import DropdownOptions from 'components/Dropdown/DropdownOptions';
import Pills from './Pills';

type AutocompleteProps = {
  error?: string;
  fullWidth?: boolean;
  items: Pair[];
  onChange?: (items: Pair[]) => void;
  onCoacheeChange: (items: Pair[]) => void;
  value?: string;
};

export default ({
  items,
  onChange,
  onCoacheeChange,
  error,
  fullWidth,
}: AutocompleteProps): JSX.Element => {
  const [selection, setSelection] = useState<Pair[]>([]);

  const handleOnChange = (newSelection: Pair[]): void => {
    setSelection(newSelection);
    onCoacheeChange(newSelection);

    if (onChange) {
      onChange(newSelection);
    }
  };

  const handleOnItemSelection = (selectedItem: Nullable<Pair>): void => {
    if (!selectedItem) {
      return;
    }

    const newSelection = [selectedItem];
    handleOnChange(newSelection);
  };

  const handleOnItemRemoval = (item: string): void => {
    const newSelection = selection.filter(s => s.key !== item);
    handleOnChange(newSelection);
  };

  return (
    <Downshift onChange={handleOnItemSelection} itemToString={(): string => ''}>
      {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue }): JSX.Element => {
        return (
          <div
            className={cn('mb-4', {
              'w-6/12': !fullWidth,
              'w-full': fullWidth,
            })}
          >
            <TextField
              {...getInputProps()}
              error={error}
              id="coachee"
              name="coachee"
              gutterBottom={false}
              fullWidth
              label="Nombre y Apellido"
            />
            <DropdownOptions
              visible={isOpen}
              items={items}
              getItemProps={getItemProps}
              getMenuProps={getMenuProps}
              inputValue={inputValue || ''}
            />
            <Pills items={selection} onItemRemoval={handleOnItemRemoval} />
          </div>
        );
      }}
    </Downshift>
  );
};
