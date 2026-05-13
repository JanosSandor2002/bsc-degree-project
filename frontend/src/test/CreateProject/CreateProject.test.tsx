import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CreateProject from '../../components/CreateProject/CreateProject';

vi.mock('../../Context/GlobalContext', () => ({
  useGlobalContext: () => ({
    state: { token: 'fake-token' },
    dispatch: vi.fn(),
  }),
}));

vi.mock('../../Context/Actions', () => ({
  addProject: vi.fn(() => Promise.resolve()),
}));

describe('CreateProject', () => {
  it('rendereli a kezdő képernyőt a GitHub és Manual gombokkal', () => {
    render(<CreateProject />);

    expect(screen.getByText('Choose import method')).toBeInTheDocument();
    expect(screen.getByText('⊞ Import from GitHub')).toBeInTheDocument();
    expect(screen.getByText('✎ Create manually')).toBeInTheDocument();
  });

  it('manual flow működik — lép a Project Details lépésre', () => {
    render(<CreateProject />);

    fireEvent.click(screen.getByText('✎ Create manually'));

    expect(screen.getByText('Project Details')).toBeInTheDocument();
  });

  it('hozzáad contributort a manual flow-ban', () => {
    render(<CreateProject />);

    fireEvent.click(screen.getByText('✎ Create manually'));

    const input = screen.getByPlaceholderText('Username');
    const addBtn = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.click(addBtn);

    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('nem enged üres contributort hozzáadni', () => {
    render(<CreateProject />);

    fireEvent.click(screen.getByText('✎ Create manually'));

    const input = screen.getByPlaceholderText('Username');
    const addBtn = screen.getByText('Add');

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(addBtn);

    fireEvent.change(input, { target: { value: 'ValidUser' } });
    fireEvent.click(addBtn);

    const contributors = screen.getAllByText('ValidUser');
    expect(contributors).toHaveLength(1);
  });

  it('a step indicator megjelenik manual flow választása után', () => {
    render(<CreateProject />);

    fireEvent.click(screen.getByText('✎ Create manually'));

    expect(screen.getByText('Project Details')).toBeInTheDocument();
    const nextBtn = screen.getByText('Next: Task Groups →');
    expect(nextBtn).toBeDisabled();
  });

  it('a Next gomb aktív, ha van projekt neve', () => {
    render(<CreateProject />);

    fireEvent.click(screen.getByText('✎ Create manually'));

    const nameInput = screen.getByPlaceholderText('My awesome project');
    fireEvent.change(nameInput, { target: { value: 'Teszt Projekt' } });

    const nextBtn = screen.getByText('Next: Task Groups →');
    expect(nextBtn).not.toBeDisabled();
  });
});
