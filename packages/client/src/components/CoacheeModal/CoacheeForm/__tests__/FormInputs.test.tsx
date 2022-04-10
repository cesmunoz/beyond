import React from 'react';
import { render, screen } from '@testing-library/react';

import FormInputs from '../FormInputs';

describe('<FormInputs />', () => {
  it('should render correctly on desktop', () => {
    render(<FormInputs.Email mobile={false} />);
    const email = screen.getByRole('textbox', { name: /Correo electrónico/i });
    expect(email.parentElement).toHaveClass('w-6/12');

    render(<FormInputs.FullName mobile={false} />);
    const fullName = screen.getByRole('textbox', { name: 'Nombre y apellido (opcional)' });
    expect(fullName.parentElement).toHaveClass('w-6/12 ml-2');

    render(<FormInputs.Company />);
    const company = screen.getByRole('textbox', { name: 'Empresa (opcional)' });
    expect(company.parentElement).toHaveClass('mr-2');
  });

  it('should render correctly on mobile', () => {
    render(<FormInputs.Email mobile />);
    const email = screen.getByRole('textbox', { name: /Correo electrónico/i });
    expect(email.parentElement).not.toHaveClass('w-6/12');

    render(<FormInputs.FullName mobile />);
    const fullName = screen.getByRole('textbox', { name: 'Nombre y apellido (opcional)' });
    expect(fullName.parentElement).not.toHaveClass('w-6/12 ml-2');

    render(<FormInputs.Company />);
    const company = screen.getByRole('textbox', { name: 'Empresa (opcional)' });
    expect(company.parentElement).toHaveClass('mr-2');
  });
});
