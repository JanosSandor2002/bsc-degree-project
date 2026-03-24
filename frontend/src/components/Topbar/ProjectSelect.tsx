import { useGlobalContext } from '../../Context/GlobalContext';

const ProjectSelect = () => {
  const { state, dispatch } = useGlobalContext();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = state.projects.find((p) => p._id === e.target.value);

    dispatch({ type: 'SET_SELECTED_PROJECT', payload: selected });
  };

  return (
    <select
      value={state.selectedProject?._id || ''}
      onChange={handleChange}
      className='w-40 h-12 bg-blue-400 border border-blue-300 rounded-3xl px-2 py-1'
    >
      <option value=''>Select project</option>

      {state.projects.map((project) => (
        <option key={project._id} value={project._id}>
          {project.name}
        </option>
      ))}
    </select>
  );
};

export default ProjectSelect;
