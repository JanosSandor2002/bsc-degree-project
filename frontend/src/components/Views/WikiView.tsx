import { useState } from 'react';

type FAQItem = {
  q: string;
  a: string;
};

type Section = {
  icon: string;
  title: string;
  description: string;
  items: FAQItem[];
};

const sections: Section[] = [
  {
    icon: '⠿',
    title: 'Getting Started',
    description: 'Everything you need to know before your first project.',
    items: [
      {
        q: 'What is Acxor?',
        a: 'Acxor is a full-stack project management platform built for developers and teams. It combines classic project management tools — Kanban boards, Scrum sprints, task tracking — with a gamification layer that rewards you with XP and levels as you complete work. It was built as a BSc degree project using React, Node.js, MongoDB, and TypeScript.',
      },
      {
        q: 'How do I create an account?',
        a: 'Click the "User" button in the top-right corner and select "Sign In / Sign Up". Fill in your username, email, and password in the Register form and hit Register. Your account is created instantly — no email verification required. You are automatically logged in and a JWT token is stored in your browser for future sessions.',
      },
      {
        q: 'How do I log in and out?',
        a: 'Open the User menu (top-right) and select "Sign In / Sign Up". Enter your email and password and click Login. To log out, open the same menu and click "Log Out". Your session token is removed from local storage and you are returned to the Sign page.',
      },
      {
        q: 'Is my data private?',
        a: 'Yes. Each user can only see their own projects. All API routes are protected with JWT authentication — every request must include a valid token in the Authorization header. Projects, tasks, subtasks, and sprints are all scoped to the logged-in user.',
      },
    ],
  },
  {
    icon: '❐',
    title: 'Projects',
    description: 'How to create, manage, and organise your projects.',
    items: [
      {
        q: 'How do I create a new project?',
        a: 'Open the User menu and click "Create Project". You can choose between two modes: Manual and GitHub. In Manual mode, you enter the project name, description, and contributors by username, then build out task groups with tasks and subtasks. In GitHub mode, you provide your GitHub username and a personal access token, select a repository, and Acxor automatically imports all open issues as tasks.',
      },
      {
        q: 'What is a task group?',
        a: 'A task group is a named collection of tasks with a shared deadline — similar to a milestone or an epic. When creating a project manually, you can define multiple task groups. Each group has a name, a deadline date, and contains one or more tasks. Task groups help you organise work into logical phases or sprints.',
      },
      {
        q: 'How does GitHub import work?',
        a: 'You provide your GitHub username and a personal access token (with repo scope). Acxor fetches all repositories you own or collaborate on. Once you select a repository, it fetches all open issues via the GitHub API and creates a single task group named after the repo, with each issue title becoming a task. Contributors you add are matched to existing Acxor users by username.',
      },
      {
        q: 'Can I add contributors to a project?',
        a: 'Yes. When creating a project — either manually or via GitHub import — you can add contributor usernames. Acxor looks up each username in the database and links those users to the project. Contributors are stored separately from viewers and the admin, giving you a foundation for role-based access in the future.',
      },
      {
        q: 'Can I delete a project?',
        a: 'Yes. Deleting a project also deletes all tasks and subtasks associated with it — this is handled automatically on the backend to keep your data clean. Only the user who created the project (the owner) can delete it.',
      },
    ],
  },
  {
    icon: '✓',
    title: 'Tasks & Subtasks',
    description: 'Creating, editing, and tracking individual pieces of work.',
    items: [
      {
        q: 'How do I create a task?',
        a: 'Navigate to the Tasks view using the "Tasks" button in the top bar. Select a project from the dropdown, then click "+ New task". Enter a title, optionally set a deadline and an initial status, and click "Add task". The task is immediately saved to the database and appears in the list.',
      },
      {
        q: 'What statuses can a task have?',
        a: 'Every task and subtask can be in one of three states: Open (not yet started), InProgress (actively being worked on), or Done (completed). You can change the status at any time by editing the task. Status changes are reflected instantly across all views — Kanban, Scrum, and Plan.',
      },
      {
        q: 'How do I edit or delete a task?',
        a: 'In the Tasks view, each task card has an "Edit" and a "Delete" button. Clicking Edit expands an inline form directly on the card — no modal needed — where you can update the title, deadline, and status. Click Save to confirm or Cancel to discard. Clicking Delete will prompt for confirmation before permanently removing the task.',
      },
      {
        q: 'What are subtasks and how do I add them?',
        a: 'Subtasks are smaller units of work that belong to a parent task. Go to the Subtasks view — tasks are grouped by their parent. At the bottom of each task group, click "+ Add subtask", type a title, and press Enter or click Add. Subtasks have the same three statuses as tasks and can be edited or deleted individually.',
      },
      {
        q: 'Can I assign a task to a team member?',
        a: 'The assignedTo field exists on every task in the database and is fully supported by the API. Assignment UI is on the roadmap — for now, tasks can be assigned programmatically or via API. The Kanban and Scrum views already display the assigned username when present.',
      },
    ],
  },
  {
    icon: '⠿',
    title: 'Kanban Board',
    description: 'Visualising your workflow across three columns.',
    items: [
      {
        q: 'How does the Kanban board work?',
        a: 'The Kanban view displays all tasks for the selected project in three columns: To Do (Open), In Progress (InProgress), and Done. Each column shows the task count as a badge. Task cards show the title, assigned user, and deadline. Select a different project from the top bar to switch boards instantly.',
      },
      {
        q: 'Can I move tasks between columns by dragging?',
        a: "Drag-and-drop is on the roadmap. Currently you can change a task's status via the Edit button in the Tasks view, which updates the column it appears in on the Kanban board in real time.",
      },
      {
        q: 'Does the Kanban board update in real time?',
        a: 'The board re-fetches tasks whenever you change the selected project. Any status change made in the Tasks view is reflected immediately in the global state via the Redux-style reducer, so switching to the Kanban view shows the latest data without a page refresh.',
      },
    ],
  },
  {
    icon: '⟳',
    title: 'Scrum & Sprints',
    description: 'Running time-boxed iterations with your team.',
    items: [
      {
        q: 'What is a sprint in Acxor?',
        a: 'A sprint is a time-boxed period with a name, a start date, and an end date. Tasks can be assigned to a sprint from the backlog. The Scrum view shows a Kanban-style board filtered to the selected sprint, plus a summary bar with the sprint dates, total task count, and done count.',
      },
      {
        q: 'How do I create a sprint?',
        a: 'In the Scrum view, click "+ New Sprint". Enter a name (e.g. "Sprint 1"), a start date, and an end date, then click Create Sprint. The sprint appears immediately in the sprint selector row at the top of the view. An "active" badge is shown on any sprint whose date range includes today.',
      },
      {
        q: 'How do I add tasks to a sprint?',
        a: 'Tasks not yet assigned to any sprint appear in the Backlog section at the bottom of the Scrum view. Select the sprint you want to fill from the sprint selector, then click "+ Add to Sprint" next to any backlog task. The task moves out of the backlog and into the sprint board immediately.',
      },
      {
        q: 'Can I delete a sprint?',
        a: "Yes — click the ✕ button next to a sprint's name. The sprint is deleted from the database. Tasks that were part of that sprint are not deleted; they simply lose their sprint assignment and return to the backlog.",
      },
    ],
  },
  {
    icon: '▦',
    title: 'Plan View',
    description: 'High-level progress tracking across all your projects.',
    items: [
      {
        q: 'What does the Plan view show?',
        a: 'The Plan view loads all your projects and fetches the task list for each one in parallel. It then displays a progress card per project showing: a status badge (Not started / Just started / In progress / On track / Completed), a percentage progress bar based on Done tasks, and a breakdown of Done, In Progress, Open, and Total task counts.',
      },
      {
        q: 'How is the progress percentage calculated?',
        a: 'Progress = (number of Done tasks) ÷ (total tasks) × 100, rounded to the nearest integer. A project with no tasks shows 0%. The progress bar changes colour depending on the percentage: red for 0–29%, amber for 30–59%, blue for 60–99%, and green for 100%.',
      },
      {
        q: 'Does the Plan view update automatically?',
        a: 'The Plan view re-fetches task stats every time it mounts or the projects list changes. If you add or complete tasks in another view and then switch to Plan, the latest data is loaded fresh.',
      },
    ],
  },
  {
    icon: '✦',
    title: 'Gamification & XP',
    description: 'How the reward system works.',
    items: [
      {
        q: 'What is the XP system?',
        a: 'Every user has an XP (experience points) counter and a level. Completing a task triggers an XP reward. The amount is defined by the xpReward field on each task (default 0, configurable via the API). As XP accumulates, you level up — creating a sense of progress tied directly to your productivity.',
      },
      {
        q: 'How does levelling up work?',
        a: 'The XP threshold for each level is: level × 100 XP. So level 1 requires 100 XP to advance to level 2, level 2 requires 200 XP to reach level 3, and so on. If a single task awards enough XP to cross multiple thresholds, you level up multiple times at once — your remaining XP carries over correctly.',
      },
      {
        q: 'Where can I see my level and XP?',
        a: 'Your current level and XP are shown in the hero section of the Main view when you are logged in. The Account view (User menu → Account) is planned to show full profile details including XP history and level progress.',
      },
    ],
  },
  {
    icon: '⊞',
    title: 'Tech Stack',
    description: 'What Acxor is built with under the hood.',
    items: [
      {
        q: 'What is the frontend built with?',
        a: 'The frontend is a React 18 single-page application written in TypeScript. State management uses React Context with a useReducer-based store (similar to Redux but without the extra dependency). Routing between views is handled by a custom ViewContext. Styling is done entirely with Tailwind CSS. The project was scaffolded with Vite for fast development builds.',
      },
      {
        q: 'What is the backend built with?',
        a: 'The backend is a Node.js REST API built with Express and written in TypeScript. Data is stored in MongoDB via Mongoose. Authentication uses bcryptjs for password hashing and JSON Web Tokens (JWT) for stateless session management. The backend is structured into routes, controllers, models, middleware, and services.',
      },
      {
        q: 'How is the app tested?',
        a: 'The frontend uses Vitest and React Testing Library. Tests cover the context reducers, action creators (with mocked axios), and key UI components like Sign, CreateProject, TasksView, and SubTasksView. The backend uses Jest with Supertest for integration tests against an in-memory MongoDB instance (mongodb-memory-server), covering auth, projects, tasks, subtasks, sprints, and all service layers.',
      },
      {
        q: 'How does API authentication work?',
        a: 'After login or registration, the server returns a JWT signed with a secret key. The frontend stores this token and attaches it as a Bearer token in the Authorization header of every subsequent API request. The backend protect middleware verifies the token, looks up the user in the database, and attaches the user object to the request. Protected routes return 401 if the token is missing or invalid.',
      },
    ],
  },
];

const WikiView = () => {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className='h-full overflow-auto'>
      {/* ── Hero ── */}
      <div className='relative px-8 pt-10 pb-8 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl overflow-hidden'>
        <div className='absolute -top-8 -right-8 w-56 h-56 rounded-full bg-blue-600 opacity-25' />
        <div className='absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-blue-800 opacity-30' />
        <div className='relative z-10'>
          <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-3 tracking-wide'>
            Documentation
          </div>
          <h1 className='text-3xl font-bold text-white mb-2'>Acxor Wiki</h1>
          <p className='text-blue-200 text-sm max-w-lg leading-relaxed'>
            Everything you need to know about how Acxor works — from creating
            your first project to understanding the XP system. Click any
            question to expand the answer.
          </p>
        </div>
      </div>

      {/* ── Sections ── */}
      <div className='px-6 py-6 flex flex-col gap-6'>
        {sections.map((section) => (
          <div key={section.title}>
            {/* Section header */}
            <div className='flex items-center gap-3 mb-3'>
              <div className='w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center text-base shrink-0'>
                {section.icon}
              </div>
              <div>
                <p className='font-bold text-gray-800 text-base leading-tight'>
                  {section.title}
                </p>
                <p className='text-xs text-gray-500'>{section.description}</p>
              </div>
            </div>

            {/* Accordion items */}
            <div className='flex flex-col gap-2'>
              {section.items.map((item, i) => {
                const key = `${section.title}-${i}`;
                const isOpen = !!openMap[key];
                return (
                  <div
                    key={key}
                    className={`border rounded-2xl overflow-hidden transition-all ${
                      isOpen
                        ? 'border-blue-300 bg-white'
                        : 'border-blue-100 bg-white hover:border-blue-200'
                    }`}
                  >
                    {/* Question row */}
                    <button
                      className='w-full flex items-center justify-between gap-3 px-4 py-3 text-left'
                      onClick={() => toggle(key)}
                    >
                      <span className='text-sm font-semibold text-gray-800'>
                        {item.q}
                      </span>
                      <span
                        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isOpen
                            ? 'bg-blue-700 text-white rotate-45'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                        style={{
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}
                      >
                        +
                      </span>
                    </button>

                    {/* Answer */}
                    {isOpen && (
                      <div className='px-4 pb-4 border-t border-blue-100'>
                        <p className='text-sm text-gray-600 leading-relaxed pt-3'>
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer strip ── */}
      <div className='mx-6 mb-6 bg-blue-900 rounded-2xl px-6 py-4 flex items-center justify-between gap-3'>
        <div>
          <p className='text-white font-semibold text-sm'>
            Still have questions?
          </p>
          <p className='text-blue-400 text-xs mt-0.5'>
            Check the source code or explore the app to find out more.
          </p>
        </div>
        <div className='shrink-0 bg-blue-700 text-blue-200 text-xs px-3 py-1.5 rounded-xl'>
          v1.0 · BSc Project
        </div>
      </div>
    </div>
  );
};

export default WikiView;
