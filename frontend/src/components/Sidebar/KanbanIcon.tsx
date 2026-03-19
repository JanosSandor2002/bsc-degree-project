import { BsFillKanbanFill } from 'react-icons/bs';

import { useViewContext } from '../../Context/ViewContext';

const KanbanIcon = () => {
  const { dispatch } = useViewContext();

  return (
    <button
      className='
        w-[80px] h-[80px]           
        bg-blue-800
        rounded-3xl
        flex items-center justify-center
        hover:!bg-blue-400
        shadow-md
        transition-all duration-200'
      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'kanban' })}
    >
      <BsFillKanbanFill className='text-white w-[48px] h-[48px]' />
    </button>
  );
};

export default KanbanIcon;
