import React from 'react';
import PropTypes from 'prop-types';

type InfoSectionProps = {
  label: string;
  value?: string;
};

const InfoSection: React.FC<InfoSectionProps> = ({ label, value }) => {
  return (
    <div className="flex-1 py-4">
      <p className="font-bold text-gray-500">{label}</p>
      <p>{value}</p>
    </div>
  );
};

InfoSection.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

InfoSection.defaultProps = {
  value: '-',
};

export default InfoSection;
