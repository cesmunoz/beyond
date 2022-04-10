import React from 'react';
import Router from 'next/router';
import { mocked } from 'ts-jest/utils';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { useDispatch } from 'react-redux';
import { SignIn } from 'pages/signIn';
import { login } from 'utils/auth';
import { ROOT } from 'constants/routes';

import useTypedSelector from 'selectors/typedSelector';

jest.mock('utils/auth');
jest.mock('next/router');
jest.mock('selectors/typedSelector', () => jest.fn());
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

const mockUseDispatch = useDispatch as jest.Mock;
const mockUseTypedSelector = useTypedSelector as jest.Mock;
const mockDispatch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockUseDispatch.mockImplementation(() => mockDispatch);
  mockUseTypedSelector.mockImplementation(() => false);
});

const fireChange = (input: Element, value: string): void => {
  fireEvent.change(input, {
    target: {
      value,
    },
  });
};

describe('<SignIn />', () => {
  test('should render required errors for inputs', async () => {
    render(<SignIn />);

    const submitButton = screen.getByRole('button', { name: 'Ingresar' });

    await act(async () => {
      await fireEvent.click(submitButton);
    });

    const errors = screen.getAllByRole('alert');

    const [email, password] = errors;

    expect(errors).toHaveLength(2);
    expect(email).toHaveTextContent('El usuario es requerido');
    expect(password).toHaveTextContent('La contraseña es requerida');
  });

  test('should render API error on submit', async () => {
    mocked(login, true).mockImplementation(() => Promise.resolve('UserNotFoundException'));

    render(<SignIn />);

    const userInput = screen.getByRole('textbox', { name: 'Usuario' });
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Ingresar' });

    fireChange(userInput, 'email');
    fireChange(passwordInput, 'password');

    await act(async () => {
      await fireEvent.click(submitButton);
    });

    const apiErrorMessage = screen.getByRole('alert');

    expect(apiErrorMessage).toHaveTextContent('Usuario inexistente');
  });

  test('should call signin function with the correct parameters', async () => {
    const mockedLogin = mocked(login, true).mockImplementation(() => Promise.resolve(''));
    Router.push = jest.fn();

    const email = 'falecci@morean.co';
    const password = 'blablabla';

    render(<SignIn />);

    const userInput = screen.getByRole('textbox', { name: 'Usuario' });
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Ingresar' });

    fireChange(userInput, email);
    fireChange(passwordInput, password);

    await act(async () => {
      await fireEvent.click(submitButton);
    });

    expect(mockedLogin.mock.calls).toHaveLength(1);
    expect(mockedLogin.mock.calls[0]).toEqual([email, password]);
    expect(Router.push).toHaveBeenCalledWith(ROOT);
  });
});
