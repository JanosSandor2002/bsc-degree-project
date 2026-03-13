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
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className='flex-1 flex flex-col'>
        {/* Topbar */}
        <Topbar />

        {/* View area */}
        <div className='flex-1 p-4 overflow-auto'>{renderView()}</div>

        {/* Nézetválasztó gombok (demo) */}
        <div className='flex space-x-2 p-2 border-t bg-gray-100'>
          <button
            onClick={() => setActiveView('main')}
            className='px-3 py-1 bg-blue-200 rounded'
          >
            Main
          </button>
          <button
            onClick={() => setActiveView('kanban')}
            className='px-3 py-1 bg-green-200 rounded'
          >
            Kanban
          </button>
          <button
            onClick={() => setActiveView('scrum')}
            className='px-3 py-1 bg-yellow-200 rounded'
          >
            Scrum
          </button>
          <button
            onClick={() => setActiveView('gamification')}
            className='px-3 py-1 bg-purple-200 rounded'
          >
            Gamification
          </button>
          <button
            onClick={() => setActiveView('wiki')}
            className='px-3 py-1 bg-gray-300 rounded'
          >
            Wiki
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
