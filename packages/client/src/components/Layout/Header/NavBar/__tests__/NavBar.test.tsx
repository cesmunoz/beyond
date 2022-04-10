import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import * as Router from 'next/router';

import useTypedSelector from 'selectors/typedSelector';
import { ROOT } from 'constants/routes';
import { COACH } from '@beyond/lib/constants';
import NavBar from '..';

jest.mock('selectors/typedSelector', () => jest.fn());

const mockUseTypedSelector = useTypedSelector as jest.Mock;

describe('<NavBar />', () => {
  let useRouter: jest.SpyInstance;

  beforeEach(() => {
    useRouter = jest.spyOn(Router, 'useRouter');
    useRouter.mockImplementation(() => ({
      pathname: ROOT,
    }));

    mockUseTypedSelector.mockImplementation(() => ({
      mobile: true,
      auth: { role: COACH, fullName: '' },
    }));
  });

  afterEach(() => {
    useRouter.mockRestore();
    mockUseTypedSelector.mockRestore();
  });

  test('should render a span inside the component', async () => {
    render(<NavBar active="Inicio" />);
    const result = screen.getByText('Inicio');
    expect(result).toBeInTheDocument();
  });
});
