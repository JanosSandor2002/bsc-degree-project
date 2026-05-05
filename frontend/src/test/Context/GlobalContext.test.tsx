import { render, screen, fireEvent } from '@testing-library/react';
import { GlobalProvider, useGlobalContext } from '../../Context/GlobalContext';
import { describe, it, expect, vi } from 'vitest';

const TestComponent = () => {
  const { state, dispatch } = useGlobalContext();

  return (
    <div>
      <span>Token: {state.token ?? 'null'}</span>
      <button
        onClick={() =>
          dispatch({
            type: 'SET_USER',
            payload: { user: 'Alice', token: 'abc123' },
          })
        }
      >
        Set User
      </button>
    </div>
  );
};

describe('GlobalContext', () => {
  it('alapértelmezett state-t renderel', () => {
    render(
      <GlobalProvider>
        <TestComponent />
      </GlobalProvider>,
    );

    expect(screen.getByText('Token: null')).toBeInTheDocument();
  });

  it('dispatch frissíti a token-t és user-t', () => {
    render(
      <GlobalProvider>
        <TestComponent />
      </GlobalProvider>,
    );

    fireEvent.click(screen.getByText('Set User'));

    expect(screen.getByText('Token: abc123')).toBeInTheDocument();
  });
});
