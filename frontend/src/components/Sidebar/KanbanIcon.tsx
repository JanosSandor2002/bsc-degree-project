import { useViewContext } from '../../Context/ViewContext';

const KanbanIcon = () => {
  const { dispatch } = useViewContext();

  return (
    <button
      className='w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold'
      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'kanban' })}
    >
      K
    </button>
  );
};

export default KanbanIcon;
