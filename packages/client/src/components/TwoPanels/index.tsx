import React, { useRef, useState, useEffect } from 'react';
import cn from 'classnames';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Button from 'components/Button';
import Loading from 'components/Loading';

import { ValidAny } from '@beyond/lib/types';
import makeUseStyles from './styles';

type TwoPanelsProps = {
  mobile: boolean;
  title: string;
  loading: boolean;
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  isEmpty: boolean;
  onNewItemClick: () => void;
  hideNewButton?: boolean;
};

export const TwoPanels = ({
  mobile,
  onNewItemClick,
  title,
  loading,
  leftPanel,
  isEmpty,
  rightPanel,
  hideNewButton,
}: TwoPanelsProps): JSX.Element => {
  const [isOverflowed, setIsOverflowed] = useState(false);
  const scrollableListRef = useRef<HTMLDivElement>();
  const useStyles = makeUseStyles(mobile);
  const classes = useStyles();

  useEffect(() => {
    const element = scrollableListRef.current;

    if (!element || loading) {
      return;
    }

    const hasOverflowingChildren =
      element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth;

    setIsOverflowed(hasOverflowingChildren);
  }, [loading]);

  const button = !hideNewButton && (
    <Button
      onClick={onNewItemClick}
      className={cn(classes.button, 'min-w-btn', {
        [classes.overflowedButton]: isOverflowed && !mobile,
      })}
      text={`NUEVO ${title.toLocaleUpperCase()}`}
    />
  );

  return (
    <div className="flex h-full w-full">
      <div
        className={cn('flex flex-col justify-between h-full', classes.leftPanel, {
          [classes.leftPanelDesktop]: !mobile,
          'w-5/12': !mobile,
          'w-full': mobile,
          'pt-12': !mobile,
          'pt-20': mobile,
        })}
      >
        <div className={cn('flex flex-col justify-between h-full', classes.leftPanelContent)}>
          {!mobile && (
            <Box
              className={classes.headerContainer}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography className={classes.header} variant="h6">
                {`${title}s`}
              </Typography>
              {isEmpty && button}
            </Box>
          )}
          <div
            ref={scrollableListRef as ValidAny}
            className={cn(classes.coacheesContainer, classes.scrollable, {
              'flex justify-center': loading,
            })}
          >
            {loading ? (
              <Loading className={classes.loading} />
            ) : (
              <>
                {leftPanel}
                {!isOverflowed && !mobile && !isEmpty && (
                  <div className="flex justify-end">{button}</div>
                )}
              </>
            )}
          </div>
        </div>
        {(isOverflowed || mobile) && !hideNewButton && (
          <div className={classes.buttonContainer}>{button}</div>
        )}
      </div>
      {!mobile && (
        <div
          className={cn(
            'flex flex-col justify-between h-full w-7/12 p-12 bg-white overflow-auto',
            classes.rightPanel,
          )}
        >
          {rightPanel}
        </div>
      )}
    </div>
  );
};

export default TwoPanels;
