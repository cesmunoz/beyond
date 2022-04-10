import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ValidAny } from '@beyond/lib/types';
import { COACH } from '@beyond/lib/constants';
import { ProcessStatus, ProcessType } from '@beyond/lib/enums';

import APIStatus from 'constants/apiStatus';
import { getProcess, uploadReport } from 'api/processes';
import Loading from 'components/Loading';
import ProcessActions from 'components/ProcessDetail/ProcessActions';
import ProcessState from 'components/ProcessDetail/ProcessStatus';
import ProcessAnswers from 'components/ProcessDetail/ProcessAnswers';
import { getRoleSelector } from 'selectors/auth';
import { getProcessSelector } from 'selectors/processes';
import useTypedSelector from 'selectors/typedSelector';
import { parseProcessKey } from 'utils/processes';
import Button from 'components/Button';
import ProcessTitle from './ProcessTitle';

type ProcessDetailProps = {
  processKey: string;
};

const ProcessDetail: React.FC<ProcessDetailProps> = ({ processKey }) => {
  const [apiStatus, setAPIStatus] = useState(APIStatus.Idle);
  const dispatch = useDispatch();
  const viewType = useTypedSelector(getRoleSelector);
  const process = useTypedSelector(state => getProcessSelector(state, processKey)) || {
    mainCoachee: {},
  };
  const {
    loading: { processDetail: loading },
    api: { uploadReport: uploadReportApiStatus },
  } = useTypedSelector(state => state);

  const [processId] = parseProcessKey(processKey || '');

  useEffect(() => {
    if (!processId) {
      return;
    }

    dispatch(getProcess(processId));
  }, [processId]);

  useEffect(() => {
    setAPIStatus(uploadReportApiStatus);
  }, [uploadReportApiStatus]);

  useEffect(() => {
    if (apiStatus === APIStatus.Success) {
      dispatch(getProcess(processId));
    }
  }, [apiStatus]);

  const handleOnFileChange = (file: ValidAny): void => {
    dispatch(uploadReport((process as ValidAny).reportPdfUploadUrl, processId, file));
  };

  const handleOnDownloadClick = (url: string) => (): void => {
    window.open(url);
  };

  return (
    <div className="space-y-6 align-middle overflow-x-hidden">
      {!loading && process !== undefined ? (
        <>
          <ProcessState isExpired={process.isExpired} status={process.status} />
          <ProcessTitle
            isExpired={process.isExpired}
            viewType={viewType}
            status={process.status}
            processType={process.type}
            date={process.updatedDate || process.createdDate}
            userFullName={process.mainCoachee.fullName}
            userEmail={process.mainCoachee.email}
          />
          <ProcessActions
            excelUrlDownload={process.report}
            pdfUrlDownload={process.reportPdf}
            processId={process.processId}
            viewType={viewType}
            status={process.status}
            onFileChange={handleOnFileChange}
            isTeamProcess={process.type === ProcessType.TEAM}
            collaborators={process.collaborators}
          />
          <ProcessAnswers viewType={viewType} process={process} />
          {viewType === COACH && process.status === ProcessStatus.Finished && (
            <div className="flex justify-end">
              <Button
                onClick={handleOnDownloadClick(process.report)}
                filled={false}
                className="f"
                text="Descargar proceso"
              />
            </div>
          )}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

ProcessDetail.propTypes = {
  processKey: PropTypes.string.isRequired,
};

export default ProcessDetail;
