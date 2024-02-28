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
import { useConfig } from 'config';
import { Objs, useEventSource } from 'eventsource';
import { useInteractive } from 'hooks/use-interactive';
import { ComponentType, useCallback, useRef, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Observable, filter, map } from 'rxjs';
import { twMerge } from 'tailwind-merge';

const QuickAction = ({ icon: Icon }: { icon: ComponentType<TablerIconsProps> }) => (
	<div className="cursor-pointer rounded-[4px] p-1.5 hover:bg-[#f0f3f9]">
		<Icon strokeWidth={2} size={18} color="rgb(107, 111, 118)" />
	</div>
);

const StatusField = ({
	statusId,
	onChange,
	statuses$,
}: {
	statusId: string;
	onChange?: (value: string) => void;
	statuses$: Observable<Array<{ title: string; id: string; index: number; color: string }>>;
}) => {
	return (
		<Select
			className="flex flex-1 cursor-pointer items-center rounded-[4px] border border-transparent px-3 py-2 hover:border-[#eff1f4] hover:bg-[#fbfbfc]"
			value={statusId}
			onChange={onChange}
			options={useObservableValue(statuses$, [])
				.sort((a, b) => a.index - b.index)
				.map((x) => ({ ...x, label: x.title, value: x.id }))}
		>
			{({ option }) => (
				<>
					<IconPointFilled size={22} className={option?.color ?? ''} />
					<span className="ml-2 text-[12px] font-medium text-[#3c4149]">{option?.label ?? ''}</span>
				</>
			)}
		</Select>
	);
};

type Action = {
	key: keyof Value;
	value: unknown;
};

type Value = {
	id: string;
	title: string;
	description: any;
	slug: string;
	statusId: string;
	innerValue?: any;
};

function useObservableValue<T>($: Observable<T>, _default: T) {
	const valueRef = useRef(_default);
	const subscribe = useCallback(
		(update: () => void) => {
			const subscription = $.subscribe({
				next: (_value) => {
					valueRef.current = _value;
					update();
				},
			});
			return () => subscription.unsubscribe();
		},
		[$],
	);
	return useSyncExternalStore(
		subscribe,
		useCallback(() => valueRef.current, []),
	);
}

const defaultValue = {
	title: '',
	description: null,
	statusId: '',
	id: '',
	slug: '',
};

function useUpdateTask(task$: Observable<Value>) {
	const [value$, dispatch] = useInteractive(
		task$,
		(task: Value, action: Action) => {
			return {
				...task,
				[action.key]: action.value,
			};
		},
		defaultValue,
	);

	const state = useObservableValue(value$, defaultValue);

	return {
		value: state,
		updateTaskState: ({ key, value }: Action) => {
			dispatch({ key, value }, { key, value: state[key] });
		},
	};
}

export const UpdateTask = ({ className, taskSlug }: { className?: string; taskSlug: string }) => {
	const config = useConfig();
	const source$ = useEventSource();
	const taskDescriptionContainerRef = useRef<HTMLDivElement | null>(null);
	const { pathname } = useLocation();
	const task$ = source$.pipe(
		map((objs) =>
			objs
				.filter((obj): obj is Extract<Objs, { type: 'task' }> => obj.type === 'task')
				.map((x) => ({
					id: x.id,
					statusId: x.statusId.value,
					title: x.title.value,
					description: x.description.value,
					slug: `MP-${x.index.value}`,
					innerValue: x,
				}))
				.find((x) => x.slug === taskSlug),
		),
		filter((x): x is NonNullable<typeof x> => x !== undefined),
	);
	const statuses$ = source$.pipe(
		map((objs) =>
			objs
				.filter((obj): obj is Extract<Objs, { type: 'status' }> => obj.type === 'status')
				.map((x) => ({
					id: x.id,
					index: x.index.value,
					color: x.color.value,
					title: x.title.value,
				})),
		),
	);
	const { updateTaskState, value } = useUpdateTask(task$);

	return (
		<div className={twMerge('flex min-h-0 flex-col bg-white', className)}>
			<div className="flex items-center border-b border-[#e6e6e6] px-5 py-1">
				<div className="py-1 text-[13px] font-medium text-[#6b6f76]">{value.slug}</div>
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
						defaultValue={value.title}
						onChange={(e) => {
							updateTaskState({ key: 'title', value: e.target.value });
							fetch(`${config.apiServer}/api/action/rename-task`, {
								method: 'POST',
								headers: { 'content-type': 'application/json' },
								body: JSON.stringify({
									taskId: value.id,
									title: {
										fromVersion: value.innerValue.title.version,
										value: e.target.value,
									},
								}),
							});
						}}
						maxLength={60}
						placeholder="Task Title"
					/>
					{value.description != null && (
						<Editor
							className="min-h-0"
							color="rgb(60, 65, 73)"
							value={value.description as any}
							onChange={(description: any) => {
								updateTaskState({ key: 'description', value: description });
								fetch(`${config.apiServer}/api/action/update-task-description`, {
									method: 'POST',
									headers: { 'content-type': 'application/json' },
									body: JSON.stringify({
										taskId: value.id,
										description: {
											fromVersion: value.innerValue.description.version,
											value: description,
										},
									}),
								});
							}}
							container={taskDescriptionContainerRef}
							placeholder="Add Description..."
						/>
					)}
				</div>
				<div className="flex min-w-72 flex-col gap-y-2 border-l border-[#e6e6e6] py-3 pl-6 pr-6">
					<div className="flex items-center">
						<span className="w-[90px] text-[12px] font-medium text-[#6b6f76]">Status</span>
						<StatusField
							statusId={value.statusId}
							onChange={(statusId: any) => {
								updateTaskState({ key: 'statusId', value: statusId });
								fetch(`${config.apiServer}/api/action/move-task`, {
									method: 'POST',
									headers: { 'content-type': 'application/json' },
									body: JSON.stringify({
										taskId: value.id,
										statusId: {
											fromVersion: value.innerValue.statusId.version,
											value: statusId,
										},
									}),
								});
							}}
							statuses$={statuses$}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
