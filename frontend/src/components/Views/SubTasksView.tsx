import { useEffect } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import { fetchSubtasks } from '../../Context/Actions';

const SubTasksView = () => {
  const { state, dispatch } = useGlobalContext();

  useEffect(() => {
    if (state.token && state.tasks.length > 0) {
      state.tasks.forEach((task) => {
        fetchSubtasks(dispatch, state.token!, task._id);
      });
    }
  }, [state.tasks]);

  return (
    <div className='p-6 flex flex-col gap-3'>
      <h2 className='text-2xl font-bold'>Subtasks</h2>

      {state.loading && <p>Betöltés...</p>}

      {state.subtasks.map((sub) => (
        <div
          key={sub._id}
          className='bg-white border border-blue-200 rounded-2xl p-4'
        >
          <p className='font-semibold'>{sub.title}</p>
          <p className='text-sm text-gray-500'>{sub.status}</p>
        </div>
      ))}
    </div>
  );
};

export default SubTasksView;
