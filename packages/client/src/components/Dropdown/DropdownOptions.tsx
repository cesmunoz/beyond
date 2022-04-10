import React from 'react';
import cn from 'classnames';
import { GetItemPropsOptions } from 'downshift';
import { Nullable } from '@beyond/lib/types';
import { Pair } from 'types';
import { noop } from 'utils/testUtils';

type DropdownOptionsProps = {
  getItemProps?: (options: GetItemPropsOptions<Pair>) => void;
  getMenuProps?: () => void;
  inputValue: string;
  items: Pair[];
  visible: boolean;
};

export default ({
  visible,
  items,
  getMenuProps = noop,
  getItemProps = noop,
  inputValue,
}: DropdownOptionsProps): Nullable<JSX.Element> => {
  if (!visible) {
    return null;
  }

  const filteredItems = items.filter(item => {
    const value = item.value.toLocaleLowerCase();
    return value.includes(inputValue.toLocaleLowerCase());
  });

  return (
    <ul
      {...getMenuProps()}
      className="py-1 rounded-b w-autocomplete shadow-xs absolute bg-white block overflow-y-scroll max-h-autocomplete"
    >
      {!filteredItems.length && (
        <li key="no-results" className="ml-2">
          No hay resultados
        </li>
      )}
      {filteredItems.map((item, index) => (
        <li
          {...getItemProps({
            key: item.key,
            index,
            item,
            className: cn(
              'cursor-pointer hover:font-bold hover:bg-light-blue hover:text-white py-2',
            ),
          })}
        >
          <span className="ml-2">{item.value}</span>
        </li>
      ))}
    </ul>
  );
};
