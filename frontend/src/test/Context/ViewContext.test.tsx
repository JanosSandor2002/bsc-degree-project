import { render, screen, fireEvent } from '@testing-library/react';
import { ViewProvider, useViewContext } from '../../Context/ViewContext';
import { describe, it, expect } from 'vitest';

const TestComponent = () => {
  const { activeView, dispatch } = useViewContext();

  return (
    <div>
      <span>Current View: {activeView}</span>
      <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'tasks' })}>
        Switch to Tasks
      </button>
    </div>
  );
};

describe('ViewContext', () => {
  it('alapértelmezett view-t renderel', () => {
    render(
      <ViewProvider>
        <TestComponent />
      </ViewProvider>,
    );

    expect(screen.getByText('Current View: main')).toBeInTheDocument();
  });

  it('dispatch frissíti az activeView-t', () => {
    render(
      <ViewProvider>
        <TestComponent />
      </ViewProvider>,
    );

    fireEvent.click(screen.getByText('Switch to Tasks'));
    expect(screen.getByText('Current View: tasks')).toBeInTheDocument();
  });
});
