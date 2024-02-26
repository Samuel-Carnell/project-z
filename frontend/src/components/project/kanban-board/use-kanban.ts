import { useConfig } from 'config';
import { useInteractive } from 'hooks/use-interactive';
import { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import { BehaviorSubject, Observable, combineLatest, debounceTime, map, shareReplay, switchMap } from 'rxjs';

export type Task = {
	index: number;
	id: string;
	title: string;
	slug: string;
	statusId: string;
};

export type Status = { index: number; id: string; title: string; color: string };

type Value = Task[];

type Action =
	| {
			type: 'move';
			taskId: string;
			newStatus: string;
			at: number;
	  }
	| {
			type: 'delete';
			taskId: string;
			at: number;
	  };

function usePersistent<T>(getValue: () => T) {
	return useState(getValue)[0];
}

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

export type Objs =
	| {
			type: 'task';
			id: string;
			statusId: { version: string; value: string };
			index: { version: string; value: number };
			title: { version: string; value: string };
	  }
	| {
			type: 'status';
			id: string;
			index: { version: string; value: number };
			title: { version: string; value: string };
			color: { version: string; value: string };
	  };

const createEventSource$ = (apiServer: string) =>
	new Observable<Array<Objs>>((observer) => {
		const source = new EventSource(`${apiServer}/api/query/items`);
		source.addEventListener('data', (event) => {
			const data = JSON.parse(event.data);
			observer.next(data);
		});

		return () => source.close();
	}).pipe(shareReplay(1));

export function useKanban() {
	const config = useConfig();
	const eventSource$ = usePersistent(() => createEventSource$(config.apiServer as string));
	const dragStatus$ = usePersistent(() => new BehaviorSubject<{ overId?: string; task: Task } | null>(null));

	const statuses$ = usePersistent(() =>
		eventSource$.pipe(
			map((objects) => {
				return objects
					.filter((obj): obj is Extract<Objs, { type: 'status' }> => obj.type === 'status')
					.map((obj) => ({
						id: obj.id,
						title: obj.title.value,
						color: obj.color.value,
						index: obj.index.value,
					}));
			}),
		),
	);
	const remoteTasks$ = usePersistent(() =>
		eventSource$.pipe(
			map((objects) => {
				return objects.filter((obj): obj is Extract<Objs, { type: 'task' }> => obj.type === 'task');
			}),
		),
	);

	const [localTasks$, dispatch] = useInteractive<Value, Action>(
		usePersistent(() => {
			return remoteTasks$.pipe(
				map((tasks) =>
					tasks.map((obj) => ({
						id: obj.id,
						statusId: obj.statusId.value,
						index: obj.index.value,
						title: obj.title.value,
						slug: `MP-${obj.index.value}`,
					})),
				),
			);
		}),
		(tasks, action) => {
			switch (action.type) {
				case 'move': {
					return tasks.map<Value[number]>((task) => {
						if (task.id == action.taskId) {
							return { ...task, statusId: action.newStatus };
						}
						return task;
					});
				}

				case 'delete': {
					return tasks.filter((task) => {
						return !(task.id === action.taskId);
					});
				}
			}
		},
		[],
	);

	const state$ = usePersistent(() =>
		combineLatest({
			dragStatus: dragStatus$,
			columns: localTasks$.pipe(
				switchMap((tasks) => {
					return dragStatus$.pipe(
						map((dragStatus) => {
							if (dragStatus == null) {
								return tasks.map((task) => ({ ...task, isPreview: false }));
							}

							return tasks.map((task) => {
								if (task.id !== dragStatus.task?.id) {
									return { ...task, isPreview: false };
								}

								return {
									...task,
									statusId: dragStatus.overId,
									isPreview: true,
								};
							});
						}),
					);
				}),
				switchMap((tasks) => {
					return statuses$.pipe(
						map((statuses) =>
							statuses.map((status) => {
								return {
									status,
									tasks: tasks.filter((task) => task.statusId === status.id),
								};
							}),
						),
					);
				}),
			),
			getRawTaskById: remoteTasks$.pipe(map((tasks) => (taskId: string) => tasks.find((task) => task.id === taskId))),
		}).pipe(debounceTime(1)),
	);

	return {
		...useObservableValue(state$, { dragStatus: null, columns: [], getRawTaskById: () => undefined } as const),
		dispatch,
		setDragStatus: useCallback(
			(
				x: {
					overId?: string | undefined;
					task: Task;
				} | null,
			) => dragStatus$.next(x),
			[dragStatus$],
		),
	} as const;
}
