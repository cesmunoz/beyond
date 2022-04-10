import React from 'react';
import { render } from '@testing-library/react';

import Loading from '..';

describe('<Loading />', () => {
  test('should render correctly', async () => {
    const { asFragment } = render(<Loading />);

    expect(asFragment()).toMatchSnapshot();
  });
});
