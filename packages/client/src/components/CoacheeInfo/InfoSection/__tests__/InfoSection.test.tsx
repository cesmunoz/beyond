import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import InfoSection from '..';

describe('<InfoSection />', () => {
  test('should render correctly the InfoSection component', async () => {
    const labelText = 'This is a label test';
    const valueText = 'This is a value test';

    render(<InfoSection label={labelText} value={valueText} />);

    expect(screen.getByText(valueText)).toBeInTheDocument();
  });

  test('should render correctly the InfoSection component with empty value', async () => {
    const labelText = 'Label Test';

    render(<InfoSection label={labelText} />);

    expect(screen.getByText(labelText)).toBeInTheDocument();
  });
});
