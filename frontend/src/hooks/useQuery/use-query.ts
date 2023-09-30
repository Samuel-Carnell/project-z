import { Where } from 'blinkdb';
import { useCallback, useRef, useSyncExternalStore } from 'react';
import type { Database, TableModel } from 'worker/db';
import { workerInterface } from 'worker/worker-manager';

type Result<T> =
	| {
			status: 'fetching';
			data?: undefined;
	  }
	| {
			status: 'fetched';
			data: T;
	  };

export const useWatch = <T extends keyof Database, M = TableModel<Database[T]>>(
	table: T,
	where?: Where<M>,
): Result<Array<M>> => {
	const resultRef = useRef<Result<Array<M>>>({ status: 'fetching' });

	const subscribe = useCallback((onStoreChange: () => void) => {
		const subscription = workerInterface
			.watch({
				table,
				query: { where },
			})
			.subscribe({
				next: (data) => {
					resultRef.current = { status: 'fetched', data: data as Array<M> };
					onStoreChange();
				},
			});

		return () => subscription.unsubscribe();
	}, []);

	return useSyncExternalStore(subscribe, () => resultRef.current);
};

export const useFindById = <T extends keyof Database, M = TableModel<Database[T]>>(
	table: T,
	id: string,
): Result<M | undefined> => {
	const resultRef = useRef<Result<M>>({ status: 'fetching' });

	const subscribe = useCallback((onStoreChange: () => void) => {
		workerInterface
			.findById({
				table,
				id,
			})
			.then((data) => {
				resultRef.current = { status: 'fetched', data: data as M };
				onStoreChange();
			});
		return () => {};
	}, []);

	return useSyncExternalStore(subscribe, () => resultRef.current);
};
