import { KanbanBoard } from 'components/project/kanban-board';
import { objectType, useEventSource } from 'eventsource';
import { usePersistent } from 'hooks/use-persistent';
import { useParams } from 'react-router';
import { filter, map } from 'rxjs';
import { twMerge } from 'tailwind-merge';

export const KanbanPage = ({ className }: { className?: string }) => {
	const { projectId } = useParams();

	if (projectId === undefined) {
		throw new Error('projectId is undefined');
	}

	const source$ = useEventSource();
	const projectId$ = usePersistent(() =>
		source$.pipe(
			objectType('project'),
			map((obj) => obj.find((x) => x.urlId.value === projectId)?.id),
			filter((x): x is string => x !== undefined),
		),
	);

	return (
		<div className={twMerge('flex', className)}>
			<KanbanBoard className="min-h-0 min-w-0 flex-1 overflow-auto" projectId$={projectId$} />
		</div>
	);
};
