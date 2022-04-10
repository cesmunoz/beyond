import { faCamera } from '@fortawesome/free-solid-svg-icons';
import Avatar from '@material-ui/core/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import { getInitials } from 'utils/textTransform';

import { useEffect, useState } from 'react';
import { ValidAny } from '@beyond/lib/types';
import useStyles from './styles';

type PictureUploadProps = {
  avatarUrl?: string;
  fullName: string;
  onFileChange: (file: ValidAny) => void;
};

const PictureUpload = ({ onFileChange, avatarUrl, fullName }: PictureUploadProps): JSX.Element => {
  const classes = useStyles();
  const [imageUrl, setImageUrl] = useState(avatarUrl);

  useEffect(() => {
    setImageUrl(avatarUrl);
  }, [avatarUrl]);

  const handleOnFileChange = (e: ValidAny): void => {
    const file = e.target.files[0];
    setImageUrl(URL.createObjectURL(file));
    onFileChange(file);
  };

  return (
    <div className={classes.container}>
      {imageUrl ? (
        <img
          className={cn('rounded-full', classes.avatar, classes.image)}
          alt="profile"
          src={imageUrl}
        />
      ) : (
        <Avatar className={cn('rounded-full', classes.avatar, classes.initials)} alt="John Smith">
          {getInitials(fullName)}
        </Avatar>
      )}
      <div className={classes.uploadContainer}>
        <input
          className={cn('block opacity-0 absolute h-12 rounded-full cursor-pointer', classes.input)}
          type="file"
          onChange={handleOnFileChange}
        />
        <button className={cn('rounded-full', classes.button)} type="button">
          <FontAwesomeIcon
            className={classes.icon}
            icon={faCamera}
            style={{ width: 20, height: 18 }}
          />
        </button>
      </div>
    </div>
  );
};
export default PictureUpload;
