import React from 'react';
import cn from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';

type LoadingProps = {
  className?: string;
};

const Loading = ({ className }: LoadingProps): JSX.Element => (
  <CircularProgress
    className={cn({
      [className || '']: className,
    })}
    size="26px"
    color="primary"
  />
);

export default Loading;
