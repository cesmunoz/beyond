import React from 'react';
import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { useDispatch } from 'react-redux';

import useTypedSelector from 'selectors/typedSelector';

import { getCoachees } from 'api/coachees';
import { Coachees } from 'pages/coachees';
import { sleep } from 'utils/testUtils';
import APIStatus from 'constants/apiStatus';
import { COACH } from '@beyond/lib/constants';
import { ValidAny } from '@beyond/lib/types';

jest.mock('selectors/typedSelector', () => jest.fn());
jest.mock('next/router', () => ({
  useRouter: (): ValidAny => ({ pathname: '/Coachees', query: {} }),
  query: {},
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

const mockUseDispatch = useDispatch as jest.Mock;
const mockUseTypedSelector = useTypedSelector as jest.Mock;
const mockDispatch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockUseDispatch.mockImplementation(() => mockDispatch);
});

describe('<Coachees />', () => {
  test('should call `getCoaches` on render', () => {
    mockUseTypedSelector.mockImplementation(() => ({
      loading: { coachees: false },
      auth: { role: COACH, fullName: 'Federico Aleci' },
      mobile: false,
      coachees: [],
      api: { newCoachee: APIStatus.Idle },
    }));

    render(<Coachees />);

    // this is the only way to test thunks right now.
    expect(mockDispatch.mock.calls[0][0].toString()).toEqual(getCoachees().toString());
  });

  test('should render just a button when empty on mobile', () => {
    mockUseTypedSelector.mockImplementation(() => ({
      loading: { coachees: false },
      auth: { role: COACH, fullName: 'Federico Aleci' },
      mobile: true,
      coachees: [],
      api: { newCoachee: APIStatus.Idle },
    }));

    render(<Coachees />);

    const spinner = screen.queryByRole('progressbar');
    const header = screen.getByRole('heading', { name: 'Coachees' });
    const button = screen.getByRole('button', { name: /nuevo coachee/i });

    expect(spinner).not.toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('should render just a header and button when empty on desktop', () => {
    mockUseTypedSelector.mockImplementation(() => ({
      loading: { coachees: false },
      auth: { role: COACH, fullName: 'Federico Aleci' },
      mobile: false,
      coachees: [],
      api: { newCoachee: APIStatus.Idle },
    }));

    render(<Coachees />);

    const spinner = screen.queryByRole('progressbar');
    const header = screen.getByRole('heading', { name: 'Coachees' });
    const button = screen.getByRole('button', { name: /nuevo coachee/i });

    expect(spinner).not.toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('should render a loading spinner while fetching data', () => {
    mockUseTypedSelector.mockImplementation(() => ({
      loading: { coachees: true },
      auth: { role: COACH, fullName: 'Federico Aleci' },
      mobile: false,
      coachees: [],
      api: { newCoachee: APIStatus.Idle },
    }));

    render(<Coachees />);

    const spinner = screen.getByRole('progressbar');

    expect(spinner).toBeInTheDocument();
  });

  test('should render coachees list', () => {
    const email = 'falecci@morean.co';

    mockUseTypedSelector.mockImplementation(() => ({
      loading: { coachees: false },
      auth: { role: COACH, fullName: 'Federico Aleci' },
      mobile: false,
      coachees: [
        {
          email,
          coacheeId: '1',
          status: 'active',
        },
      ],
      api: { newCoachee: APIStatus.Idle },
    }));

    render(<Coachees />);

    const coacheeItem = screen.getByRole('heading', { name: email });

    expect(coacheeItem).toBeInTheDocument();
  });

  test('should open coachee modal when clicking new coachee button', async () => {
    mockUseTypedSelector.mockImplementation(() => ({
      loading: { coachees: false },
      auth: { role: COACH, fullName: 'Federico Aleci' },
      mobile: false,
      coachees: [],
      api: { newCoachee: APIStatus.Idle },
    }));

    render(<Coachees />);

    const newCoacheeBtn = screen.getByRole('button', { name: 'NUEVO COACHEE' });

    await act(async () => {
      await fireEvent.click(newCoacheeBtn);
    });

    // we wait for modal transition
    await sleep(250);

    const newCoacheeModal = screen.getByRole('dialog');

    expect(newCoacheeModal).toBeInTheDocument();
  });
});
