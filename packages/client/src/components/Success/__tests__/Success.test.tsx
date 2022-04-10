import React from 'react';
import { render, screen } from '@testing-library/react';
import Success from '..';

describe('<Success />', () => {
  it('should render correctly', () => {
    const subtitle = 'This is my subtitle';

    render(<Success title={subtitle} />);

    const successImg = screen.getByRole('img', { name: '¡Listo!' });
    const doneHeader = screen.getByRole('heading', { name: '¡Listo!' });
    const subtitleHeader = screen.getByRole('heading', { name: subtitle });

    expect(successImg).toBeInTheDocument();
    expect(doneHeader).toHaveClass('mt-6 mb-4');
    expect(subtitleHeader).toHaveTextContent(subtitle);
    expect(subtitleHeader).toHaveClass('text-3xl font-extrabold');
  });
});
