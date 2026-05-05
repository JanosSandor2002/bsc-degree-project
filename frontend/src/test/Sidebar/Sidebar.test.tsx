import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../../components/Sidebar/Sidebar';

vi.mock('../../Context/ViewContext', () => ({
  useViewContext: () => ({
    activeView: 'main',
    dispatch: vi.fn(),
  }),
}));

describe('Sidebar', () => {
  it('rendereli az összes ikont (5 gomb)', () => {
    render(<Sidebar />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });

  it('minden gomb kattintható', () => {
    render(<Sidebar />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).not.toBeDisabled();
    });
  });
});
