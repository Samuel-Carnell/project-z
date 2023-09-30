import { KanbanBoard } from 'components/project/kanban-board';
import { twMerge } from 'tailwind-merge';

export const KanbanPage = ({ className }: { className?: string }) => {
	return (
		<div className={twMerge('flex', className)}>
			<KanbanBoard className="min-h-0 min-w-0 flex-1 overflow-auto" />
		</div>
	);
};
