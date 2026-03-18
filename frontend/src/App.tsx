import { useViewContext } from './Context/ViewContext';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import MainView from './components/Views/MainView';
import KanbanView from './components/Views/KanbanView';
import ScrumView from './components/Views/ScrumView';
import GamificationView from './components/Views/GamificationView';
import WikiView from './components/Views/WikiView';
import PlanView from './components/Views/PlanView';
import TasksView from './components/Views/TasksView';
import SubTasksView from './components/Views/SubTasksView';
import LogView from './components/Views/LogView';

const App = () => {
  const { activeView } = useViewContext();

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
      case 'plan':
        return <PlanView />;
      case 'tasks':
        return <TasksView />;
      case 'subtasks':
        return <SubTasksView />;
      case 'log':
        return <LogView />;
      default:
        return <MainView />;
    }
  };

  return (
    <div className='flex justify-center bg-gray-200 min-h-screen'>
      <div className='flex min-h-screen bg-gray-200 max-w-7xl w-full mx-auto'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Topbar />
          <div className='flex-1 m-4 mt-8 overflow-auto border border-gray-200 rounded-3xl'>
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
