import PlanTab from './PlanTab';
import TasksTab from './TasksTab';
import SubtasksTab from './SubtasksTab';
import LogTab from './LogTab';
import ProjectSelect from './ProjectSelect';
import UserMenu from './UserMenu';
import HeroLogo from './HeroLogo';

const Topbar = () => {
  return (
    <header className='h-15 mt-4 flex justify-between mr-5 ml-5'>
      {/* Bal oldali gombok */}
      <div className='h-20 w-120 p-3 flex justify-between bg-white border border-gray-300 rounded-3xl flex space-x-2 border border-gray-300 rounded-3xl'>
        <PlanTab />
        <TasksTab />
        <SubtasksTab />
        <LogTab />
      </div>
      <div className='h-20 w-40 p-3 bg-white border border-gray-300 rounded-3xl flex space-x-2 border border-gray-300 rounded-3xl'>
        <HeroLogo />
      </div>
      {/* Jobb oldali menük */}
      <div className='h-20 w-70 p-3 flex justify-between bg-white border border-gray-300 rounded-3xl flex space-x-2 border border-gray-300 rounded-3xl'>
        <ProjectSelect />
        <UserMenu />
      </div>
    </header>
  );
};

export default Topbar;
