import MainIcon from './MainIcon';
import KanbanIcon from './KanbanIcon';
import ScrumIcon from './ScrumIcon';
import GamificationIcon from './GamificationIcon';
import WikiIcon from './WikiIcon';
const Sidebar = () => {
  return (
    <aside className='w-26 h-[440px] ml-5 pt-[10px] bg-blue-100 border border-gray-200 rounded-3xl p-4 flex flex-col items-center space-y-4 shadow-lg mx-2 mt-6'>
      <MainIcon />
      <KanbanIcon />
      <ScrumIcon />
      <GamificationIcon />
      <WikiIcon />
    </aside>
  );
};

export default Sidebar;
