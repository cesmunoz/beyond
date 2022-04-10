import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { useDispatch } from 'react-redux';
import useTypedSelector from 'selectors/typedSelector';
import { getCoachee } from 'api/coachees';

import CoacheeDetail from '..';

jest.mock('selectors/typedSelector', () => jest.fn());
jest.mock('next/router');
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

const mockDispatch = jest.fn();
const mockUseDispatch = useDispatch as jest.Mock;
const mockUseTypedSelector = useTypedSelector as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockUseDispatch.mockImplementation(() => mockDispatch);
});

const coachee = {
  coacheeId: '1',
  fullName: 'john',
  email: 'john.smit@morean.co',
  company: 'Morean',
  status: 'active',
  birthDate: '',
  birthTime: '',
  city: '',
  country: '',
  processes: [],
  processId: '',
  type: '',
  date: '',
};

describe('<CoacheeDetail />', () => {
  test('should call `getCoachee` on render', () => {
    mockUseTypedSelector.mockImplementation(() => ({
      loading: { coacheeDetail: false },
      mobile: false,
      coachees: [coachee],
    }));

    render(<CoacheeDetail coacheeId="1" />);

    expect(mockDispatch.mock.calls[0][0].toString()).toEqual(getCoachee('1').toString());
  });

  test('should render a loading spinner while fetching data', () => {
    mockUseTypedSelector.mockImplementation(() => ({
      loading: { coachees: true },
      mobile: false,
      coachees: [coachee],
    }));

    render(<CoacheeDetail coacheeId="1" />);

    const spinner = screen.getByRole('progressbar');

    expect(spinner).toBeInTheDocument();
  });

  test('should render coachee information', () => {
    mockUseTypedSelector.mockImplementationOnce(() => coachee);

    render(<CoacheeDetail coacheeId="1" />);

    const birthDate = screen.getByText('Fecha de nacimiento');
    expect(birthDate).toBeInTheDocument();
  });
});
