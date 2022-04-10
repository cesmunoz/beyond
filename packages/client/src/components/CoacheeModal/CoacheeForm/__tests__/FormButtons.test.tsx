import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import FormButtons from '../FormButtons';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('<FormButtons />', () => {
  describe('new coachee button', () => {
    it('should render correctly on mobile', () => {
      render(<FormButtons.New loading={false} mobile />);

      const newBtn = screen.getByRole('button', { name: 'Agregar nuevo coachee' });

      expect(newBtn).toHaveClass('my-2');
      expect(newBtn).not.toHaveClass('ml-2');
    });

    it('should render correctly on desktop', () => {
      render(<FormButtons.New loading={false} mobile={false} />);

      const newBtn = screen.getByRole('button', { name: 'Agregar nuevo coachee' });

      expect(newBtn).not.toHaveClass('my-2');
      expect(newBtn).toHaveClass('ml-2');
      expect(newBtn).toHaveClass('w-full');
    });
  });

  describe('cancel button', () => {
    const onClose = jest.fn();

    it('should render correctly', () => {
      render(<FormButtons.Cancel onClose={onClose} />);

      const cancelBtn = screen.getByRole('button', { name: 'Cancelar' });

      expect(cancelBtn).toHaveClass('w-auto');
    });

    it('should call `onClose` on click', () => {
      render(<FormButtons.Cancel onClose={onClose} />);

      const cancelBtn = screen.getByRole('button', { name: 'Cancelar' });

      fireEvent.click(cancelBtn);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
