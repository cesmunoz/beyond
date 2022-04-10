import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import useTypedSelector from 'selectors/typedSelector';

type BoxProps = {
  children: React.ReactNode;
  className?: string;
};

const Box: React.FC<BoxProps> = ({ className, children }) => {
  const { mobile } = useTypedSelector(state => state);

  return (
    <div
      role="region"
      className={cn(
        'flex-column items-center justify-around bg-white rounded-lg px-8 max-w-9/10 shadow-xl',
        {
          'full-size': mobile,
          'desktop-paper': !mobile && !className,
          [className || '']: className,
        },
      )}
    >
      {children}
      <style jsx>
        {`
          .desktop-paper {
            height: 400px;
            width: 400px;
          }
        `}
      </style>
    </div>
  );
};

Box.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Box.defaultProps = {
  className: '',
};

export default Box;
