import React from 'react';
import Button from 'components/Button';
import { ValidAny } from '@beyond/lib/types';

type FileUploadProps = {
  loading: boolean;
  onFileChange: (file: ValidAny) => void;
  text: string;
  className?: string;
};

const FileUpload = ({ loading, onFileChange, text }: FileUploadProps): JSX.Element => {
  const handleOnFileChange = (e: ValidAny): void => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    return onFileChange(formData);
  };

  return (
    <div>
      <input
        className="block opacity-0 absolute cursor-pointer h-12 px-4"
        type="file"
        onChange={handleOnFileChange}
      />
      <Button loading={loading} text={text} />
    </div>
  );
};

export default FileUpload;
