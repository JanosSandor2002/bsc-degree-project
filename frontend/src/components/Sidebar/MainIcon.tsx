import { useViewContext } from '../../Context/ViewContext';

const MainIcon = () => {
  const { dispatch } = useViewContext();

  return (
    <button
      className='w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold'
      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'main' })}
    >
      M
    </button>
  );
};

export default MainIcon;
