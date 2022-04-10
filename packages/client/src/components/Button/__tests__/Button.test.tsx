import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import Button from '..';

describe('<Button />', () => {
  test('should render a button', async () => {
    render(<Button type="submit" text="my button" />);

    const result = screen.getByText('my button') as HTMLButtonElement;

    expect(result).toBeDefined();
    expect(result.type).toBe('submit');
  });

  test('should render a loading inside the button', async () => {
    render(<Button loading text="my button" />);

    const spinner = screen.getByRole('progressbar');

    expect(spinner).toBeDefined();
  });
});
