import React from 'react';
import cn from 'classnames';
import Router from 'next/router';

import { Nullable, UserType, ValidAny } from '@beyond/lib/types';
import { COACH } from '@beyond/lib/constants';

import Button from 'components/Button';
import useTypedSelector from 'selectors/typedSelector';
import { QUESTIONNAIRE } from 'constants/routes';

import { ProcessStatus } from '@beyond/lib/enums';
import FileUpload from 'components/FileUpload';
import useStyles from './styles';

type ProcessActionsProps = {
  status: ProcessStatus;
  processId: string;
  viewType: UserType;
  excelUrlDownload: string;
  pdfUrlDownload: string;
  onFileChange: (file: ValidAny) => void;
  collaborators: ValidAny[];
  isTeamProcess?: boolean;
};

const ProcessActions = ({
  processId,
  excelUrlDownload,
  pdfUrlDownload,
  viewType,
  status,
  onFileChange,
  collaborators,
  isTeamProcess,
}: ProcessActionsProps): JSX.Element => {
  const classes = useStyles();
  const isCoach = viewType === COACH;
  const {
    mobile,
    loading,
    auth: { email },
  } = useTypedSelector(state => state);

  const handleOnCompleteProcessClick = (): void => {
    Router.push(`${QUESTIONNAIRE}?id=${processId}`);
  };

  const handleOnDownloadClick = (url: string) => (): void => {
    window.open(url);
  };

  const getButtonsActions = (): Nullable<JSX.Element> => {
    const completeProcessButton = (
      <Button
        className={cn({
          [classes.button]: mobile,
        })}
        text="Completar Proceso"
        onClick={handleOnCompleteProcessClick}
      />
    );

    switch (status) {
      case ProcessStatus.PendingAnswers:
      case ProcessStatus.PartialAnswered:
        return !isCoach ? completeProcessButton : null;
      case ProcessStatus.WaitingEvaluators: {
        if (isCoach || !isTeamProcess) {
          return null;
        }

        const collabAnswers = (collaborators || []).find(c => c.email === email)?.answers;

        if (collabAnswers && Object.keys(collabAnswers).length) {
          return null;
        }

        return completeProcessButton;
      }
      case ProcessStatus.PendingReview:
        return isCoach ? (
          <>
            <Button onClick={handleOnDownloadClick(excelUrlDownload)} text="Descargar proceso" />
            <FileUpload
              loading={loading.uploadReport}
              onFileChange={onFileChange}
              text="Subir informe"
            />
          </>
        ) : null;
      case ProcessStatus.Finished:
        return (
          <>
            {isCoach && (
              <FileUpload
                loading={loading.uploadReport}
                onFileChange={onFileChange}
                text="Actualizar informe"
              />
            )}
            <Button onClick={handleOnDownloadClick(pdfUrlDownload)} text="Descargar informe" />
          </>
        );
      default:
        return null;
    }
  };

  return <div className="flex space-x-2">{getButtonsActions()}</div>;
};

export default ProcessActions;
