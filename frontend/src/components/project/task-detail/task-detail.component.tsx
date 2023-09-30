import {
	IconArrowBarToRight,
	IconClipboardList,
	IconDots,
	IconLink,
	IconPointFilled,
	TablerIconsProps,
} from '@tabler/icons-react';
import { Editor } from 'components/common/inputs/Editor';
import { Select } from 'components/common/inputs/select/select.component';
import { useFindById, useWatch } from 'hooks/useQuery';
import { ComponentType, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { v4 as uuid } from 'uuid';
import { workerInterface } from 'worker/worker-manager';

const QuickAction = ({ icon: Icon }: { icon: ComponentType<TablerIconsProps> }) => (
	<div className="cursor-pointer rounded-[4px] p-1.5 hover:bg-[#f0f3f9]">
		<Icon strokeWidth={2} size={18} color="rgb(107, 111, 118)" />
	</div>
);

const StatusField = ({ statusId, onChange }: { statusId: string; onChange?: (value: string) => void }) => {
	const projectQuery = useFindById('project_table', '');
	if (projectQuery.status === 'fetching') {
		return null;
	}

	const statuses = projectQuery.data!.statuses;

	return (
		<Select
			className="flex flex-1 cursor-pointer items-center rounded-[4px] border border-transparent px-3 py-2 hover:border-[#eff1f4] hover:bg-[#fbfbfc]"
			value={statusId}
			onChange={onChange}
			options={statuses.sort((a, b) => a.order - b.order).map((x) => ({ ...x, label: x.title, value: x.id }))}
		>
			{({ option }) => (
				<>
					{/* <IconProgress size={14} /> */}
					<IconPointFilled size={22} className={option.color} />
					<span className="ml-2 text-[12px] font-medium text-[#3c4149]">{option.label}</span>
				</>
			)}
		</Select>
	);
};

const TaskDetailTemplate = ({
	className,
	task,
	onChange,
	onCreate,
}: {
	className?: string;
	task: { slug: string; description: unknown; title: string; statusId: string };
	onChange: (value: Partial<{ slug: string; description: unknown; title: string; statusId: string }>) => void;
	onCreate?: () => void;
}) => {
	const taskDescriptionContainerRef = useRef<HTMLDivElement | null>(null);
	const { pathname } = useLocation();

	return (
		<div className={twMerge('flex min-h-0 flex-col bg-white', className)}>
			<div className="flex items-center border-b border-[#e6e6e6] px-5 py-1">
				<div className="py-1 text-[13px] font-medium text-[#6b6f76]">{task.slug}</div>
				<div className="flex-1" />
				<div className="flex items-center gap-2.5">
					<QuickAction icon={IconDots} />
					<QuickAction icon={IconClipboardList} />
					<QuickAction icon={IconLink} />
					<Link
						to={{
							hash: '',
							pathname,
						}}
						className="cursor-pointer rounded-[4px] p-1 hover:bg-[#f0f3f9]"
					>
						<IconArrowBarToRight strokeWidth={1.5} size={22} color="rgb(107, 111, 118)" />
					</Link>
				</div>
			</div>
			<div className="relative flex min-h-0 flex-1 items-stretch">
				<div
					ref={taskDescriptionContainerRef}
					className="flex min-h-0 flex-1 flex-col overflow-auto px-8 py-3 [scrollbar-width:thin]"
				>
					<input
						className="mb-2 w-full cursor-text rounded text-[22px] font-medium outline-none"
						defaultValue={task.title}
						onChange={(e) => onChange({ title: e.target.value })}
						maxLength={60}
						placeholder="Task Title"
					/>
					<Editor
						className="min-h-0"
						color="rgb(60, 65, 73)"
						value={task.description as any}
						onChange={(value) => onChange({ description: value })}
						container={taskDescriptionContainerRef}
						placeholder="Add Description..."
					/>
				</div>
				<div className="flex min-w-72 flex-col gap-y-2 border-l border-[#e6e6e6] py-3 pl-6 pr-6">
					<div className="flex items-center">
						<span className="w-[90px] text-[12px] font-medium text-[#6b6f76]">Status</span>
						<StatusField statusId={task.statusId} onChange={(statusId) => onChange({ statusId })} />
					</div>
					<div className="mt-2 flex gap-2">
						{onCreate && (
							<button
								onClick={onCreate}
								aria-label="Save issue"
								className="sc-jrcTuL bXKHZU snipcss-W8AH9 style-faDDU flex-1"
								id="style-faDDU"
							>
								Create Task
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export const NewTaskDetail = ({ className, projectId }: { className?: string; projectId: string }) => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [task, setTask] = useState({
		description: [{ type: 'p', children: [{ text: '' }] }] as unknown,
		slug: 'New Task',
		statusId: 'ba7c2ac3-276a-458d-8d4d-ab0f3b5a7e05',
		title: '',
	});

	return (
		<TaskDetailTemplate
			className={className}
			task={task}
			onChange={(diff) => {
				setTask((x) => ({ ...x, ...diff }));
			}}
			onCreate={() => {
				workerInterface.insert({
					table: 'task_table',
					value: {
						id: uuid(),
						description: task.description,
						title: task.title,
						statusId: task.statusId,
						projectId,
						index: 101,
						slug: 'MP-101',
					},
				});
				navigate({
					hash: '',
					pathname,
				});
			}}
		/>
	);
};

export const TaskDetail = ({ className, taskId }: { className?: string; taskId: string }) => {
	const taskResult = useWatch<'task_table'>('task_table', { id: taskId });
	if (taskResult.status === 'fetching') {
		return null;
	}

	const task = taskResult.data[0];

	return (
		<TaskDetailTemplate
			className={className}
			task={task}
			onChange={(diff) => workerInterface.updateById({ table: 'task_table', id: task.id, diff })}
		/>
	);
};
