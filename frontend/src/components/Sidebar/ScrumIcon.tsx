import { PiProjectorScreenChartBold } from 'react-icons/pi';
import { useViewContext } from '../../Context/ViewContext';

const ScrumIcon = () => {
  const { dispatch } = useViewContext();

  return (
    <button
      className='
        w-[80px] h-[80px]           
        bg-blue-700
        rounded-3xl
        flex items-center justify-center
        hover:!bg-blue-500
        shadow-md
        transition-all duration-200'
      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'scrum' })}
    >
      <PiProjectorScreenChartBold className='text-white w-[48px] h-[48px]' />
    </button>
  );
};

export default ScrumIcon;
