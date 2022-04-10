import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import TextField from '..';

describe('<TextField />', () => {
  test('should render correctly', () => {
    render(<TextField name="User" label="User" id="user" />);

    const result = screen.getByRole('textbox', { name: 'User' });

    expect(result).toHaveClass('input border-solid w-full border-b border-gray-600');
  });

  test('should render with error correctly', () => {
    const error = 'Wrong username!';
    render(<TextField name="User" error={error} label="User" id="user" />);

    const result = screen.getByRole('textbox', { name: 'User' });
    const errorMessage = screen.getByText(error);

    expect(result).toHaveClass('input border-solid w-full border-b-2 border-red-500');
    expect(errorMessage).toHaveClass('text-red-500 text-xs my-1');
  });
});
