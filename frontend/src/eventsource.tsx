import { useConfig } from 'config';
import { usePersistent } from 'hooks/use-persistent';
import { ReactNode, createContext, useContext } from 'react';
import { Observable, map, shareReplay, tap } from 'rxjs';

export type Objs =
	| {
			type: 'project';
			id: string;
			title: { version: string; value: string };
			urlId: { version: string; value: string };
	  }
	| {
			type: 'task';
			id: string;
			statusId: { version: string; value: string };
			index: { version: string; value: number };
			title: { version: string; value: string };
			description: { version: string; value: unknown };
	  }
	| {
			type: 'status';
			id: string;
			projectId: { version: string; value: string };
			index: { version: string; value: number };
			title: { version: string; value: string };
			color: { version: string; value: string };
	  };

const createEventSource$ = (apiServer: string) =>
	new Observable<Array<Objs>>((observer) => {
		const source = new EventSource(`${apiServer}/api/query/items`, { withCredentials: true });
		source.addEventListener('data', (event) => {
			const data = JSON.parse(event.data);
			observer.next(data);
		});

		return () => source.close();
	}).pipe(
		tap((x) => console.log('eventsource', x)),
		shareReplay({
			refCount: true,
			bufferSize: 1,
		}),
	);

const eventSourceContext = createContext<Observable<Objs[]> | null>(null);

export const EventSourceProvider = ({ children }: { children?: ReactNode }) => {
	const config = useConfig();
	const eventSource$ = usePersistent(() => createEventSource$(config.apiServer as string));

	return <eventSourceContext.Provider value={eventSource$}>{children}</eventSourceContext.Provider>;
};

export const useEventSource = () => {
	const eventSource$ = useContext(eventSourceContext);

	if (eventSource$ === null) {
		throw new Error('eventSource$ is null');
	}

	return eventSource$;
};

export function filterByType<T extends Objs['type']>(objs: Array<Objs>, type: T) {
	return objs.filter((x): x is Extract<Objs, { type: T }> => x.type === type);
}

export function objectType<T extends Objs['type']>(type: T) {
	return (source$: Observable<Array<Objs>>) => source$.pipe(map((x) => filterByType(x, type)));
}
