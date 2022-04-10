import React from 'react';
import { render, RenderResult, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import useTypedSelector from 'selectors/typedSelector';

import Form from '..';

jest.mock('selectors/typedSelector', () => jest.fn());
const mockUseTypedSelector = useTypedSelector as jest.Mock;

const handleOnClose = jest.fn();
const handleNewCoacheeSubmit = jest.fn();

const renderCoacheeModal = (error = ''): RenderResult =>
  render(
    <Form
      visible
      error={error}
      onNewCoacheeSubmit={handleNewCoacheeSubmit}
      onClose={handleOnClose}
    />,
  );

beforeEach(() => {
  jest.clearAllMocks();
});

describe('<Form />', () => {
  test('should render correctly on desktop', async () => {
    mockUseTypedSelector.mockImplementation(() => ({
      mobile: false,
      loading: { newCoachee: false },
    }));
    renderCoacheeModal();

    const email = screen.getByRole('textbox', { name: 'Correo electrónico' });
    const fullName = screen.getByRole('textbox', { name: 'Nombre y apellido (opcional)' });
    const company = screen.getByRole('textbox', { name: 'Empresa (opcional)' });
    const buttons = screen.getAllByRole('button');

    expect(email.parentElement?.parentElement).toHaveClass('flex justify-between');
    expect(fullName.parentElement?.parentElement).toHaveClass('flex justify-between');
    expect(company.parentElement?.parentElement).toHaveClass('flex pt-4 w-6/12');

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Cancelar');
    expect(buttons[1]).toHaveTextContent('Agregar nuevo coachee');
  });

  test('should render correctly on mobile', async () => {
    mockUseTypedSelector.mockImplementation(() => ({
      mobile: true,
      loading: { newCoachee: false },
    }));
    renderCoacheeModal();

    const email = screen.getByRole('textbox', { name: 'Correo electrónico' });
    const fullName = screen.getByRole('textbox', { name: 'Nombre y apellido (opcional)' });
    const company = screen.getByRole('textbox', { name: 'Empresa (opcional)' });
    const buttons = screen.getAllByRole('button');

    expect(email.parentElement?.parentElement).not.toHaveClass('flex justify-between');
    expect(fullName.parentElement?.parentElement).not.toHaveClass('flex justify-between');
    expect(company.parentElement?.parentElement).not.toHaveClass('flex pt-4 w-6/12');

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Agregar nuevo coachee');
    expect(buttons[1]).toHaveTextContent('Cancelar');
  });

  test('should validate correctly', async () => {
    mockUseTypedSelector.mockImplementation(() => ({
      mobile: true,
      loading: { newCoachee: false },
    }));
    renderCoacheeModal();

    const submitButton = screen.getByRole('button', { name: 'Agregar nuevo coachee' });

    await act(async () => {
      await fireEvent.click(submitButton);
    });

    const errorMessage = screen.getByRole('alert');

    expect(errorMessage).toHaveTextContent('El correo electrónico es requerido');
  });

  test(`should call 'onClose' on close`, async () => {
    mockUseTypedSelector.mockImplementation(() => ({
      mobile: true,
      loading: { newCoachee: false },
    }));
    renderCoacheeModal();

    const closeButton = screen.getByRole('button', { name: 'Cancelar' });

    await act(async () => {
      await fireEvent.click(closeButton);
    });

    expect(handleOnClose).toHaveBeenCalled();
  });

  test(`should call 'onNewCoacheeSubmit' on submit`, async () => {
    mockUseTypedSelector.mockImplementation(() => ({
      mobile: true,
      loading: { newCoachee: false },
    }));
    renderCoacheeModal();

    const submitButton = screen.getByRole('button', { name: 'Agregar nuevo coachee' });

    await act(async () => {
      await fireEvent.click(submitButton);
    });

    const errorMessage = screen.getByRole('alert');

    expect(errorMessage).toHaveTextContent('El correo electrónico es requerido');
  });

  test('should display an error corectly', () => {
    mockUseTypedSelector.mockImplementation(() => ({
      mobile: true,
      loading: { newCoachee: false },
    }));

    const error = 'API Errrrrrrrrrrrrrror';

    renderCoacheeModal(error);

    const errorMessages = screen.getAllByRole('alert');

    expect(errorMessages).toHaveLength(1);
    expect(errorMessages[0]).toHaveTextContent(error);
  });
});
