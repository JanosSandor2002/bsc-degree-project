import Sidebar from '../../components/Sidebar/Sidebar';
import { render, screen } from '@testing-library/react';

describe('Sidebar', () => {
  it('rendereli az összes ikont', () => {
    render(<Sidebar />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5); // 5 ikon gomb
  });
});
