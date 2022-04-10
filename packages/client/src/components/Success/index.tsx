import React from 'react';
import PropTypes from 'prop-types';

type SuccessProps = {
  title: string;
  subtitle?: string;
};

const Success: React.FC<SuccessProps> = ({ title, subtitle }) => (
  <div className="flex flex-col items-center">
    <img src="/success-cloud.svg" alt="¡Listo!" />
    <h4 className="mt-6 mb-4">¡Listo!</h4>
    <h2 className="text-3xl text-center font-extrabold">{title}</h2>
    {subtitle && (
      // eslint-disable-next-line
      <h4 className="mt-4 mb-10" dangerouslySetInnerHTML={{ __html: subtitle }} />
    )}
  </div>
);

Success.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

Success.defaultProps = {
  subtitle: '',
};

export default Success;
