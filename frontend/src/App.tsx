import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import MainView from './components/Views/MainView';
import KanbanView from './components/Views/KanbanView';
import ScrumView from './components/Views/ScrumView';
import GamificationView from './components/Views/GamificationView';
import WikiView from './components/Views/WikiView';

const App = () => {
  const [activeView, setActiveView] = useState<
    'main' | 'kanban' | 'scrum' | 'gamification' | 'wiki'
  >('main');

  const renderView = () => {
    switch (activeView) {
      case 'main':
        return <MainView />;
      case 'kanban':
        return <KanbanView />;
      case 'scrum':
        return <ScrumView />;
      case 'gamification':
        return <GamificationView />;
      case 'wiki':
        return <WikiView />;
      default:
        return <MainView />;
    }
  };

  return (
    <div className='flex justify-center bg-gray-200 min-h-screen'>
      <div className='flex min-h-screen bg-gray-50 max-w-7xl w-full mx-auto'>
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className='flex-1 flex flex-col'>
          <Topbar />

          <div className='flex-1 p-4 overflow-auto'>{renderView()}</div>
        </div>
      </div>
    </div>
  );
};

export default App;
