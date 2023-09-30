import { Header } from 'components/project/project-header';
import { KanbanPage } from './kanban/kanban.page';
import { Route, Routes } from 'react-router';
import { twMerge } from 'tailwind-merge';

const ProjectPage = ({ className }: { className?: string }) => {
	return (
		<div className={twMerge('flex flex-col', className)}>
			<Header />
			<Routes>
				<Route path="/kanban" element={<KanbanPage className="flex-1 min-h-0" />} />
			</Routes>
		</div>
	);
};

export default ProjectPage;
