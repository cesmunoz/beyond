import React from 'react';
import cn from 'classnames';

import useStyles from './styles';

type FilledProps = {
  filled?: boolean;
};

type DotProps = {
  mini?: boolean;
} & FilledProps;

const Dot = ({ mini, filled }: DotProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div>
        <div
          className={cn('relative mx-auto rounded-full', classes.base, {
            [classes.mini]: mini,
            [classes.normal]: !mini,
            [classes.filled]: filled,
            [classes.unfilled]: !filled,
          })}
        />
      </div>
    </div>
  );
};

export default Dot;
