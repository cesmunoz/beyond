import React from 'react';
import PropTypes from 'prop-types';
import InfoSection from './InfoSection';

type CoacheeInfoProps = {
  birthDate?: string;
  birthTime?: string;
  birthCity?: string;
  birthCountry?: string;
};

const CoacheeInfo: React.FC<CoacheeInfoProps> = ({
  birthDate,
  birthTime,
  birthCity,
  birthCountry,
}) => {
  return (
    <div className="pt-2">
      <div className="flex">
        <InfoSection label="Fecha de nacimiento" value={birthDate} />
        <InfoSection label="Hora de nacimiento" value={birthTime} />
      </div>
      <div className="flex">
        <InfoSection label="Lugar de nacimiento" value={birthCity} />
        <InfoSection label="País" value={birthCountry} />
      </div>
    </div>
  );
};

CoacheeInfo.propTypes = {
  birthDate: PropTypes.string,
  birthTime: PropTypes.string,
  birthCity: PropTypes.string,
  birthCountry: PropTypes.string,
};

CoacheeInfo.defaultProps = {
  birthCity: undefined,
  birthDate: undefined,
  birthCountry: undefined,
  birthTime: undefined,
};

export default CoacheeInfo;
