import { NewTaskDetail, TaskDetail } from 'components/project/task-detail';
import { Route, Routes, useLocation } from 'react-router';
import ProjectPage from './project/project.page';

export const AppPage = () => {
	const { hash } = useLocation();
	const taskId = hash.substring(hash.indexOf('#') + 1);

	let task;
	if (taskId === 'new') {
		task = (
			<NewTaskDetail
				className="relative z-20 w-[990px] border-l border-[#e6e6e6] shadow-[0_0_16px_0_#e6e6e6]"
				projectId="aa27f680-d644-454c-bad4-1db11c0d762c"
			/>
		);
	} else if (taskId) {
		task = (
			<TaskDetail
				key={taskId}
				className="relative z-20 w-[990px] border-l border-[#e6e6e6] shadow-[0_0_16px_0_#e6e6e6]"
				taskId={taskId}
			/>
		);
	}

	return (
		<div className="flex h-[100vh] w-[100vw]">
			{/* <FpsView /> */}
			<Routes>
				<Route path=":projectId/*" element={<ProjectPage className="min-w-0 flex-1" />} />
			</Routes>
			{task}
		</div>
	);
};
