import React from 'react';
import cn from 'classnames';

import useTypedSelector from 'selectors/typedSelector';
import Controls from '../Controls';
import { OnStepChangeProp, OnSaveClickProp } from '..';

import { useDesktopStyles, useMobileStyles } from './styles';

type InterludeProps = {
  title: string;
  subtitle: string;
} & OnStepChangeProp &
  OnSaveClickProp;

const Interlude = ({ title, subtitle, onSaveClick, onStepChange }: InterludeProps): JSX.Element => {
  const { mobile } = useTypedSelector(state => state);
  const classes = mobile ? useMobileStyles() : useDesktopStyles();

  return (
    <div>
      <div className="flex flex-col h-full -mt-8">
        <h4 className={cn(classes.base, classes.welcome)}>{subtitle}</h4>
        <h2 className={cn(classes.base, classes.title)}>{title}</h2>
      </div>
      <Controls
        containerClassName={classes.controls}
        onSaveClick={onSaveClick}
        onStepChange={onStepChange}
      />
    </div>
  );
};

export default Interlude;
