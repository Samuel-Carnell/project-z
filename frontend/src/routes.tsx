import { AppPage } from 'pages/app/app.page';
import { KanbanPage } from 'pages/app/project/kanban/kanban.page';
import ProjectPage from 'pages/app/project/project.page';
import { Projects } from 'pages/app/projects/projects.page';
import { Navigate, Route, Routes } from 'react-router';

export const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/app" element={<AppPage />}>
				<Route path=":projectId" element={<ProjectPage className="min-w-0 flex-1" />}>
					<Route path="kanban" element={<KanbanPage className="min-h-0 flex-1" />} />
				</Route>
				<Route path="projects" element={<Projects />} />
			</Route>
			<Route path="/" element={<Navigate to="/app/projects" />} />
		</Routes>
	);
};
