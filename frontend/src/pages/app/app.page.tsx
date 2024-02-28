import { CreateTask } from 'components/project/task-detail/create-task';
import { UpdateTask } from 'components/project/task-detail/update-task';
import { Outlet, useLocation } from 'react-router';

export const AppPage = () => {
	const { hash } = useLocation();
	const taskId = hash.substring(hash.indexOf('#') + 1);

	let task;
	if (taskId === 'new') {
		task = (
			<CreateTask
				className="relative z-20 w-[990px] border-l border-[#e6e6e6] shadow-[0_0_16px_0_#e6e6e6]"
				projectId="aa27f680-d644-454c-bad4-1db11c0d762c"
			/>
		);
	} else if (taskId != '') {
		task = (
			<UpdateTask
				className="relative z-20 w-[990px] border-l border-[#e6e6e6] shadow-[0_0_16px_0_#e6e6e6]"
				taskSlug={taskId}
				key={taskId}
			/>
		);
	}

	return (
		<div className="flex h-[100vh] w-[100vw]">
			<Outlet />
			{task}
		</div>
	);
};
