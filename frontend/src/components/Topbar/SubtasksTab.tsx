import { useViewContext } from '../../Context/ViewContext';

const SubtasksTab = () => {
  const { dispatch } = useViewContext();

  return (
    <button
      className='w-25 bg-blue-700 border border-blue-300 rounded-3xl px-3 py-1 hover:bg-blue-100'
      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'subtasks' })}
    >
      SubTasks
    </button>
  );
};

export default SubtasksTab;
