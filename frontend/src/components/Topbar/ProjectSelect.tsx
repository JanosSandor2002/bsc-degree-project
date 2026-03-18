import { useState } from 'react';

const ProjectSelect = () => {
  const [project, setProject] = useState('Projekt 1');

  return (
    <select
      value={project}
      onChange={(e) => setProject(e.target.value)}
      className='w-40 h-12 bg-blue-400 border border-blue-300 rounded-3xl px-2 py-1 border'
    >
      <option>Projekt 1</option>
      <option>Projekt 2</option>
      <option>Projekt 3</option>
    </select>
  );
};

export default ProjectSelect;
