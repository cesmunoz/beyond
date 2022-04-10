import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import CoacheeInfo from '..';

describe('<CoacheeInfo />', () => {
  test('should render coachee correctly with information', async () => {
    render(
      <CoacheeInfo birthCity="Recoleta" birthCountry="Argentina" birthDate="2020-01-01T10:10:10" />,
    );

    expect(screen.getByText('Recoleta')).toBeInTheDocument();
    expect(screen.getByText('Argentina')).toBeInTheDocument();
  });

  test('should render coachee correctly without information', async () => {
    render(<CoacheeInfo />);
    expect(screen.getByText('Fecha de nacimiento')).toBeInTheDocument();
  });
});
