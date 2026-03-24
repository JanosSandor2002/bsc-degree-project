import { useViewContext } from './Context/ViewContext';
import { useGlobalContext } from './Context/GlobalContext';
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
import User from './components/UserMenu/User';
import Mails from './components/Mails/Mails';
import CreateProject from './components/CreateProject/CreateProject';
import Sign from './components/Sign/Sign';
import { useEffect } from 'react';
import { fetchProjects } from './Context/Actions';

const App = () => {
  const { activeView } = useViewContext();
  const { state, dispatch } = useGlobalContext();

  useEffect(() => {
    if (state.token) {
      fetchProjects(dispatch, state.token);
    }
  }, [state.token]);

  const renderView = () => {
    switch (activeView) {
      case 'main':
        return <MainView />;
      case 'kanban':
        return !state.user ? <Sign /> : <KanbanView />;
      case 'scrum':
        return !state.user ? <Sign /> : <ScrumView />;
      case 'gamification':
        return !state.user ? <Sign /> : <GamificationView />;
      case 'wiki':
        return <WikiView />;
      case 'plan':
        return !state.user ? <Sign /> : <PlanView />;
      case 'tasks':
        return !state.user ? <Sign /> : <TasksView />;
      case 'subtasks':
        return !state.user ? <Sign /> : <SubTasksView />;
      case 'log':
        return !state.user ? <Sign /> : <LogView />;
      case 'account':
        return !state.user ? <Sign /> : <User />;
      case 'mails':
        return !state.user ? <Sign /> : <Mails />;
      case 'create':
        return !state.user ? <Sign /> : <CreateProject />;
      case 'sign':
        return <Sign />;
      default:
        return <MainView />;
    }
  };

  return (
    <div className='bg-premium flex justify-center min-h-screen'>
      <div className='flex min-h-screen max-w-7xl w-full mx-auto'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Topbar />
          <div className='text-black flex-1 m-4 mt-8 overflow-auto border-10 border-blue-900 rounded-3xl bg-blue-100'>
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
