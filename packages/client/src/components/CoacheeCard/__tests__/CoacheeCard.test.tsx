import React from 'react';
import { RenderResult } from '@testing-library/react';

import { render } from 'test-utils';
import CoacheeCard from '..';

const renderCoachee = (status = 'active'): RenderResult =>
  render(
    <CoacheeCard displayName="falecci@morean.co" company="Morean" coacheeId="1" status={status} />,
    {
      state: {
        mobile: false,
      },
    },
  );

describe('<CoacheeCard />', () => {
  test('should render an active coachee correctly', async () => {
    const { asFragment } = renderCoachee();

    expect(asFragment()).toMatchSnapshot();
  });
  test('should render an inactive coachee correctly', async () => {
    const { asFragment } = renderCoachee('inactive');

    expect(asFragment()).toMatchSnapshot();
  });
});
