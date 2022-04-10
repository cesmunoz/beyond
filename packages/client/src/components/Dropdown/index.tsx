import React, { useState, useEffect } from 'react';
import cn from 'classnames';

import { makeStyles } from '@material-ui/core/styles';
import { Pair } from 'types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import colors from 'styles/colors';
import ErrorMessage from 'components/ErrorMessage';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: 12,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    '& .MuiInputBase-root': { lineHeight: 12 },
    fontFamily: 'Muli',
    fontWeight: 400,
    '& .MuiSelect-select:focus': {
      backgroundColor: colors.Backgrounds.White,
    },
  },
}));

type DropdownProps = {
  error?: boolean;
  items: Pair[];
  onChange?: (item: string) => void;
  value?: string;
  label: string;
};

export default ({ label, value, items, onChange, error }: DropdownProps): JSX.Element => {
  const classes = useStyles();
  const [selection, setSelection] = useState('');

  const handleOnChange = (selectedValue: string): void => {
    setSelection(selectedValue);

    if (onChange) {
      onChange(selectedValue);
    }
  };

  useEffect(() => {
    if (value) {
      handleOnChange(value);
    }
  }, [value]);

  const labelId = `${label}_dropdown`;

  return (
    <div className={cn('mb-4')}>
      <FormControl variant="outlined" className={cn(classes.formControl, 'w-full')}>
        <InputLabel shrink id={labelId}>
          {label}
        </InputLabel>
        <Select
          className="w-full bg-white rounded-lg shadow-xl"
          error={!!error}
          labelId={labelId}
          id={labelId}
          value={selection}
          inputProps={{
            name: label,
            id: labelId,
          }}
          onChange={(evt): void => handleOnChange(evt.target.value as string)}
          label={label}
        >
          <MenuItem
            className="block px-4 py-2 text-gray-800 hover:bg-indigo-500"
            aria-label="Elige..."
            value=""
          >
            Elige...
          </MenuItem>
          {!!items.length &&
            items.map(i => (
              <MenuItem
                key={i.key}
                className="block px-4 py-2 text-gray-800 hover:bg-indigo-500"
                value={i.key}
              >
                {i.value}
              </MenuItem>
            ))}
        </Select>
        {error && <ErrorMessage message="Elige una opción" />}
      </FormControl>
    </div>
  );
};
