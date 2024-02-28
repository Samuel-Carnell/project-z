import { Header } from 'components/project/project-header';
import { filterByType, useEventSource } from 'eventsource';
import { usePersistent } from 'hooks/use-persistent';
import { Outlet, useParams } from 'react-router';
import { map } from 'rxjs';
import { twMerge } from 'tailwind-merge';

const ProjectPage = ({ className }: { className?: string }) => {
	const { projectId } = useParams();

	if (projectId === undefined) {
		throw new Error('projectId is undefined');
	}

	const source$ = useEventSource();
	const project$ = usePersistent(() =>
		source$.pipe(
			map((objs) => {
				return filterByType(objs, 'project').find((x) => x.urlId.value === projectId);
			}),
		),
	);

	return (
		<div className={twMerge('flex flex-col', className)}>
			<Header project$={project$} />
			<Outlet />
		</div>
	);
};

export default ProjectPage;
