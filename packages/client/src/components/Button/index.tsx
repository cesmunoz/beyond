import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';

type ButtonProps = {
  text: React.ReactNode;
  className?: string;
  filled?: boolean;
  fullWidth?: boolean;
  light?: boolean;
  loading?: boolean;
  name?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  text,
  className,
  filled,
  light,
  fullWidth,
  loading,
  name,
  type,
  onClick,
}) => {
  /*
   * JSX line disabled for ESLint due to questionable rule implementation
   */

  return (
    // eslint-disable-next-line react/button-has-type
    <button
      name={name}
      type={type || 'button'}
      className={cn(
        `flex-center-x h-12 max-w-btn rounded-xl font-extrabold tracking-widest uppercase outline-none focus:outline-none active:outline-none`,
        {
          'bg-light-blue text-white': filled && !light,
          'text-light-blue': !filled && !light,
          'w-full': fullWidth,
          'min-w-btn': !className,
          'bg-light-turquoise text-turquoise': light,
          [className || '']: className,
        },
      )}
      onClick={onClick}
    >
      {loading ? <Loading /> : text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.node.isRequired,
  name: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
  filled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  light: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit']),
};

Button.defaultProps = {
  name: 'btn',
  className: '',
  type: 'button',
  loading: false,
  filled: true,
  light: false,
  fullWidth: true,
  onClick: undefined,
};

export default Button;
