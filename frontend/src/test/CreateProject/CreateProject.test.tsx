import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CreateProject from '../../components/CreateProject/CreateProject';

// 🔥 mock context
vi.mock('../../Context/GlobalContext', () => ({
  useGlobalContext: () => ({
    state: { token: 'fake-token' },
    dispatch: vi.fn(),
  }),
}));

// 🔥 mock addProject
vi.mock('../../Context/Actions', () => ({
  addProject: vi.fn(() => Promise.resolve()),
}));

describe('CreateProject', () => {
  it('rendereli a kezdő képernyőt', () => {
    render(<CreateProject />);

    expect(screen.getByText('Choose project type')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Manual')).toBeInTheDocument();
  });

  it('manual flow működik (next step)', () => {
    render(<CreateProject />);

    const manualBtn = screen.getByText('Manual');
    fireEvent.click(manualBtn);

    expect(screen.getByText('Project Details')).toBeInTheDocument();
  });

  it('hozzáad contributort', () => {
    render(<CreateProject />);

    fireEvent.click(screen.getByText('Manual'));

    const input = screen.getByPlaceholderText('Add Contributor');
    const addBtn = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.click(addBtn);

    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('nem enged üres contributort hozzáadni', () => {
    render(<CreateProject />);

    fireEvent.click(screen.getByText('Manual'));

    const addBtn = screen.getByText('Add');
    fireEvent.click(addBtn);

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(0);
  });
});
