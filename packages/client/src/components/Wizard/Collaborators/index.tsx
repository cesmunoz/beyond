import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';

import { MAX_COLLABORATORS, MIN_COLLABORATORS } from '@beyond/lib/constants';
import { CollaboratorFormData } from '@beyond/lib/types/processes';

import Button from 'components/Button';

import { setCollaborators } from 'appState/form';
import useTypedSelector from 'selectors/typedSelector';
import Collaborator from './Collaborator';
import useStyles from './styles';
import Controls from '../Controls';
import { OnStepChangeProp, OnSaveClickProp } from '..';

type CollaboratorsProps = {
  isTeamProcess: boolean;
} & OnStepChangeProp &
  OnSaveClickProp;

const Collaborators = ({
  isTeamProcess,
  onStepChange,
  onSaveClick,
}: CollaboratorsProps): JSX.Element => {
  const [saved, setSaved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { mobile } = useTypedSelector(state => state);
  const collaboratorsData = useTypedSelector(
    state => state.form.collaborators.filter(c => c.email !== state.auth.email) || [],
  );
  const dispatch = useDispatch();
  const classes = useStyles();

  const [error, setError] = useState('');
  const [openedCollab, setOpenedCollab] = useState(0);

  const { register, watch, errors, control, triggerValidation } = useForm<{
    collaborators: CollaboratorFormData[];
  }>({
    defaultValues: {
      collaborators: collaboratorsData.length ? collaboratorsData : [{}],
    },
  });

  const { fields, append, remove } = useFieldArray<CollaboratorFormData>({
    control,
    name: 'collaborators',
  });

  const handleOnOpenedCollabChange = (index: number): void => setOpenedCollab(index);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [fields]);

  useEffect(() => {
    handleOnOpenedCollabChange(fields.length - 1);
  }, [fields]);

  const { collaborators } = watch({ nest: true });

  const validateCollaborators = async (): Promise<boolean> => {
    const validCollab = await triggerValidation();

    if (!validCollab) {
      const collabError = (errors.collaborators || []).findIndex(
        d => !d || (d && (d.email || d.role)),
      );

      if (collabError !== -1) {
        return false;
      }
    }

    return true;
  };

  const handleOnAddCollaboratorClick = async (): Promise<void> => {
    if (!(await validateCollaborators())) {
      return;
    }

    if (fields.length === MAX_COLLABORATORS) {
      setError('Solo podes agregar 10 colaboradores.');
      return;
    }

    append({} as CollaboratorFormData);
  };

  const handleOnStepChange = (step: number): void => {
    if (step === -1) {
      onStepChange(step);
      return;
    }

    dispatch(setCollaborators(collaborators));
    onStepChange(step);
  };

  const handleOnRemoveClick = (index: number): void => {
    remove(index);
  };

  const handleOnSaveClick = async (): Promise<void> => {
    if (!(await validateCollaborators())) {
      return;
    }

    if (!isTeamProcess && fields.length < MIN_COLLABORATORS) {
      setError('Debes agregar 5 colaboradores mínimo.');
      return;
    }

    dispatch(setCollaborators(collaborators));
  };

  useEffect(() => {
    if (!collaboratorsData.length || saved) {
      return;
    }

    setSaved(true);
    onSaveClick!();
  }, [collaboratorsData, onSaveClick]);

  return (
    <div className="full-size">
      <div
        className={cn('h-4/5 overflow-y-scroll overflow-x-hidden flex-column', classes.container)}
        ref={containerRef}
      >
        <h3 className={cn('font-extrabold mb-8', classes.title)}>
          {isTeamProcess
            ? 'Incluye a todos los miembros del equipo que quieras que participen del proceso.'
            : 'Entre los 5 colaboradores que elijas, te sugerimos incluir a tu jefe directo y pares.'}
        </h3>

        <div className="mt-2">
          {fields &&
            fields.map(({ id, email, role }, index) => (
              <Collaborator
                key={id}
                errors={errors.collaborators?.[index]}
                email={
                  collaborators?.[index]?.email !== undefined
                    ? collaborators?.[index]?.email
                    : email
                }
                role={
                  collaborators?.[index]?.role !== undefined ? collaborators?.[index]?.role : role
                }
                index={index}
                opened={openedCollab === index}
                onRemoveClick={handleOnRemoveClick}
                reference={register}
                isTeamProcess={isTeamProcess}
              />
            ))}
        </div>
      </div>

      <Button
        type="button"
        text={isTeamProcess ? 'Añadir miembro' : 'Añadir colaborador'}
        className="mt-2"
        onClick={handleOnAddCollaboratorClick}
      />
      {error}

      <Controls
        containerClassName={cn('mt-10', {
          [classes.mobileControlsContainer]: mobile,
        })}
        isFinalStep
        onSaveClick={handleOnSaveClick}
        onStepChange={handleOnStepChange}
      />
    </div>
  );
};

export default Collaborators;
