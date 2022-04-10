import React from 'react';
import { render } from 'test-utils';
import { screen } from '@testing-library/dom';

import Box from '..';

describe('<Box />', () => {
  test('should render a mobile Box', () => {
    render(<Box>hey</Box>, {
      state: {
        mobile: true,
      },
    });

    const box = screen.getByRole('region');
    const children = screen.getByText('hey');

    expect(box).toHaveClass('full-size');
    expect(children).toBeInTheDocument();
  });

  test('should render a desktop Box', () => {
    render(<Box>hey</Box>, {
      state: {
        mobile: false,
      },
    });

    const box = screen.getByRole('region');

    expect(box).toHaveClass('desktop-paper');
  });
});
