import { useViewContext } from '../../Context/ViewContext';

const TasksTab = () => {
  const { dispatch } = useViewContext();

  return (
    <button
      className='w-25 bg-blue-800 border border-blue-300 rounded-3xl px-3 py-1 hover:bg-blue-400'
      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'tasks' })}
    >
      Tasks
    </button>
  );
};

export default TasksTab;
