import { AiFillHome } from 'react-icons/ai';
import { useViewContext } from '../../Context/ViewContext';

const MainIcon = () => {
  const { dispatch } = useViewContext();

  return (
    <button
      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'main' })}
      className='
        w-[80px] h-[80px]           
        bg-blue-900
        rounded-3xl
        flex items-center justify-center
        hover:!bg-blue-500
        shadow-md
        transition-all duration-200
      '
    >
      <AiFillHome className='text-white w-[48px] h-[48px]' />
    </button>
  );
};

export default MainIcon;
