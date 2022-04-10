import { useState } from 'react';
import cn from 'classnames';
import { noop } from 'utils/testUtils';
import useStyles from './styles';

type AccordionSectionProps = {
  index: number;
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
};

const AccordionSection = ({
  index,
  isOpen,
  title,
  children,
}: AccordionSectionProps): JSX.Element => {
  const classes = useStyles();
  const [opened, setOpened] = useState(isOpen);

  const handleClick = (): void => setOpened(!opened);

  return (
    <>
      <header
        role="button"
        className={cn(
          classes.header,
          'focus:outline-none flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none border-b',
        )}
        onClick={handleClick}
        onKeyPress={noop}
        tabIndex={index}
      >
        <span className={classes.title}>{title}</span>
        <div className="rounded-full w-7 h-7 flex items-center justify-center bg-indigo">
          {opened && (
            <svg
              aria-hidden="true"
              data-reactid="281"
              fill="none"
              height="24"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          )}
          {!opened && (
            <svg
              aria-hidden="true"
              className=""
              data-reactid="266"
              fill="none"
              height="24"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </div>
      </header>
      <div
        className={cn(classes.contentSection, {
          [classes.contentOpened]: opened,
        })}
      >
        {children}
      </div>
    </>
  );
};

export default AccordionSection;
