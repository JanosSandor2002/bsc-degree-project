import PlanTab from './PlanTab';
import TasksTab from './TasksTab';
import SubtasksTab from './SubtasksTab';
import LogTab from './LogTab';
import ProjectSelect from './ProjectSelect';
import UserMenu from './UserMenu';

const Topbar = () => {
  return (
    <header className='h-16 bg-white flex items-center justify-between px-4 shadow'>
      <div className='flex space-x-2'>
        <PlanTab />
        <TasksTab />
        <SubtasksTab />
        <LogTab />
      </div>
      <div className='flex items-center space-x-4'>
        <ProjectSelect />
        <UserMenu />
      </div>
    </header>
  );
};

export default Topbar;
