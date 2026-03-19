import { useViewContext } from '../../Context/ViewContext';

const PlanTab = () => {
  const { dispatch } = useViewContext();

  return (
    <button
      className='w-20 bg-blue-900 px-3  py-1 hover:bg-blue-400 border border-blue-300 rounded-3xl'
      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'plan' })}
    >
      Plan
    </button>
  );
};

export default PlanTab;
