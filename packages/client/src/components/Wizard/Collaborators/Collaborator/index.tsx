import React from 'react';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import TextField from 'components/TextField';
import Validator from 'validator';
import { ValidAny } from '@beyond/lib/types';
import { Divider } from '@material-ui/core';
import useStyles from './styles';

type CollaboratorProps = {
  index: number;
  opened: boolean;
  email?: string;
  role?: string;
  errors: ValidAny;
  reference: ValidAny;
  onRemoveClick: (index: number) => void;
  isTeamProcess: boolean;
};

const Collaborator = ({
  index,
  email,
  role,
  errors,
  reference,
  opened,
  onRemoveClick,
  isTeamProcess,
}: CollaboratorProps): JSX.Element => {
  const classes = useStyles();

  const fieldName = `collaborators[${index}]`;
  const collaboratorNumber = `${(index + 1).toString().padStart(2, '0')}.`;

  return (
    <div className="flex mb-8">
      <span className={cn('font-bold', classes.index)}>{collaboratorNumber}</span>
      {opened ? (
        <div className="flex justify-between w-full">
          <div className="w-11/12">
            <TextField
              fullWidth
              id={`${fieldName}.email`}
              label="Correo electrónico"
              name={`${fieldName}.email`}
              gutterBottom={false}
              containerClassName="mb-4"
              error={errors?.email?.message}
              ref={reference({
                required: 'Debes completar el correo electrónico',
                validate: (value: string) =>
                  Validator.isEmail(value) || 'El correo debe tener un formato valido.',
              })}
            />
            {!isTeamProcess && (
              <TextField
                fullWidth
                id={`${fieldName}.role`}
                label="Relación"
                name={`${fieldName}.role`}
                gutterBottom={false}
                error={errors?.role?.message}
                ref={reference({ required: 'Debes completar la relación' })}
              />
            )}
          </div>
          <button
            className="outline-none self-start mt-2"
            onClick={(): void => onRemoveClick(index)}
            type="button"
          >
            <FontAwesomeIcon color="rgba(29, 29, 38, 0.1)" icon={faTrash} />
          </button>
        </div>
      ) : (
        <div className="flex-column w-full">
          <div className="flex justify-between">
            <div className="flex-column">
              <span className={cn('font-bold', classes.email)}>{email}</span>
              {!isTeamProcess && <span className={cn('font-semibold', classes.role)}>{role}</span>}
            </div>
            <button
              className="outline-none"
              onClick={(): void => onRemoveClick(index)}
              type="button"
            >
              <FontAwesomeIcon color="rgba(29, 29, 38, 0.1)" icon={faTrash} />
            </button>
          </div>
          <Divider style={{ marginTop: 20 }} />
        </div>
      )}
    </div>
  );
};

export default Collaborator;
