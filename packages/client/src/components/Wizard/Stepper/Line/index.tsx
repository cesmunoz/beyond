import React from 'react';
import cn from 'classnames';

import useStyles from './styles';

type FilledProps = {
  filled: boolean;
};

const Line = ({ filled }: FilledProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className="w-0">
      <div>
        <div
          className={cn(
            'relative flex align-center items-center align-middle content-center',
            classes.lineContainer,
          )}
        >
          <div className="w-full rounded items-center align-middle align-center flex-1">
            <div
              className={cn('w-0 rounded', classes.line, {
                [classes.filled]: filled,
                [classes.unfilled]: !filled,
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Line;
