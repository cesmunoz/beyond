import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import useTypedSelector from '../../../selectors/typedSelector';
import Header from '../Header';
import NavDrawer from '../Header/NavDrawer';
import makeUseStyles from './styles';

type MainProps = {
  activeMenu: string;
  children: React.ReactNode;
};

const Main: React.FC<MainProps> = ({ activeMenu, children }): JSX.Element => {
  const { mobile } = useTypedSelector(state => state);
  const useStyles = makeUseStyles(mobile);
  const classes = useStyles();

  return (
    <>
      {mobile && <Header activeMenu={activeMenu} />}
      <div className="flex-grow h-full items-center">
        <main className="h-full flex overflow-hidden">
          <NavDrawer open={!mobile} />
          <div
            className={cn(classes.mainContainer, {
              'flex justify-center right-0 flex-col items-center w-10/12 h-full ': !mobile,
            })}
          >
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

Main.propTypes = {
  activeMenu: PropTypes.string.isRequired,
  children: PropTypes.node,
};

Main.defaultProps = {
  children: null,
};

export default Main;
