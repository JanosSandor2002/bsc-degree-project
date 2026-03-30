import { render, screen } from '@testing-library/react';
import Topbar from '../../components/Topbar/Topbar';

describe('Topbar', () => {
  it('rendereli a topbart', () => {
    render(<Topbar />);
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header elemre
  });
});
