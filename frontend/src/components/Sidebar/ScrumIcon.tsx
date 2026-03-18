import { useViewContext } from '../../Context/ViewContext';

const ScrumIcon = () => {
  const { dispatch } = useViewContext();

  return (
    <button
      className='w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-white font-bold'
      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'scrum' })}
    >
      S
    </button>
  );
};

export default ScrumIcon;
