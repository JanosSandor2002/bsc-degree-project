import { useEffect } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import { fetchTasks } from '../../Context/Actions';

const TasksView = () => {
  const { state, dispatch } = useGlobalContext();

  useEffect(() => {
    if (state.token && state.selectedProject?._id) {
      fetchTasks(dispatch, state.token, state.selectedProject._id);
    }
  }, [state.selectedProject?._id]);

  return (
    <div className='p-6 flex flex-col gap-3'>
      <h2 className='text-2xl font-bold'>Tasks</h2>

      {state.loading && <p>Betöltés...</p>}

      {state.tasks.map((task) => (
        <div
          key={task._id}
          className='bg-white border border-blue-200 rounded-2xl p-4'
        >
          <p className='font-semibold'>{task.title}</p>
          <p className='text-sm text-gray-500'>{task.status}</p>
        </div>
      ))}
    </div>
  );
};

export default TasksView;
