import { useViewContext } from '../../Context/ViewContext';

const SubtasksTab = () => {
  const { dispatch } = useViewContext();

  return (
    <button
      className='px-3 py-1 hover:bg-blue-100 rounded'
      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'subtasks' })}
    >
      SubTasks
    </button>
  );
};

export default SubtasksTab;
