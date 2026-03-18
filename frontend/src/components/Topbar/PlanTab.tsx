import { useViewContext } from '../../Context/ViewContext';

const PlanTab = () => {
  const { dispatch } = useViewContext();

  return (
    <button
      className='px-3 py-1 hover:bg-blue-100 rounded'
      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'plan' })}
    >
      Plan
    </button>
  );
};

export default PlanTab;
