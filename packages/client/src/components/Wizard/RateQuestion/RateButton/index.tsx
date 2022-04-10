import React from 'react';
import cn from 'classnames';
import useStyles from './styles';

type RateButtonProps = {
  rate: number;
  selected: boolean;
  first: boolean;
  last: boolean;
  onClick: (rate: number) => void;
};

const RateButton = ({ onClick, rate, selected, first, last }: RateButtonProps): JSX.Element => {
  const classes = useStyles();

  return (
    <button
      onClick={(): void => onClick(rate)}
      type="button"
      style={{ width: rate === 3 ? '59px' : '51px' }}
      className={cn(
        'font-bold py-2 px-4 outline-none focus:outline-none active:outline-none',
        classes.base,
        {
          [classes.unselected]: !selected,
          [classes.selected]: selected,
          [classes.first]: first,
          [classes.middle]: !first && !last,
          [classes.last]: last,
        },
      )}
    >
      {rate}
    </button>
  );
};

export default RateButton;
