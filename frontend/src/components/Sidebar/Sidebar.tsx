import HeroLogo from './HeroLogo';
import MainIcon from './MainIcon';
import KanbanIcon from './KanbanIcon';
import ScrumIcon from './ScrumIcon';
import GamificationIcon from './GamificationIcon';

const Sidebar = () => {
  return (
    <aside className='w-20 bg-gray-100 h-screen flex flex-col items-center py-4 space-y-4'>
      <HeroLogo />
      <MainIcon />
      <KanbanIcon />
      <ScrumIcon />
      <GamificationIcon />
    </aside>
  );
};

export default Sidebar;
