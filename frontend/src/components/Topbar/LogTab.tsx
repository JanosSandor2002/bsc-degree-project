import { useViewContext } from '../../Context/ViewContext';

const LogTab = () => {
  const { dispatch } = useViewContext();

  return (
    <button
      className='w-20 bg-blue-600 border border-blue-300 rounded-3xl px-3 py-1 hover:bg-blue-400'
      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'log' })}
    >
      Log
    </button>
  );
};

export default LogTab;
