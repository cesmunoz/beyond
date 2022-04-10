import React from 'react';
import cn from 'classnames';

import Button from 'components/Button';

type FormButtonProp = {
  loading: boolean;
  mobile: boolean;
};

type OnCloseProp = {
  onClose: () => void;
};

const FormButtons = {
  New: ({ loading, mobile }: FormButtonProp): JSX.Element => (
    <Button
      className={cn({
        'my-2': mobile,
        'ml-2': !mobile,
      })}
      loading={loading}
      text="Crear nuevo proceso"
      type="submit"
    />
  ),
  Cancel: ({ onClose }: OnCloseProp): JSX.Element => (
    <Button className="w-auto" filled={false} fullWidth={false} text="Cancelar" onClick={onClose} />
  ),
};

export default FormButtons;
