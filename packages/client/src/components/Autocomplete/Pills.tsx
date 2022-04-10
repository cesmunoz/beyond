import React from 'react';
import PropTypes from 'prop-types';
import { Pair } from 'types';

type PillsProps = {
  items: Pair[];
  onItemRemoval: (item: string) => void;
};

const Pills = ({ items, onItemRemoval }: PillsProps): JSX.Element => (
  <ul className="h-12">
    {items.map(item => (
      <li
        className="inline-block bg-gray-300 text-black-800 text-xs mt-4 py-2 pl-4 pr-3 mr-2 rounded-full tracking-wide"
        key={item.key}
      >
        {item.value}

        <button type="button" onClick={(): void => onItemRemoval(item.key)} className="pl-2">
          X
        </button>
      </li>
    ))}
  </ul>
);

Pills.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onItemRemoval: PropTypes.func.isRequired,
};

export default Pills;
