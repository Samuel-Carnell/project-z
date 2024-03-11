import { CreateTask } from 'components/project/task-detail/create-task';
import { UpdateTask } from 'components/project/task-detail/update-task';
import { useConfig } from 'config';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

export const AppPage = () => {
	const config = useConfig();
	const { hash } = useLocation();
	const navigate = useNavigate();
	const taskId = hash.substring(hash.indexOf('#') + 1);

	useEffect(() => {
		fetch(`${config.apiServer}/api/query/session`, { credentials: 'include' })
			.then((x) => x.json())
			.then((x) => {
				if (x.loggedIn === false) {
					navigate('/sign-in');
				}
			});
	}, []);

	let task;
	if (taskId === 'new') {
		task = <CreateTask className="relative z-20 w-[990px] border-l border-[#e6e6e6] shadow-[0_0_16px_0_#e6e6e6]" />;
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
