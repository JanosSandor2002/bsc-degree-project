import { useViewContext } from '../../Context/ViewContext';

const GamificationIcon = () => {
  const { dispatch } = useViewContext();

  return (
    <button
      className='w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold'
      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'gamification' })}
    >
      G
    </button>
  );
};

export default GamificationIcon;
