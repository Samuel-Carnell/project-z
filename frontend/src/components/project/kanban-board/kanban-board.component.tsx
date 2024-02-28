import { DndContext, DragOverlay, PointerSensor, useSensor } from '@dnd-kit/core';
import { Observable } from 'rxjs';
import { twMerge } from 'tailwind-merge';
import { Card } from './card.component';
import { Column } from './column.component';
import { useKanban } from './use-kanban';

// const moveTask = async (rawTask: Extract<Objs, { type: 'task' }>, newStatus: string) => {
// 	await fetch('http://localhost:5000/action/move-task', {
// 		method: 'POST',
// 		headers: { 'content-type': 'application/json' },
// 		body: JSON.stringify({
// 			taskId: rawTask.id,
// 			statusId: {
// 				fromVersion: rawTask.statusId.version,
// 				value: newStatus,
// 			},
// 		}),
// 	});
// };

export const KanbanBoard = ({ className, projectId$ }: { className?: string; projectId$: Observable<string> }) => {
	const { columns, dragStatus, dispatch, setDragStatus, getRawTaskById } = useKanban(projectId$);

	const sensor = useSensor(PointerSensor, {
		activationConstraint: {
			delay: 150,
			distance: 2,
		},
	});

	return (
		<div className={twMerge('h-full bg-[#F4F5F8] px-9 py-6', dragStatus && 'cursor-grab', className)}>
			<DndContext
				sensors={[sensor]}
				onDragStart={({ active }) => {
					setDragStatus({ task: { ...active.data.current?.task }, overId: active.data.current?.task.statusId });
				}}
				onDragOver={({ over }) => {
					if (dragStatus?.task == null) {
						return;
					}
					setDragStatus({ overId: over?.data.current?.statusId ?? undefined, task: dragStatus.task });
				}}
				onDragEnd={async () => {
					if (dragStatus == null) {
						return;
					}
					const { overId, task } = dragStatus;

					if (overId == null) {
						setDragStatus(null);
						return;
					}

					dispatch(
						{ type: 'move', newStatus: overId, taskId: task.id, at: Date.now() },
						{ type: 'move', newStatus: task.statusId, taskId: task.id, at: Date.now() },
					);
					const rawTask = getRawTaskById(task.id);
					if (rawTask !== undefined) {
						//moveTask(rawTask, overId).catch(() => revertChange());
					}

					setDragStatus(null);
				}}
			>
				<div className="flex h-full gap-9">
					{columns
						?.sort((a, b) => a.status.index - b.status.index)
						.map(({ tasks, status }) => <Column key={status.id} status={status} tasks={tasks as any} />)}
				</div>
				<DragOverlay dropAnimation={null}>
					{dragStatus !== null && (
						<Card
							key={dragStatus?.task?.id}
							readonly
							task={dragStatus?.task as any}
							className="scale-105 shadow-[0px_9px_17px_#D9D9D9]"
						/>
					)}
				</DragOverlay>
			</DndContext>
		</div>
	);
};
